import { FileNode, SavedProject } from "../types";

const GITHUB_API_BASE = "https://api.github.com";

export const verifyGithubToken = async (token: string): Promise<string> => {
  const response = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Invalid GitHub Token");
  }

  const data = await response.json();
  return data.login; // Return username
};

export const createRepository = async (token: string, name: string, description: string) => {
  const response = await fetch(`${GITHUB_API_BASE}/user/repos`, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      private: false, // Create public repo for easier Vercel deployment in this demo
      auto_init: true, // Creates a readme initially
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`GitHub Create Repo Error: ${err.message}`);
  }

  return await response.json();
};

export const pushFilesToRepo = async (
  token: string,
  username: string,
  repoName: string,
  files: FileNode[],
  onProgress: (msg: string) => void
) => {
  // Simple implementation: Upload files sequentially using PUT content API
  // A more robust production app would use the Git Tree API for a single commit.
  
  for (const file of files) {
    onProgress(`Pushing ${file.path}...`);
    
    // 1. Check if file exists (to get SHA if we are updating, though usually this is a fresh repo)
    // For a fresh repo with auto_init, README exists.
    
    let sha: string | undefined = undefined;
    try {
        const checkRes = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repoName}/contents/${file.path}`, {
            headers: { Authorization: `token ${token}` }
        });
        if (checkRes.ok) {
            const checkData = await checkRes.json();
            sha = checkData.sha;
        }
    } catch (e) {
        // Ignore error, file probably doesn't exist
    }

    // 2. Upload File
    // Content must be Base64 encoded
    const contentEncoded = btoa(unescape(encodeURIComponent(file.content)));
    
    const res = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repoName}/contents/${file.path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add ${file.path} via AutoDeploy Agent`,
        content: contentEncoded,
        sha: sha, // Include SHA if updating
      }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to upload ${file.path}: ${errorData.message}`);
    }
  }
};

// --- GIST SYNC FOR USER HISTORY ---

const GIST_FILENAME = "autodeploy-data.json";
const GIST_DESC = "autodeploy-sync";

export const loadHistoryFromGist = async (token: string): Promise<SavedProject[] | null> => {
  try {
    // 1. List user's gists
    const res = await fetch(`${GITHUB_API_BASE}/gists`, {
       headers: { Authorization: `token ${token}` }
    });
    if (!res.ok) return null;
    const gists = await res.json();
    
    // 2. Find our specific gist
    const syncGist = gists.find((g: any) => g.description === GIST_DESC);
    if (!syncGist) return null;

    // 3. Get content
    const file = syncGist.files[GIST_FILENAME];
    if (file && file.raw_url) {
       const contentRes = await fetch(file.raw_url);
       const data = await contentRes.json();
       return data.history || [];
    }
    return null;
  } catch (e) {
    console.warn("Failed to load from Gist", e);
    return null;
  }
};

export const saveHistoryToGist = async (token: string, history: SavedProject[]) => {
  try {
    // 1. List to find existing
    const listRes = await fetch(`${GITHUB_API_BASE}/gists`, {
       headers: { Authorization: `token ${token}` }
    });
    const gists = await listRes.json();
    const existingGist = gists.find((g: any) => g.description === GIST_DESC);

    const payload = {
        description: GIST_DESC,
        public: false,
        files: {
            [GIST_FILENAME]: {
                content: JSON.stringify({ history, lastUpdated: new Date().toISOString() })
            }
        }
    };

    if (existingGist) {
        // Update
        await fetch(`${GITHUB_API_BASE}/gists/${existingGist.id}`, {
            method: "PATCH",
            headers: { Authorization: `token ${token}` },
            body: JSON.stringify(payload)
        });
    } else {
        // Create
        await fetch(`${GITHUB_API_BASE}/gists`, {
            method: "POST",
            headers: { Authorization: `token ${token}` },
            body: JSON.stringify(payload)
        });
    }
  } catch (e) {
    console.error("Gist Sync Error", e);
    throw new Error("Failed to sync history to GitHub Gist");
  }
};