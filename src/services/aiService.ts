
import { toast } from "sonner";

export type ProjectRequirement = {
  projectType: string;
  description: string;
  features: string[];
  techStack: string[];
};

export type GeneratedProject = {
  id: string;
  name: string;
  description: string;
  codeSnippets: {
    frontend: string;
    backend: string;
  };
  techStack: string[];
  structure: {
    frontend: string[];
    backend: string[];
  };
  downloadUrl?: string;
};

const DEEPSEEK_API_KEY = "sk-d112f3873fb54cfe86f3d53bc6fd677e";
const DEEPSEEK_API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

const createProjectZip = async (project: GeneratedProject): Promise<string> => {
  try {
    // In a real implementation, this would create a ZIP file with the project structure
    // For now, we're creating a Blob with the project data
    const projectData = JSON.stringify({
      name: project.name,
      description: project.description,
      frontend: project.codeSnippets.frontend,
      backend: project.codeSnippets.backend,
      structure: project.structure
    }, null, 2);

    return URL.createObjectURL(new Blob(
      [projectData], 
      { type: 'application/json' }
    ));
  } catch (error) {
    console.error("Error creating project ZIP:", error);
    throw new Error("Failed to create downloadable project file");
  }
};

export const generateProject = async (requirements: ProjectRequirement): Promise<GeneratedProject> => {
  try {
    toast.info("Starting project generation with DeepSeek AI...");
    
    // Create a detailed and specific prompt for the AI
    const prompt = `
    You are a professional web developer tasked with creating a complete ${requirements.projectType} application. Your task is to generate real, production-ready code based on the following requirements.

    Project Description: ${requirements.description}
    
    Required Features:
    ${requirements.features.map(feature => `- ${feature}`).join('\n')}
    
    Technology Stack:
    ${requirements.techStack.map(tech => `- ${tech}`).join('\n')}
    
    I need you to generate:
    1. ACTUAL FUNCTIONAL FRONTEND CODE (not pseudocode) implementing the main user interface of this application. 
       This code should use ${requirements.techStack.filter(t => t.includes('React') || t.includes('Vue') || t.includes('Angular') || t.includes('HTML') || t.includes('CSS')).join(', ')}.
    
    2. ACTUAL FUNCTIONAL BACKEND CODE (not pseudocode) implementing the server, API endpoints, and database interactions.
       This code should use ${requirements.techStack.filter(t => t.includes('Node') || t.includes('Express') || t.includes('MongoDB') || t.includes('SQL') || t.includes('Python') || t.includes('Django') || t.includes('Flask')).join(', ')}.
    
    3. A file structure showing the organization of both frontend and backend components.
    
    IMPORTANT GUIDELINES:
    - Do NOT generate pseudocode or placeholder code. Create COMPLETE, WORKING code snippets.
    - Include proper imports, error handling, and comments.
    - For frontend: Include styling, state management, and component structure.
    - For backend: Include routes, controllers, database models, and connection setup.
    - Limit your code to the most important files that demonstrate the core functionality.
    - For each code section, specify the file path where it should be placed.
    
    Format your response as follows:
    
    ## Project Overview
    [Brief description of the generated project]
    
    ## Frontend Code
    \`\`\`jsx
    // src/components/MainComponent.jsx
    [Your actual frontend code here]
    \`\`\`
    
    ## Backend Code
    \`\`\`js
    // server/index.js
    [Your actual backend code here]
    \`\`\`
    
    ## Project Structure
    \`\`\`
    frontend/
      ├── src/
      │   ├── components/
      │   ├── pages/
      │   ├── ...
    backend/
      ├── controllers/
      ├── models/
      ├── ...
    \`\`\`
    `;

    // Call DeepSeek API
    const response = await fetch(DEEPSEEK_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-coder",
        messages: [
          {
            role: "system",
            content: "You are an expert full-stack developer who specializes in creating comprehensive web applications. You generate complete, working code (not examples or placeholders) for both frontend and backend."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate project with AI");
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "";

    // Extract code snippets from the AI response with improved parsing
    let frontendCode = "// Generated Frontend Code\n";
    let backendCode = "// Generated Backend Code\n";
    let projectName = requirements.projectType + " Application";
    let projectDescription = requirements.description;
    
    try {
      // Try to extract overview
      const overviewMatch = aiResponse.match(/## Project Overview\s*([^#]+)/);
      if (overviewMatch && overviewMatch[1]) {
        projectDescription = overviewMatch[1].trim();
      }
      
      // Try to extract frontend code
      const frontendMatch = aiResponse.match(/## Frontend Code\s*```(?:jsx?|tsx?|react|html)([\s\S]*?)```/);
      if (frontendMatch && frontendMatch[1]) {
        frontendCode = frontendMatch[1].trim();
      } else {
        // Alternative pattern
        const altFrontendMatch = aiResponse.match(/```(?:jsx?|tsx?|react|html)([\s\S]*?)```/);
        if (altFrontendMatch && altFrontendMatch[1]) {
          frontendCode = altFrontendMatch[1].trim();
        }
      }
      
      // Try to extract backend code
      const backendMatch = aiResponse.match(/## Backend Code\s*```(?:js|ts|node|express|backend)([\s\S]*?)```/);
      if (backendMatch && backendMatch[1]) {
        backendCode = backendMatch[1].trim();
      } else {
        // Look for second code block if specific tagging failed
        const codeBlocks = aiResponse.match(/```[\s\S]*?```/g);
        if (codeBlocks && codeBlocks.length >= 2) {
          const secondBlock = codeBlocks[1].replace(/```[\s\S]*?/, '').replace(/```/, '').trim();
          if (!frontendCode.includes(secondBlock)) {
            backendCode = secondBlock;
          }
        }
      }
      
      // Extract project structure
      const structureMatch = aiResponse.match(/## Project Structure\s*```([\s\S]*?)```/);
      let frontendStructure: string[] = [];
      let backendStructure: string[] = [];
      
      if (structureMatch && structureMatch[1]) {
        const structureText = structureMatch[1].trim();
        const frontendPart = structureText.match(/frontend\/[\s\S]*?(?=backend\/|$)/);
        const backendPart = structureText.match(/backend\/[\s\S]*/);
        
        if (frontendPart) {
          frontendStructure = frontendPart[0]
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        }
        
        if (backendPart) {
          backendStructure = backendPart[0]
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        }
      }
      
      // If structure extraction failed, generate based on tech stack
      if (frontendStructure.length === 0) {
        frontendStructure = generateFrontendStructure(requirements.techStack);
      }
      
      if (backendStructure.length === 0) {
        backendStructure = generateBackendStructure(requirements.techStack);
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // Fallback to basic structure
      frontendCode = aiResponse;
      backendCode = "// Backend code generation failed, please try again";
    }

    const generatedProject: GeneratedProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      description: projectDescription,
      codeSnippets: {
        frontend: frontendCode,
        backend: backendCode
      },
      techStack: [...requirements.techStack],
      structure: {
        frontend: generateFrontendStructure(requirements.techStack),
        backend: generateBackendStructure(requirements.techStack)
      }
    };
    
    const downloadUrl = await createProjectZip(generatedProject);
    toast.success("Project generated successfully!");
    return { ...generatedProject, downloadUrl };
    
  } catch (error) {
    console.error("Error generating project:", error);
    toast.error("Failed to generate project. Please try again later.");
    throw error;
  }
};

const generateFrontendStructure = (techStack: string[]): string[] => {
  const structure = [
    "src/",
    "src/components/",
    "src/pages/",
    "src/hooks/",
    "src/utils/",
    "public/",
    "package.json"
  ];

  if (techStack.includes("React")) {
    structure.push("src/App.jsx", "src/index.jsx");
  }

  if (techStack.includes("TypeScript")) {
    structure.push("tsconfig.json");
    // Convert any .jsx to .tsx
    const tsxStructure = structure.map(path => 
      path.endsWith(".jsx") ? path.replace(".jsx", ".tsx") : path
    );
    return tsxStructure;
  }

  if (techStack.includes("Next.js")) {
    structure.push(
      "pages/",
      "pages/api/",
      "pages/_app.jsx",
      "pages/index.jsx",
      "next.config.js"
    );
  }

  if (techStack.includes("Tailwind CSS")) {
    structure.push("tailwind.config.js", "postcss.config.js");
  }

  return structure;
};

const generateBackendStructure = (techStack: string[]): string[] => {
  const structure = [
    "server.js",
    "routes/",
    "controllers/",
    "models/",
    "middleware/",
    "package.json"
  ];

  if (techStack.includes("Express")) {
    structure.push("routes/api.js");
  }

  if (techStack.includes("MongoDB")) {
    structure.push("models/db.js");
  }

  if (techStack.includes("PostgreSQL")) {
    structure.push("models/db.js", "migrations/");
  }

  if (techStack.includes("GraphQL")) {
    structure.push("schema/", "resolvers/");
  }

  return structure;
};

export const saveProject = async (project: GeneratedProject): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  toast.success("Project saved successfully!");
  
  console.log("Project saved:", project);
};

export const getRecommendedFeatures = async (projectType: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (projectType.toLowerCase()) {
    case 'e-commerce':
      return ['Product catalog', 'Shopping cart', 'Checkout', 'User accounts', 'Payment processing'];
    case 'blog':
      return ['Article management', 'Comments', 'Categories', 'Tags', 'Search'];
    case 'dashboard':
      return ['Analytics charts', 'Data tables', 'Filtering', 'User management', 'Notifications'];
    case 'social media':
      return ['User profiles', 'Posts/Timeline', 'Messaging', 'Notifications', 'Friend connections'];
    default:
      return ['Authentication', 'User profiles', 'Data storage', 'API integration', 'Responsive design'];
  }
};

export const downloadProject = async (project: GeneratedProject): Promise<string> => {
  if (project.downloadUrl) {
    return project.downloadUrl;
  }
  
  return await createProjectZip(project);
};

