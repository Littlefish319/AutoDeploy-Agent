import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedProject } from "../types";

// Helper to ensure we have the key
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const projectSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "A URL-friendly kebab-case name for the project (e.g., my-todo-app).",
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
            description: "The file path (e.g., 'src/App.tsx', 'index.html', 'package.json').",
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

  const commonRules = `
    CRITICAL VERCEL DEPLOYMENT RULES:
    1.  **vercel.json REQUIRED:** You MUST include a 'vercel.json' file in the root with EXACTLY this content to prevent 404 errors:
        { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    2.  **Vite Config:** Ensure 'vite.config.ts' is standard and builds to the 'dist' folder.
    3.  **Entry Point:** 'index.html' must be in the ROOT directory and script src must point to "/src/main.tsx".
    4.  **Package.json:** Ensure 'scripts' has "build": "vite build".
  `;

  if (mode === 'generate') {
    systemInstruction = `
      You are an intelligent Full-Stack AI Developer (Gemini 3 Pro).
      
      YOUR GOAL:
      Generate a complete, production-ready React + Vite application based on the user's request.
      
      TECHNICAL STACK RULES:
      1.  **Framework:** Use Vite + React + TypeScript.
      2.  **Styling:** Use Tailwind CSS (include 'postcss.config.js', 'tailwind.config.js', and 'src/index.css' with @tailwind directives).
      3.  **Icons:** Use 'lucide-react'.
      4.  **Dependencies:** Ensure 'package.json' includes: 'react', 'react-dom', 'lucide-react', 'clsx', 'tailwind-merge'. Dev dependencies: 'vite', 'typescript', 'tailwindcss', 'postcss', 'autoprefixer'.
      5.  **Configuration:** Create a valid 'vite.config.ts' and 'tsconfig.json'.
      
      ${commonRules}
      
      BEHAVIOR:
      - Be creative with the UI. Use dark mode by default if not specified.
      - Ensure the app is self-contained.
      - Return ONLY the JSON structure matching the schema.
    `;
  } else {
    systemInstruction = `
      You are an expert Code Architect AI (Gemini 3 Pro). The user is pasting a blob of code (potentially multiple files mixed together).
      
      YOUR GOAL:
      Parse the text, identify distinct files, and structure them into a deployable project.
      
      RULES:
      1.  **File Separation:** Look for comments like "// File: App.tsx" or standard React patterns to separate files.
      2.  **Missing Files:** If the user only pastes 'App.tsx', YOU MUST GENERATE the surrounding infrastructure ('index.html', 'package.json', 'vite.config.ts', 'src/main.tsx', 'src/index.css', 'vercel.json') so it actually runs on Vercel.
      3.  **Dependencies:** Analyze imports in the pasted code (e.g., 'framer-motion', 'lodash') and add them to 'package.json'.
      4.  **Refactoring:** If the code is messy, clean it up.
      
      ${commonRules}
      
      Output: Return ONLY the JSON structure matching the schema.
    `;
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
    if (!text) throw new Error("I couldn't generate a response. Please try again.");

    return JSON.parse(text) as GeneratedProject;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("I failed to process the code. Please try again.");
  }
};