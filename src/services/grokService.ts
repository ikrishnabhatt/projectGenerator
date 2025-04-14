const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateWithGroq = async (prompt: string): Promise<{
  html?: string;
  css?: string;
  js?: string;
  react?: string;
  backend?: string;
}> => {
  if (!GROQ_API_KEY) throw new Error("GROQ API Key not found");

  const enhancedPrompt = `${prompt}
  
Important: Format your response with clear code separation using markdown code blocks:
\`\`\`html
// HTML code here
\`\`\`

\`\`\`css
// CSS code here with proper styling for a professional look
\`\`\`

\`\`\`javascript
// JavaScript code here with proper functionality
\`\`\`

If React components are needed:
\`\`\`jsx
// React code here
\`\`\`

For backend code:
\`\`\`javascript
// Backend code here
\`\`\`
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192", // or llama3-8b-8192
      messages: [
        {
          role: "system",
          content: `You are an expert full-stack developer who creates complete, well-designed web applications. 
          
Create projects with:
- Responsive, attractive UI with modern CSS
- Clean HTML structure
- Functional JavaScript with proper interaction
- Well-structured code that follows best practices
- Proper comments throughout the code
- Clear separation between HTML, CSS, and JavaScript components`,
        },
        {
          role: "user",
          content: enhancedPrompt,
        },
      ],
      max_tokens: 8000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Groq API request failed");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse markdown code blocks
  const htmlMatch = content.match(/```html\s*([\s\S]*?)```/);
  const cssMatch = content.match(/```css\s*([\s\S]*?)```/);
  const jsMatch = content.match(/```javascript\s*([\s\S]*?)```/);
  const reactMatch = content.match(/```jsx\s*([\s\S]*?)```/) || content.match(/```react\s*([\s\S]*?)```/);
  const backendMatch = content.match(/```(node|backend|express|server)\s*([\s\S]*?)```/);

  return {
    html: htmlMatch ? htmlMatch[1].trim() : undefined,
    css: cssMatch ? cssMatch[1].trim() : undefined,
    js: jsMatch ? jsMatch[1].trim() : undefined,
    react: reactMatch ? reactMatch[1].trim() : undefined,
    backend: backendMatch ? backendMatch[2].trim() : undefined,
  };
};