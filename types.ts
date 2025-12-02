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
  vercelToken?: string; // Optional, can use manual link
  githubUsername: string;
  useBetaDeploy?: boolean; // New toggle for Beta Auto-Deploy
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
  deployUrl?: string; // The "Live" or "Manage" link
  vercelInspectUrl?: string;
  isBeta?: boolean;
}