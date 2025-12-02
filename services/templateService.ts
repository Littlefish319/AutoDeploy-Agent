
// This service provides the source code of the application itself for self-replication.

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

export const getSelfSourceCode = () => {
  // We return a massive string containing all the files of THIS application.
  // This allows the user to "Clone" the agent.
  
  return `// File: package.json
{
  "name": "autodeploy-agent",
  "private": true,
  "version": "1.2.0",
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
    "noUnusedLocals": false,
    "noUnusedParameters": false,
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

// File: index.html
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

// File: src/services/templateService.ts
// This file is recursively included but we'll simplify it in the output to avoid infinite loops in the string representation.
export const getTestTemplate = () => { return \`// Test Template\`; }
export const getSelfSourceCode = () => { return \`// Recursive Self Replication Logic\`; }

// File: src/App.tsx
import React, { useState, useEffect } from 'react';
import { AppConfig, GeneratedProject, LogEntry, Step, DeploymentResult, SavedProject } from './types';
import { verifyGithubToken, createRepository, pushFilesToRepo, loadHistoryFromGist, saveHistoryToGist } from './services/githubService';
import { generateProjectCode } from './services/geminiService';
import { createVercelProject } from './services/vercelService';
import { getSelfSourceCode, getTestTemplate } from './services/templateService';
import { Terminal } from './components/Terminal';
import { Code, Github, CloudLightning, ArrowRight, Play, Loader2, CheckCircle, ExternalLink, Settings, LayoutTemplate, HelpCircle, FileJson, Copy, Terminal as TerminalIcon, Check, CircleDashed, User, History, Save, ChevronLeft, Trash2, RefreshCw, Cloud, Info, Zap, TestTube, LogIn, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.CONFIG);
  const [config, setConfig] = useState<AppConfig>({ githubToken: '', githubUsername: '', vercelToken: '', useBetaDeploy: false });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [prompt, setPrompt] = useState('');
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [mode, setMode] = useState<'generate' | 'paste'>('generate');
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('autodeploy_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({...prev, ...parsed}));
        if (parsed.githubToken) {
           verifyGithubToken(parsed.githubToken).then(u => {
               setConfig(prev => ({...prev, githubUsername: u}));
               setStep(Step.PROMPT);
               addLog(\`Welcome back, \${u}. Session restored.\`, 'success');
               syncHistory(parsed.githubToken, true);
           }).catch(() => {
               addLog("Saved token expired or invalid. Please login again.", 'warning');
               setStep(Step.CONFIG);
           });
        }
      } catch (e) { console.error("Config parse error", e); }
    }
    const savedHistory = localStorage.getItem('autodeploy_history');
    if (savedHistory) { try { setSavedProjects(JSON.parse(savedHistory)); } catch(e) {} }
  }, []);

  const syncHistory = async (token: string, silent = false) => {
      if (!token) return;
      if (!silent) setIsSyncing(true);
      try {
          if (!silent) addLog("Syncing projects with GitHub Cloud...", 'info');
          const cloudHistory = await loadHistoryFromGist(token);
          if (cloudHistory && Array.isArray(cloudHistory)) {
              setSavedProjects(prev => {
                  const combined = [...cloudHistory];
                  prev.forEach(p => { if (!combined.find(c => c.id === p.id)) combined.push(p); });
                  combined.sort((a, b) => b.timestamp - a.timestamp);
                  localStorage.setItem('autodeploy_history', JSON.stringify(combined));
                  return combined;
              });
              if (!silent) addLog("History synced successfully.", 'success');
          } else {
              if (!silent) addLog("No cloud history found. Creating new sync file...", 'info');
          }
      } catch (e) { if (!silent) addLog("Failed to sync history.", 'error'); } finally { if (!silent) setIsSyncing(false); }
  };

  const saveHistory = async (newHistory: SavedProject[]) => {
    setSavedProjects(newHistory);
    localStorage.setItem('autodeploy_history', JSON.stringify(newHistory));
    if (config.githubToken) { try { await saveHistoryToGist(config.githubToken, newHistory); } catch (e) {} }
  };

  const saveConfig = (newConfig: AppConfig) => { localStorage.setItem('autodeploy_config', JSON.stringify(newConfig)); };
  
  const saveCurrentProject = () => {
      if (!project) return;
      const newEntry: SavedProject = { id: Math.random().toString(36).substring(7), timestamp: Date.now(), prompt, project };
      const isDuplicate = savedProjects.some(p => p.project.name === project.name && p.prompt === prompt);
      if (!isDuplicate) {
        const updated = [newEntry, ...savedProjects];
        saveHistory(updated);
        addLog(\`Project "\${project.name}" saved to history.\`, 'success');
      } else { addLog(\`Project "\${project.name}" is already saved.\`, 'warning'); }
  };
  
  const loadProject = (entry: SavedProject) => {
      setPrompt(entry.prompt); setProject(entry.project); setStep(Step.REVIEW); setShowHistory(false);
      addLog(\`Loaded project "\${entry.project.name}" from history.\`, 'info');
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updated = savedProjects.filter(p => p.id !== id);
      saveHistory(updated);
  };

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { id: Math.random().toString(36), timestamp: new Date(), message, type }]);
  };

  const handleError = (error: any) => {
    console.error(error);
    addLog(error instanceof Error ? error.message : "An unexpected error occurred in my systems.", 'error');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.githubToken) return;
    addLog('Verifying GitHub credentials...');
    try {
      const username = await verifyGithubToken(config.githubToken);
      const newConfig = { ...config, githubUsername: username };
      setConfig(newConfig); saveConfig(newConfig);
      addLog(\`Hello, \${username}! Login successful.\`, 'success');
      setStep(Step.PROMPT); syncHistory(config.githubToken);
    } catch (err) { handleError(err); }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStep(Step.GENERATING);
    if (mode === 'generate') { addLog(\`I'm brainstorming code for: "\${prompt.slice(0, 30)}..."\`); } else { addLog('Analyzing code structure...'); }
    try {
      const generated = await generateProjectCode(prompt, mode);
      setProject(generated);
      addLog(\`Prepared "\${generated.name}" with \${generated.files.length} files.\`, 'success');
      setStep(Step.REVIEW);
      const newEntry: SavedProject = { id: Math.random().toString(36).substring(7), timestamp: Date.now(), prompt, project: generated };
      saveHistory([newEntry, ...savedProjects]);
    } catch (err) { handleError(err); setStep(Step.PROMPT); }
  };

  const handleLoadSelfSource = () => {
    let code = getSelfSourceCode();
    setPrompt(code);
    addLog("Loaded AutoDeploy Agent source code. Ready to replicate.", 'success');
  };

  const handleLoadTestTemplate = () => {
      const code = getTestTemplate();
      setPrompt(code);
      addLog("Loaded Test Template (Hello World).", 'success');
  };

  const handleDeploy = async () => {
    if (!project || !config.githubUsername) return;
    setStep(Step.DEPLOYING);
    addLog('Initiating deployment sequence...', 'warning');
    try {
      const repoName = \`\${project.name}-\${Math.floor(Math.random() * 1000)}\`;
      addLog(\`1. Creating repository '\${repoName}' on GitHub...\`);
      const repoData = await createRepository(config.githubToken, repoName, project.description);
      addLog(\`GitHub Repository created successfully.\`, 'success');
      addLog('2. Uploading source code...');
      await pushFilesToRepo(config.githubToken, config.githubUsername, repoName, project.files, (msg) => addLog(msg));
      addLog('Source code uploaded.', 'success');
      let vUrl = null; let isBetaSuccess = false;
      if (config.useBetaDeploy && config.vercelToken) {
          addLog('3. [Beta] Creating Vercel Project automatically...', 'info');
          try {
             const vProject = await createVercelProject(config.vercelToken, repoName, \`\${config.githubUsername}/\${repoName}\`);
             if (vProject) {
                 vUrl = \`https://vercel.com/\${config.githubUsername}/\${vProject.name}\`; 
                 addLog(\`[Beta] Project created! Build triggered on Vercel.\`, 'success');
                 isBetaSuccess = true;
             }
          } catch (e: any) { addLog(\`[Beta] Auto-deploy failed (\${e.message}). Falling back to manual mode.\`, 'warning'); }
      } else { addLog('3. Skipping auto-deploy (Beta disabled or no token).', 'info'); }
      setDeploymentResult({ repoUrl: repoData.html_url, deployUrl: vUrl ? vUrl : undefined, isBeta: isBetaSuccess });
      setStep(Step.SUCCESS);
    } catch (err) { handleError(err); setStep(Step.REVIEW); }
  };

  const ProgressStep = ({ s, label, current }: { s: Step, label: string, current: Step }) => {
    const order = [Step.CONFIG, Step.PROMPT, Step.GENERATING, Step.REVIEW, Step.DEPLOYING, Step.SUCCESS];
    const idx = order.indexOf(s);
    const currentIdx = order.indexOf(current);
    let state: 'pending' | 'active' | 'completed' = 'pending';
    if (current === s) state = 'active';
    if (currentIdx > idx) state = 'completed';
    if (s === Step.GENERATING && current === Step.PROMPT) state = 'pending';
    return (
      <div className={\`flex items-center gap-3 p-3 rounded-lg transition-colors \${state === 'active' ? 'bg-white/10 border border-white/20' : 'opacity-50'}\`}>
        <div className={\`w-8 h-8 rounded-full flex items-center justify-center border \${
          state === 'completed' ? 'bg-green-500 border-green-500 text-black' :
          state === 'active' ? 'bg-blue-600 border-blue-500 text-white animate-pulse' :
          'bg-black border-gray-700 text-gray-500'
        }\`}>
          {state === 'completed' ? <Check size={16} strokeWidth={3} /> : state === 'active' ? <Loader2 size={16} className="animate-spin" /> : <CircleDashed size={16} />}
        </div>
        <div className="flex-1">
          <p className={\`text-sm font-medium \${state === 'active' ? 'text-white' : 'text-gray-400'}\`}>{label}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-black text-white font-sans flex flex-col md:flex-row overflow-hidden relative">
      {showHistory && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start">
             <div className="w-80 h-full bg-[#111] border-r border-deploy-border shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                <div className="p-4 border-b border-deploy-border flex justify-between items-center bg-[#1a1a1a]">
                    <h2 className="font-bold flex items-center gap-2"><History size={18}/> Project History</h2>
                    <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                {config.githubToken && (
                    <div className="p-3 border-b border-deploy-border bg-[#0a0a0a]">
                        <button onClick={() => syncHistory(config.githubToken)} disabled={isSyncing} className="w-full text-xs flex items-center justify-center gap-2 bg-[#222] hover:bg-[#333] py-2 rounded text-blue-400 border border-blue-900/30 transition-all">
                            {isSyncing ? <Loader2 size={12} className="animate-spin"/> : <Cloud size={12}/>} {isSyncing ? "Syncing..." : "Sync Cloud History"}
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {savedProjects.length === 0 ? ( <p className="text-gray-500 text-sm text-center italic mt-10">No saved projects yet.</p> ) : (
                        savedProjects.map(p => (
                            <div key={p.id} onClick={() => loadProject(p)} className="bg-black/50 border border-deploy-border p-3 rounded-lg hover:border-blue-500 cursor-pointer group transition-all">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-medium text-sm text-blue-300 truncate w-3/4">{p.project.name}</h3>
                                    <button onClick={(e) => deleteProject(p.id, e)} className="text-gray-600 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                </div>
                                <p className="text-xs text-gray-500 mb-2 truncate">{p.project.description}</p>
                                <p className="text-[10px] text-gray-600 flex items-center justify-between">{new Date(p.timestamp).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
             </div>
             <div className="flex-1" onClick={() => setShowHistory(false)}></div>
          </div>
      )}
      <div className="w-full md:w-1/2 flex flex-col border-r border-deploy-border bg-[#050505] relative z-10 h-full">
        <div className="p-6 md:p-10 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-8">
            <header className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                <CloudLightning size={24} className="text-white" />
                </div>
                <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">AutoDeploy Agent</h1>
                <p className="text-gray-400 text-xs">Deployment & Automation</p>
                </div>
            </div>
            {step !== Step.CONFIG && (
                <button onClick={() => setShowHistory(true)} className="text-xs bg-[#111] hover:bg-[#222] border border-deploy-border px-3 py-2 rounded-md flex items-center gap-2 transition-colors">
                    <History size={14}/> History
                </button>
            )}
            </header>
            {step === Step.CONFIG && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col justify-center min-h-[50vh]">
                <div className="bg-deploy-card p-8 rounded-xl border border-deploy-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white"><LogIn size={20} /> Login to AutoDeploy</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Personal Access Token</label>
                            <div className="relative">
                                <input type="password" required placeholder="ghp_xxxxxxxxxxxx" className="w-full bg-black border border-deploy-border rounded-lg p-3 pl-10 text-sm focus:border-blue-500 focus:outline-none transition-colors" value={config.githubToken} onChange={(e) => setConfig({ ...config, githubToken: e.target.value })} />
                                <Lock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                            </div>
                            <div className="mt-2 flex justify-between text-xs">
                                <span className="text-gray-500">Required for creating repositories.</span>
                                <a href="https://github.com/settings/tokens/new?scopes=repo,gist" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">Get Token <ExternalLink size={10}/></a>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Vercel Token (Optional)</label>
                            <input type="password" placeholder="AbCdEfGxxxxxxxx" className="w-full bg-black border border-deploy-border rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none transition-colors" value={config.vercelToken} onChange={(e) => setConfig({ ...config, vercelToken: e.target.value })} />
                            <a href="https://vercel.com/account/tokens" target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-1 inline-block">Get Vercel Token</a>
                        </div>
                        <div className={\`mt-2 flex items-center gap-3 p-3 rounded-lg border transition-colors \${config.vercelToken ? 'bg-blue-900/10 border-blue-900/30' : 'bg-gray-900/30 border-gray-800 opacity-50'}\`}>
                            <input type="checkbox" id="betaDeploy" disabled={!config.vercelToken} checked={config.useBetaDeploy || false} onChange={(e) => setConfig({...config, useBetaDeploy: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                            <label htmlFor="betaDeploy" className={\`text-xs flex-1 \${config.vercelToken ? 'cursor-pointer' : 'cursor-not-allowed'}\`}>
                                <span className={\`font-bold flex items-center gap-1 \${config.vercelToken ? 'text-blue-400' : 'text-gray-500'}\`}>
                                    <Zap size={12} className={config.vercelToken ? "fill-blue-500 text-blue-500" : "text-gray-500"}/> Enable Beta Auto-Deploy
                                </span>
                                <span className="block text-gray-500">I will create the Vercel project for you. (Requires Vercel Token)</span>
                            </label>
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-200 mt-4">Connect & Login <ArrowRight size={16} /></button>
                    </div>
                </div>
            </form>
            )}
            {(step === Step.PROMPT || step === Step.GENERATING) && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="bg-deploy-card p-1 rounded-lg border border-deploy-border inline-flex w-full">
                    <button onClick={() => setMode('generate')} disabled={step === Step.GENERATING} className={\`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 \${mode === 'generate' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}\`}><CloudLightning size={14} /> AI Generator</button>
                    <button onClick={() => setMode('paste')} disabled={step === Step.GENERATING} className={\`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 \${mode === 'paste' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}\`}><Copy size={14} /> Paste Code</button>
                </div>
                <div className="bg-deploy-card p-6 rounded-xl border border-deploy-border shadow-2xl relative">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <h2 className="text-lg font-semibold flex items-center gap-2"><LayoutTemplate size={18} /> {mode === 'generate' ? 'What should I build?' : 'Paste Source Code'}</h2>
                        {mode === 'paste' && (
                            <div className="flex gap-2">
                                <button onClick={handleLoadTestTemplate} className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-2 py-1 rounded flex items-center gap-1 transition-colors"><TestTube size={10} /> Load Test Code</button>
                                {config.githubUsername === 'Littlefish319' && (
                                    <button onClick={handleLoadSelfSource} className="text-[10px] bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-800 px-2 py-1 rounded flex items-center gap-1 transition-colors" title="Load the code of this AutoDeploy agent"><CloudLightning size={10} /> Load AutoDeploy Source</button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <textarea className="w-full bg-black border border-deploy-border rounded-md p-4 text-sm focus:border-blue-500 focus:outline-none min-h-[300px] resize-none font-mono leading-relaxed" placeholder={mode === 'generate' ? "Example: I want a portfolio website..." : "// Paste your file contents here..."} value={prompt} disabled={step === Step.GENERATING} onChange={(e) => setPrompt(e.target.value)} />
                    </div>
                    <button onClick={handleGenerate} disabled={step === Step.GENERATING || !prompt.trim()} className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {step === Step.GENERATING ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : <><Code size={18} /> {mode === 'generate' ? 'Generate App' : 'Process & Prepare Code'}</>}
                    </button>
                </div>
            </div>
            )}
            {(step === Step.REVIEW || step === Step.DEPLOYING) && project && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                {step === Step.REVIEW && (
                    <button onClick={() => setStep(Step.PROMPT)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2 group"><ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Editor</button>
                )}
                <div className="bg-deploy-card p-6 rounded-xl border border-deploy-border shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">{project.name}</h2>
                        <div className="flex gap-2">
                            <button onClick={saveCurrentProject} title="Save to History" className="text-gray-400 hover:text-blue-400 transition-colors"><Save size={18} /></button>
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-900/50">Ready</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 bg-black/30 p-3 rounded border border-white/5">{project.description}</p>
                    <div className="mb-6">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 flex items-center gap-2"><FileJson size={14} /> Project Structure</h3>
                        <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {project.files.map(f => (
                            <div key={f.path} className="text-xs bg-black/50 border border-deploy-border p-2 rounded flex items-center justify-between text-gray-300 group hover:border-blue-500/50 transition-colors">
                                <span className="flex items-center gap-2"><Code size={12} className="text-blue-500"/> {f.path}</span>
                                <span className="text-[10px] text-gray-600 group-hover:text-gray-400">{(f.content.length / 1024).toFixed(1)} KB</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    <button onClick={handleDeploy} disabled={step === Step.DEPLOYING} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                        {step === Step.DEPLOYING ? <><Loader2 className="animate-spin" size={18} /> Deploying...</> : <><Play size={18} /> {config.useBetaDeploy ? 'Auto Launch (Beta)' : 'Upload & Launch'}</>}
                    </button>
                </div>
            </div>
            )}
            {step === Step.SUCCESS && deploymentResult && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-end">
                    <button onClick={() => setStep(Step.PROMPT)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2 group"><ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Editor</button>
                </div>
                <div className="bg-green-950/30 border border-green-800 p-8 rounded-xl text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Code Uploaded to GitHub</h2>
                    <p className="text-gray-300 mb-6 text-sm">{deploymentResult.isBeta ? "Build triggered on Vercel." : "The hard work is done! Import to Vercel now."}</p>
                    {!deploymentResult.isBeta && (
                        <div className="bg-black/40 border border-white/10 rounded-lg p-4 text-left mb-6 font-mono text-xs text-gray-300 space-y-2">
                            <div className="flex justify-between border-b border-white/10 pb-1 mb-2"><span className="font-bold text-blue-400">DEPLOYMENT SETTINGS</span></div>
                            <div className="flex justify-between"><span>Framework Preset:</span><span className="text-white font-bold">Vite</span></div>
                            <div className="flex justify-between"><span>Output Directory:</span><span className="text-white font-bold">dist</span></div>
                            <div className="flex justify-between"><span>Build Command:</span><span className="text-white font-bold">npm run build</span></div>
                        </div>
                    )}
                    <div className="grid gap-3">
                        <a href={deploymentResult.deployUrl || \`https://vercel.com/new/import?s=\${deploymentResult.repoUrl}\`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-100 text-black py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-white/10 animate-pulse">
                        {deploymentResult.isBeta ? <><Zap size={18} className="fill-black"/> View Vercel Dashboard</> : <><div className="w-5 h-5 bg-black clip-path-triangle mr-1" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div> Click Here to Deploy on Vercel</>}
                        </a>
                        <a href={deploymentResult.repoUrl} target="_blank" rel="noopener noreferrer" className="bg-[#24292e] hover:bg-[#2f363d] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium border border-gray-700"><Github size={18} /> View GitHub Repo</a>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setStep(Step.PROMPT); setProject(null); setLogs([]); setPrompt(''); }} className="flex-1 text-sm bg-[#111] hover:bg-[#222] border border-deploy-border text-white py-3 rounded-lg transition-colors">Create New App</button>
                </div>
            </div>
            )}
            <div className="mt-auto pt-6 pb-2 text-center border-t border-white/5">
                <p className="text-xs text-gray-500 font-mono flex items-center justify-center gap-2">Copyright © Xiaoyu Tang <a href="https://github.com/Littlefish319" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400">@YuNova</a></p>
            </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-[#050505] p-6 md:p-10 border-t md:border-t-0 md:border-l border-deploy-border flex flex-col gap-6 h-[500px] md:h-full overflow-hidden">
         <div className="bg-deploy-card border border-deploy-border rounded-xl p-6 shadow-xl shrink-0">
             <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-4 flex items-center gap-2"><CloudLightning size={14} /> Deployment Status</h3>
             <div className="space-y-2">
                <ProgressStep s={Step.CONFIG} label="Authorization" current={step} />
                <ProgressStep s={Step.PROMPT} label="Project Definition" current={step} />
                <ProgressStep s={Step.GENERATING} label="Code Generation" current={step} />
                <ProgressStep s={Step.DEPLOYING} label="GitHub Sync" current={step} />
                <ProgressStep s={Step.SUCCESS} label="Ready to Launch" current={step} />
             </div>
         </div>
         <div className="flex-1 flex flex-col min-h-0">
             <div className="flex items-center justify-between mb-2 shrink-0">
                <h2 className="text-gray-400 font-mono text-sm uppercase tracking-widest flex items-center gap-2"><TerminalIcon size={16} /> Console Output</h2>
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
             </div>
             <div className="flex-1 overflow-hidden relative"><Terminal logs={logs} /></div>
             <div className="mt-2 text-[10px] text-gray-700 font-mono text-center flex justify-between px-2 shrink-0"><span>Model: Gemini 3 Pro</span><span>Latency: 24ms</span></div>
         </div>
      </div>
    </div>
  );
};

export default App;
`;
}
