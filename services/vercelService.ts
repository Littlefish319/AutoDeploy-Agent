const VERCEL_API_BASE = "https://api.vercel.com";

/**
 * Creates a project on Vercel and links it to the GitHub repository.
 * This triggers an automatic deployment on Vercel's side.
 */
export const createVercelProject = async (
  vercelToken: string,
  projectName: string,
  repoName: string, // full name e.g. user/repo
  githubType: string = "github"
) => {
  try {
    // 1. Check if project exists (optional, but good for idempotency)
    // We skip this for speed and just try to create.

    // 2. Create Project
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        gitRepository: {
          type: githubType,
          repo: repoName,
        },
        framework: "vite", 
        buildCommand: "npm run build",
        outputDirectory: "dist",
        // Force settings to ensure no 404s
        serverlessFunctionRegion: "iad1", // Default to East US
      }),
    });

    if (!response.ok) {
        const err = await response.json();
        // If it already exists, that's fine, we return null and let the user handle it
        if (err.code === 'PROJECT_ALREADY_EXISTS') {
            console.warn("Project already exists on Vercel");
            // Try to construct the URL anyway
            return { name: projectName, html_url: `https://vercel.com/${repoName.split('/')[0]}/${projectName}` };
        }
        throw new Error(err.message || "Failed to create Vercel project");
    }

    const data = await response.json();
    return data; // Contains name, id, and link
  } catch (e) {
    console.error("Vercel API Error:", e);
    throw e;
  }
};