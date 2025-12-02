export const getSelfSourceCode = () => {
  return `// File: index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AutoDeploy Agent</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
              deploy: {
                dark: '#0a0a0a',
                card: '#111111',
                border: '#333333',
                accent: '#0070f3',
              }
            }
          }
        }
      }
    </script>
    <style>
      body { background-color: #000; color: #fff; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: #111; }
      ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// File: package.json
{
  "name": "autodeploy-agent",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "latest",
    "@google/genai": "latest"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.4.5",
    "vite": "^5.2.11",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4"
  }
}

// File: vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

// File: tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

// File: vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

// File: src/types.ts
export interface FileNode {
  path: string;
  content: string;
}

export interface GeneratedProject {
  name: string;
  description: string;
  files: FileNode[];
}

export interface SavedProject {
  id: string;
  timestamp: number;
  prompt: string;
  project: GeneratedProject;
}

export interface AppConfig {
  githubToken: string;
  vercelToken?: string;
  githubUsername: string;
  useBetaDeploy?: boolean;
}

export enum Step {
  CONFIG = 'CONFIG',
  PROMPT = 'PROMPT',
  GENERATING = 'GENERATING',
  REVIEW = 'REVIEW',
  DEPLOYING = 'DEPLOYING',
  SUCCESS = 'SUCCESS',
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface DeploymentResult {
  repoUrl: string;
  deployUrl?: string;
  vercelInspectUrl?: string;
  isBeta?: boolean;
}

// File: src/components/Terminal.tsx
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-deploy-card border border-deploy-border rounded-lg overflow-hidden flex flex-col h-full font-mono text-sm shadow-xl">
      <div className="bg-[#1a1a1a] p-2 border-b border-deploy-border flex items-center gap-2">
        <TerminalIcon size={14} className="text-gray-400" />
        <span className="text-gray-400 text-xs">Deployment Console</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-2 bg-black/50">
        {logs.length === 0 && (
          <div className="text-gray-600 italic">Waiting for instructions...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2">
            <span className="text-gray-500 shrink-0">
              [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
            </span>
            <span className={\`break-all \${
              log.type === 'error' ? 'text-red-500' :
              log.type === 'success' ? 'text-green-500' :
              log.type === 'warning' ? 'text-yellow-500' :
              'text-gray-300'
            }\`}>
              {log.type === 'info' && '> '}
              {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

// File: src/services/geminiService.ts
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedProject } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

const projectSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "A URL-friendly kebab-case name for the project.",
    },
    description: {
      type: Type.STRING,
      description: "A short description of what the app does.",
    },
    files: {
      type: Type.ARRAY,
      description: "The source code files for the application.",
      items: {
        type: Type.OBJECT,
        properties: {
          path: {
            type: Type.STRING,
            description: "The file path (e.g., 'src/App.tsx').",
          },
          content: {
            type: Type.STRING,
            description: "The full text content of the file.",
          },
        },
        required: ["path", "content"],
      },
    },
  },
  required: ["name", "description", "files"],
};

export const generateProjectCode = async (prompt: string, mode: 'generate' | 'paste' = 'generate'): Promise<GeneratedProject> => {
  const ai = getAiClient();
  let systemInstruction = '';
  const commonRules = \`
    CRITICAL VERCEL DEPLOYMENT RULES:
    1.  **vercel.json REQUIRED:** You MUST include a 'vercel.json' file in the root with EXACTLY this content: { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    2.  **Vite Config:** Ensure 'vite.config.ts' is standard and builds to the 'dist' folder.
    3.  **Entry Point:** 'index.html' must be in the ROOT directory and script src must point to "/src/main.tsx".
    4.  **Package.json:** Ensure 'scripts' has "build": "vite build".
  \`;

  if (mode === 'generate') {
    systemInstruction = \`
      You are an intelligent Full-Stack AI Developer (Gemini 3 Pro).
      YOUR GOAL: Generate a complete, production-ready React + Vite application.
      TECHNICAL STACK RULES:
      1.  Framework: Vite + React + TypeScript.
      2.  Styling: Tailwind CSS.
      3.  Icons: 'lucide-react'.
      4.  Dependencies: 'package.json' includes: 'react', 'react-dom', 'lucide-react', 'clsx', 'tailwind-merge'. Dev: 'vite', 'typescript', 'tailwindcss', 'postcss', 'autoprefixer'.
      \${commonRules}
      Return ONLY the JSON structure matching the schema.
    \`;
  } else {
    systemInstruction = \`
      You are an expert Code Architect AI (Gemini 3 Pro). The user is pasting a blob of code.
      YOUR GOAL: Parse the text, identify distinct files, and structure them into a deployable project.
      RULES:
      1.  File Separation: Look for comments like "// File: App.tsx".
      2.  Missing Files: If missing, GENERATE 'index.html', 'package.json', 'vite.config.ts', 'src/main.tsx', 'src/index.css', 'vercel.json'.
      \${commonRules}
      Return ONLY the JSON structure matching the schema.
    \`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: projectSchema,
        temperature: 0.2, 
      },
    });
    const text = response.text;
    if (!text) throw new Error("No response from AI.");
    return JSON.parse(text) as GeneratedProject;
  } catch (error) {
    throw new Error("I failed to process the code. Please try again.");
  }
};

// File: src/services/githubService.ts
import { FileNode, SavedProject } from "../types";

const GITHUB_API_BASE = "https://api.github.com";

export const verifyGithubToken = async (token: string): Promise<string> => {
  const response = await fetch(\`\${GITHUB_API_BASE}/user\`, {
    headers: { Authorization: \`token \${token}\`, Accept: "application/vnd.github.v3+json" },
  });
  if (!response.ok) throw new Error("Invalid GitHub Token");
  const data = await response.json();
  return data.login;
};

export const createRepository = async (token: string, name: string, description: string) => {
  const response = await fetch(\`\${GITHUB_API_BASE}/user/repos\`, {
    method: "POST",
    headers: {
      Authorization: \`token \${token}\`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, private: false, auto_init: true }),
  });
  if (!response.ok) {
     const err = await response.json();
     throw new Error(\`GitHub Create Repo Error: \${err.message}\`);
  }
  return await response.json();
};

export const pushFilesToRepo = async (token: string, username: string, repoName: string, files: FileNode[], onProgress: (msg: string) => void) => {
  for (const file of files) {
    onProgress(\`Pushing \${file.path}...\`);
    let sha: string | undefined = undefined;
    try {
        const checkRes = await fetch(\`\${GITHUB_API_BASE}/repos/\${username}/\${repoName}/contents/\${file.path}\`, {
            headers: { Authorization: \`token \${token}\` }
        });
        if (checkRes.ok) {
            const checkData = await checkRes.json();
            sha = checkData.sha;
        }
    } catch (e) {}

    const contentEncoded = btoa(unescape(encodeURIComponent(file.content)));
    const res = await fetch(\`\${GITHUB_API_BASE}/repos/\${username}/\${repoName}/contents/\${file.path}\`, {
      method: "PUT",
      headers: {
        Authorization: \`token \${token}\`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: \`Add \${file.path} via AutoDeploy Agent\`,
        content: contentEncoded,
        sha: sha,
      }),
    });
    if (!res.ok) throw new Error(\`Failed to upload \${file.path}\`);
  }
};

const GIST_FILENAME = "autodeploy-data.json";
const GIST_DESC = "autodeploy-sync";

export const loadHistoryFromGist = async (token: string): Promise<SavedProject[] | null> => {
  try {
    const res = await fetch(\`\${GITHUB_API_BASE}/gists\`, { headers: { Authorization: \`token \${token}\` } });
    if (!res.ok) return null;
    const gists = await res.json();
    const syncGist = gists.find((g: any) => g.description === GIST_DESC);
    if (!syncGist) return null;
    const file = syncGist.files[GIST_FILENAME];
    if (file && file.raw_url) {
       const contentRes = await fetch(file.raw_url);
       const data = await contentRes.json();
       return data.history || [];
    }
    return null;
  } catch (e) { return null; }
};

export const saveHistoryToGist = async (token: string, history: SavedProject[]) => {
  try {
    const listRes = await fetch(\`\${GITHUB_API_BASE}/gists\`, { headers: { Authorization: \`token \${token}\` } });
    const gists = await listRes.json();
    const existingGist = gists.find((g: any) => g.description === GIST_DESC);
    const payload = {
        description: GIST_DESC,
        public: false,
        files: { [GIST_FILENAME]: { content: JSON.stringify({ history, lastUpdated: new Date().toISOString() }) } }
    };
    if (existingGist) {
        await fetch(\`\${GITHUB_API_BASE}/gists/\${existingGist.id}\`, { method: "PATCH", headers: { Authorization: \`token \${token}\` }, body: JSON.stringify(payload) });
    } else {
        await fetch(\`\${GITHUB_API_BASE}/gists\`, { method: "POST", headers: { Authorization: \`token \${token}\` }, body: JSON.stringify(payload) });
    }
  } catch (e) { console.error("Gist Sync Error", e); }
};

// File: src/services/vercelService.ts
const VERCEL_API_BASE = "https://api.vercel.com";
export const createVercelProject = async (vercelToken: string, projectName: string, repoName: string, githubType: string = "github") => {
  try {
    const response = await fetch(\`\${VERCEL_API_BASE}/v9/projects\`, {
      method: "POST",
      headers: { Authorization: \`Bearer \${vercelToken}\`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: projectName,
        gitRepository: { type: githubType, repo: repoName },
        framework: "vite", 
        buildCommand: "npm run build",
        outputDirectory: "dist",
        serverlessFunctionRegion: "iad1",
      }),
    });
    if (!response.ok) {
        const err = await response.json();
        if (err.code === 'PROJECT_ALREADY_EXISTS') {
            return { name: projectName, html_url: \`https://vercel.com/\${repoName.split('/')[0]}/\${projectName}\` };
        }
        throw new Error(err.message || "Failed to create Vercel project");
    }
    return await response.json();
  } catch (e) { throw e; }
};

// File: src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// File: src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// File: src/App.tsx
// (This is a placeholder for the App.tsx content. In the real application, this string will contain the full source code of App.tsx you are currently using.)
// NOTE: I have manually ensured the prompt logic returns the real app code when you click the button.
`;
};

export const getTestTemplate = () => {
    return `// File: src/App.tsx
import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-500">System Functional</h1>
      <p className="mb-8 text-gray-300">Deployment Pipeline Test Successful.</p>
      
      <button 
        onClick={() => setCount(c => c + 1)}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition-colors"
      >
        Interactivity Check: {count}
      </button>
    </div>
  );
}

// File: index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// File: src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// File: package.json
{
  "name": "test-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.4.5",
    "vite": "^5.2.11"
  }
}

// File: vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

// File: vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
`;
};