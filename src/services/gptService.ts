
/**
 * GPT Service - Handles interactions with OpenAI's API for code generation
 * Falls back gracefully if API key is not available or request fails
 */

// A simplified version of what GPT would return
export interface GPTResponse {
  html?: string;
  css?: string;
  js?: string;
  react?: string;
  backend?: string;
}

/**
 * Generate code using GPT models based on the user prompt
 * @param prompt User's description of what to create
 * @returns Generated code structure
 */
export const generateCodeWithGPT = async (prompt: string): Promise<GPTResponse> => {
  console.log("Starting GPT code generation for prompt:", prompt);
  
  // For a production app, we would use environment variables for the API key
  // const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // For demo purposes, we'll check if API key exists in localStorage
  const apiKey = localStorage.getItem("openai_api_key");
  
  // If no API key is available, throw an error to fall back to the local model
  if (!apiKey) {
    console.log("No OpenAI API key found, falling back to local model");
    throw new Error("No OpenAI API key available");
  }

  try {
    // Detect what kind of project the user wants to build from the prompt
    const technologyStack = detectTechnologyStack(prompt);
    const isReactProject = technologyStack.includes("react");
    const needsBackend = technologyStack.includes("backend") || 
                         prompt.toLowerCase().includes("database") || 
                         prompt.toLowerCase().includes("api") ||
                         prompt.toLowerCase().includes("server");
    
    // Create system prompt based on detected technology
    const systemPrompt = createSystemPrompt(technologyStack);
    
    // Make the API call to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using the smaller, cheaper model
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Generate code for the following project: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 1
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // Process the response to extract code sections
    return processGPTResponse(generatedContent, isReactProject, needsBackend);
    
  } catch (error) {
    console.error("Error in GPT code generation:", error);
    throw error;
  }
};

/**
 * Detect which technology stack to use based on prompt
 */
function detectTechnologyStack(prompt: string): string[] {
  const stack: string[] = [];
  const promptLower = prompt.toLowerCase();
  
  // Check for explicit technology mentions
  if (promptLower.includes("react")) stack.push("react");
  if (promptLower.includes("vue")) stack.push("vue");
  if (promptLower.includes("angular")) stack.push("angular");
  if (promptLower.includes("node")) stack.push("node");
  if (promptLower.includes("express")) stack.push("express");
  if (promptLower.includes("django")) stack.push("django");
  if (promptLower.includes("flask")) stack.push("flask");
  if (promptLower.includes("python")) stack.push("python");
  if (promptLower.includes("java")) stack.push("java");
  if (promptLower.includes("spring")) stack.push("spring");
  
  // Check for generic backend needs
  if (
    promptLower.includes("backend") || 
    promptLower.includes("server") || 
    promptLower.includes("api") || 
    promptLower.includes("database")
  ) {
    stack.push("backend");
  }
  
  // Default to HTML/CSS/JS if nothing specific is mentioned
  if (stack.length === 0) {
    return ["html", "css", "js"];
  }
  
  // Always include the basics
  if (!stack.includes("react") && !stack.includes("vue") && !stack.includes("angular")) {
    stack.push("html", "css", "js");
  }
  
  return stack;
}

/**
 * Create appropriate system prompt based on detected technology
 */
function createSystemPrompt(stack: string[]): string {
  let systemPrompt = "You are an expert programmer that writes clean, efficient code. ";
  
  if (stack.includes("react")) {
    systemPrompt += "Generate a React application with component structure, styling, and functionality. ";
    systemPrompt += "Separate your code into HTML (React JSX), CSS, and JavaScript sections. ";
  } else {
    systemPrompt += "Generate a web application with HTML, CSS, and JavaScript. ";
    systemPrompt += "Separate your code into distinct HTML, CSS, and JavaScript sections. ";
  }
  
  if (stack.includes("backend")) {
    if (stack.includes("node")) {
      systemPrompt += "Include a Node.js/Express backend with API endpoints. ";
    } else if (stack.includes("python")) {
      systemPrompt += "Include a Python backend (Flask or Django) with API endpoints. ";
    } else if (stack.includes("java")) {
      systemPrompt += "Include a Java backend with API endpoints. ";
    } else {
      systemPrompt += "Include a simple backend with API endpoints. ";
    }
  }
  
  systemPrompt += "Format your response with markdown code blocks for each file type. ";
  systemPrompt += "For example: ```html\n<html>...</html>\n``` for HTML, ```css\n.class {...}\n``` for CSS, etc.";
  
  return systemPrompt;
}

/**
 * Process the GPT response and extract code sections
 */
function processGPTResponse(
  response: string, 
  isReactProject: boolean, 
  needsBackend: boolean
): GPTResponse {
  const result: GPTResponse = {};
  
  // Extract HTML (or React JSX)
  const htmlMatch = response.match(/```(?:html|jsx)([\s\S]*?)```/);
  if (htmlMatch && htmlMatch[1]) {
    if (isReactProject) {
      result.react = htmlMatch[1].trim();
    } else {
      result.html = htmlMatch[1].trim();
    }
  }
  
  // Extract CSS
  const cssMatch = response.match(/```css([\s\S]*?)```/);
  if (cssMatch && cssMatch[1]) {
    result.css = cssMatch[1].trim();
  }
  
  // Extract JavaScript
  const jsMatch = response.match(/```(?:javascript|js)([\s\S]*?)```/);
  if (jsMatch && jsMatch[1]) {
    result.js = jsMatch[1].trim();
  }
  
  // Extract backend code if needed
  if (needsBackend) {
    const backendMatches = [
      response.match(/```(?:python|py)([\s\S]*?)```/),
      response.match(/```(?:nodejs|node)([\s\S]*?)```/),
      response.match(/```(?:java)([\s\S]*?)```/),
      response.match(/```(?:php)([\s\S]*?)```/),
      response.match(/```(?:ruby|rb)([\s\S]*?)```/),
      response.match(/```(?:go)([\s\S]*?)```/)
    ].filter(match => match !== null);
    
    if (backendMatches.length > 0) {
      // Use the first matched backend code
      const backendMatch = backendMatches[0];
      if (backendMatch && backendMatch[1]) {
        result.backend = backendMatch[1].trim();
      }
    }
  }
  
  // If we couldn't extract distinct sections, use the whole response
  if (!result.html && !result.react && !result.css && !result.js && !result.backend) {
    if (isReactProject) {
      result.react = response;
    } else {
      result.html = response;
    }
  }
  
  return result;
}

export default {
  generateCodeWithGPT
};
