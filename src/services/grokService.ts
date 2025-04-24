import { GROQ_API_KEY } from "@/config";
import JSZip from "jszip";

export interface PageDescription {
  name: string;
  path: string;
  description: string;
}

export const TECH_STACK_OPTIONS = [
  { value: "react-tailwind-node-mongo", label: "React + Tailwind + Node.js/Express + MongoDB" },
  { value: "html-css-js-flask-sqlite", label: "HTML/CSS/JS + Flask + SQLite" },
  { value: "vue-django-postgres", label: "Vue.js + Django + PostgreSQL" },
  { value: "react-firebase", label: "React + Firebase (Serverless)" }
] as const;

export type TechStack = typeof TECH_STACK_OPTIONS[number]["value"];

// Enhanced project structure templates
const projectStructures = {
  "react-tailwind-node-mongo": `
Project Structure:
/frontend
  /src
    /components      # Reusable React components
    /layouts         # Layout components
    /pages          # Page components
    /hooks          # Custom React hooks
    /services       # API services
    /utils          # Utility functions
    /contexts       # React contexts
    /types          # TypeScript types/interfaces
    /styles         # Global styles
    /assets         # Images, fonts, etc.
  
/backend
  /src
    /controllers    # Route controllers
    /models        # MongoDB schemas
    /routes        # API routes
    /middleware    # Express middleware
    /utils         # Utility functions
    /config        # Configuration files
    /types        # TypeScript types
`,
  "html-css-js-flask-sqlite": `
Project Structure:
/static
  /css            # Stylesheets
  /js             # JavaScript files
  /images         # Image assets
  
/templates        # Flask HTML templates
  /layouts        # Layout templates
  /components     # Reusable components
  
/models          # SQLite models
/routes          # Flask routes
/utils           # Utility functions
/config          # Configuration files
`,
  "vue-django-postgres": `
Project Structure:
/frontend
  /src
    /components   # Vue components
    /views        # Vue views/pages
    /store        # Vuex store modules
    /services     # API services
    /utils        # Utility functions
    /assets       # Static assets
    
/backend
  /apps          # Django apps
  /templates     # Django templates
  /static        # Static files
  /models        # Django models
  /views         # Django views
  /api           # API endpoints
  /utils         # Utility functions
`,
  "react-firebase": `
Project Structure:
/src
  /components    # React components
  /pages         # Page components
  /hooks         # Custom hooks
  /services      # Firebase services
  /config        # Firebase config
  /utils         # Utility functions
  /contexts      # React contexts
  /types         # TypeScript types
  /assets        # Static assets
  
/functions      # Firebase Cloud Functions
`
};

const getFrameworkSpecificPrompt = (techStack: TechStack, pages: PageDescription[]) => {
  // Common instructions for all frameworks
  const commonInstructions = `
    1. Create responsive and mobile-first design
    2. Implement proper error handling and loading states
    3. Add form validations and user feedback
    4. Follow accessibility best practices
    5. Add smooth animations and transitions
    6. Implement SEO optimizations where applicable
    7. Add appropriate comments and documentation
    8. Include security best practices
  `;

  // Framework-specific instructions
  const frameworkInstructions = {
    "react-tailwind-node-mongo": `
      Technology Stack:
      - React with TypeScript for frontend
      - Tailwind CSS for styling
      - Node.js/Express for backend API
      - MongoDB for database
      
      Requirements:
      - Use functional components and React hooks
      - Implement responsive design with Tailwind CSS
      - Create reusable UI components
      - Set up proper routing between pages
      - Include API services for backend communication
      - MongoDB schemas and CRUD operations for data handling
    `,
    
    "html-css-js-flask-sqlite": `
      Technology Stack:
      - HTML5 for structure
      - CSS3 for styling with responsive design
      - Vanilla JavaScript for interactivity
      - Flask Python backend
      - SQLite for database
      
      Requirements:
      - Create semantic HTML structure
      - Use modern CSS with flexbox/grid for layouts
      - Implement JavaScript for dynamic elements
      - Set up Flask routing and templates
      - Add SQLite database operations
      - Include form validations and error handling
    `,
    
    "vue-django-postgres": `
      Technology Stack:
      - Vue.js for frontend
      - Django and Django REST framework for backend
      - PostgreSQL for database
      
      Requirements:
      - Use Vue 3 Composition API
      - Implement proper component structure
      - Set up Vue Router for navigation
      - Create Django models and views
      - Set up RESTful API endpoints
      - Include database migrations
    `,
    
    "react-firebase": `
      Technology Stack:
      - React with Firebase
      - Firebase Authentication
      - Firestore for database
      - Firebase Hosting
      - Optional: Firebase Cloud Functions
      
      Requirements:
      - Implement user authentication
      - Set up Firestore data structure
      - Create real-time data synchronization
      - Add Firebase security rules
      - Optional: Implement serverless functions
    `
  };

  return `
    ${frameworkInstructions[techStack]}
    
    Common Requirements:
    ${commonInstructions}
    
    Pages to implement:
    ${pages.map(page => `- ${page.name} (${page.path}): ${page.description}`).join('\n')}
    
    Please provide:
    1. Complete HTML files for each page (use \`\`\`html:${pages.map(p => p.path.replace(/^\//, '') || 'index').join('\`\`\` and \`\`\`html:')} format)
    2. CSS styles in a single file
    3. JavaScript functionality in a single file
    4. Any necessary backend code
    5. Database schemas or models if applicable
    
    Ensure all code is well-structured, properly formatted, and follows best practices for the selected tech stack.
  `;
};

export const generateWithGroq = async (
  projectDescription: string,
  pages: PageDescription[]
): Promise<{
  html?: Record<string, string>;
  css?: string;
  js?: string;
  react?: Record<string, string>;
  backend?: string;
}> => {
  if (!GROQ_API_KEY) throw new Error("GROQ API Key not found");

  const techStack = projectDescription.includes("React + Tailwind + Node.js") 
    ? "react-tailwind-node-mongo"
    : projectDescription.includes("HTML/CSS/JS + Flask") 
      ? "html-css-js-flask-sqlite"
      : projectDescription.includes("Vue.js + Django") 
        ? "vue-django-postgres"
        : projectDescription.includes("React + Firebase") 
          ? "react-firebase"
          : "react-tailwind-node-mongo"; // Default

  const enhancedPrompt = `
Create a web project with the following description:
${projectDescription}

The project consists of these pages:
${pages.map(page => `- ${page.name} (${page.path}): ${page.description}`).join('\n')}

${getFrameworkSpecificPrompt(techStack as TechStack, pages)}

For each page, generate a detailed HTML file with appropriate structure and content.
Return the complete code for each file using markdown code blocks with clear identifiers.

Format your response with:
1. HTML for each page using \`\`\`html:page-path\`\`\` (e.g., \`\`\`html:index\`\`\` for homepage)
2. Shared CSS using \`\`\`css\`\`\`
3. Shared JavaScript using \`\`\`javascript\`\`\`
4. Backend code if applicable using \`\`\`backend\`\`\` or \`\`\`server\`\`\`
5. Database schema if applicable using \`\`\`database\`\`\`

Ensure all code is production-ready, well-commented, and follows best practices.
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-r1-distill-llama-70b", // Updated to use the deepseek model
      messages: [
        {
          role: "system",
          content: `You are an expert full-stack developer who creates comprehensive, production-ready web applications. You excel at generating clean, well-structured code that follows best practices and modern development standards. Your code should be responsive, accessible, and optimized for performance.`,
        },
        {
          role: "user",
          content: enhancedPrompt,
        },
      ],
      max_tokens: 16000, // Increased token limit for more comprehensive responses
      temperature: 0.65, // Slightly lower temperature for more focused output
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Groq API request failed");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse HTML for each page
  const htmlFiles: Record<string, string> = {};
  
  // Extract page-specific HTML
  for (const page of pages) {
    const pagePathSlug = page.path.replace(/^\//, '').replace(/\//g, '-') || 'index';
    const pageRegex = new RegExp(`\`\`\`html:${pagePathSlug}\\s*([\\s\\S]*?)\`\`\``, 'i');
    const match = content.match(pageRegex);
    
    if (match) {
      htmlFiles[page.path] = match[1].trim();
    }
  }
  
  // Extract shared CSS
  const cssMatch = content.match(/```css\s*([\s\S]*?)```/);
  
  // Extract shared JS
  const jsMatch = content.match(/```javascript\s*([\s\S]*?)```/);
  
  // Extract backend code
  const backendMatch = content.match(/```(node|backend|express|server)\s*([\s\S]*?)```/i);
  
  // Extract database schema
  const dbMatch = content.match(/```(database|schema|sql|mongodb)\s*([\s\S]*?)```/i);

  return {
    html: htmlFiles,
    css: cssMatch ? cssMatch[1].trim() : undefined,
    js: jsMatch ? jsMatch[1].trim() : undefined,
    backend: backendMatch ? backendMatch[2].trim() : undefined,
    database: dbMatch ? dbMatch[2].trim() : undefined,
  };
};

export const assembleProject = (
  projectName: string,
  htmlFiles: Record<string, string>,
  techStack: TechStack,
  css?: string,
  js?: string,
  backend?: string,
  database?: string
): Promise<Blob> => {
  return new Promise((resolve) => {
    // Create a JSZip instance
    const zip = new JSZip();
    
    // Create project structure based on tech stack
    switch (techStack) {
      case "react-tailwind-node-mongo":
        // Frontend structure
        const frontendFolder = zip.folder("frontend");
        const frontendSrc = frontendFolder!.folder("src");
        frontendSrc!.folder("components");
        frontendSrc!.folder("layouts");
        frontendSrc!.folder("pages");
        frontendSrc!.folder("hooks");
        frontendSrc!.folder("services");
        frontendSrc!.folder("utils");
        frontendSrc!.folder("contexts");
        frontendSrc!.folder("types");
        frontendSrc!.folder("styles");
        frontendSrc!.folder("assets");
        
        // Backend structure
        const backendFolder = zip.folder("backend");
        const backendSrc = backendFolder!.folder("src");
        backendSrc!.folder("controllers");
        backendSrc!.folder("models");
        backendSrc!.folder("routes");
        backendSrc!.folder("middleware");
        backendSrc!.folder("utils");
        backendSrc!.folder("config");
        backendSrc!.folder("types");
        
        // Add HTML files to pages folder
        Object.entries(htmlFiles).forEach(([path, content]) => {
          const fileName = path === '/' ? 'Home' : path.replace(/^\//, '');
          frontendSrc!.file(`pages/${fileName}.jsx`, content);
        });
        
        // Add CSS to styles folder
        if (css) {
          frontendSrc!.file("styles/main.css", css);
        }
        
        // Add JS to utils folder
        if (js) {
          frontendSrc!.file("utils/main.js", js);
        }
        
        // Add backend files
        if (backend) {
          backendSrc!.file("server.js", backend);
        }
        
        // Add database schema
        if (database) {
          backendSrc!.file("models/schema.js", database);
        }
        break;
        
      case "html-css-js-flask-sqlite":
        // Static folders
        zip.folder("static/css");
        zip.folder("static/js");
        zip.folder("static/images");
        
        // Template folders
        const templates = zip.folder("templates");
        templates!.folder("layouts");
        templates!.folder("components");
        
        // Other folders
        zip.folder("models");
        zip.folder("routes");
        zip.folder("utils");
        zip.folder("config");
        
        // Add HTML files to templates folder
        Object.entries(htmlFiles).forEach(([path, content]) => {
          const fileName = path === '/' ? 'index' : path.replace(/^\//, '');
          templates!.file(`${fileName}.html`, content);
        });
        
        // Add CSS to static/css folder
        if (css) {
          zip.file("static/css/styles.css", css);
        }
        
        // Add JS to static/js folder
        if (js) {
          zip.file("static/js/main.js", js);
        }
        
        // Add Flask app.py
        if (backend) {
          zip.file("app.py", backend);
        }
        
        // Add database schema
        if (database) {
          zip.file("models/schema.sql", database);
        }
        break;
        
      case "vue-django-postgres":
        // Frontend structure
        const vueFrontend = zip.folder("frontend");
        const vueSrc = vueFrontend!.folder("src");
        vueSrc!.folder("components");
        vueSrc!.folder("views");
        vueSrc!.folder("store");
        vueSrc!.folder("services");
        vueSrc!.folder("utils");
        vueSrc!.folder("assets");
        
        // Backend structure
        const djangoBackend = zip.folder("backend");
        djangoBackend!.folder("apps");
        djangoBackend!.folder("templates");
        djangoBackend!.folder("static");
        djangoBackend!.folder("models");
        djangoBackend!.folder("views");
        djangoBackend!.folder("api");
        djangoBackend!.folder("utils");
        
        // Add Vue components based on HTML files
        Object.entries(htmlFiles).forEach(([path, content]) => {
          const fileName = path === '/' ? 'Home' : path.replace(/^\//, '');
          vueSrc!.file(`views/${fileName}.vue`, content);
        });
        
        // Add CSS to assets folder
        if (css) {
          vueSrc!.file("assets/styles.css", css);
        }
        
        // Add JS to utils folder
        if (js) {
          vueSrc!.file("utils/main.js", js);
        }
        
        // Add Django backend files
        if (backend) {
          djangoBackend!.file("manage.py", backend);
        }
        
        // Add database models
        if (database) {
          djangoBackend!.file("models/models.py", database);
        }
        break;
        
      case "react-firebase":
        // React Firebase structure
        const src = zip.folder("src");
        src!.folder("components");
        src!.folder("pages");
        src!.folder("hooks");
        src!.folder("services");
        src!.folder("config");
        src!.folder("utils");
        src!.folder("contexts");
        src!.folder("types");
        src!.folder("assets");
        zip.folder("functions");
        
        // Add React components based on HTML files
        Object.entries(htmlFiles).forEach(([path, content]) => {
          const fileName = path === '/' ? 'Home' : path.replace(/^\//, '');
          src!.file(`pages/${fileName}.jsx`, content);
        });
        
        // Add CSS to assets folder
        if (css) {
          src!.file("assets/styles.css", css);
        }
        
        // Add JS to utils folder
        if (js) {
          src!.file("utils/main.js", js);
        }
        
        // Add Firebase config
        src!.file("config/firebase.js", `
        // Firebase configuration
        import { initializeApp } from "firebase/app";
        import { getAuth } from "firebase/auth";
        import { getFirestore } from "firebase/firestore";
        import { getFunctions } from "firebase/functions";

        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "your-project.firebaseapp.com",
          projectId: "your-project",
          storageBucket: "your-project.appspot.com",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const functions = getFunctions(app);

        export { app, auth, db, functions };
        `);
        
        // Add Cloud Functions
        if (backend) {
          zip.file("functions/index.js", backend);
        }
        
        // Add database schema documentation
        if (database) {
          src!.file("config/database.js", database);
        }
        break;
        
      default:
        // Default flat structure for any other tech stack
        // Add HTML files
        Object.entries(htmlFiles).forEach(([path, content]) => {
          const fileName = path === '/' ? 'index.html' : `${path.replace(/^\//, '')}.html`;
          zip.file(fileName, content);
        });
        
        // Add CSS file
        if (css) {
          zip.file('styles.css', css);
        }
        
        // Add JS file
        if (js) {
          zip.file('script.js', js);
        }
        
        // Add backend files
        if (backend) {
          zip.file('server.js', backend);
        }
        
        // Add database schema
        if (database) {
          zip.file('database.js', database);
        }
    }
    
    // Generate readme
    const techStackLabel = TECH_STACK_OPTIONS.find(opt => opt.value === techStack)?.label || techStack;
    
    const readme = `# ${projectName}

## Project Overview
Generated by Thynk AI using ${techStackLabel}

## Pages
${Object.keys(htmlFiles).map(path => `- ${path === '/' ? 'Home' : path}`).join('\n')}

## Technology Stack
${techStackLabel}

## Project Structure
${projectStructures[techStack]}

## Getting Started
1. Extract the project files to your local machine
2. Follow the setup instructions specific to your chosen tech stack

### Setup Instructions
${
  techStack === "react-tailwind-node-mongo" 
    ? `
#### Frontend Setup
1. Navigate to the frontend directory
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the development server

#### Backend Setup
1. Navigate to the backend directory
2. Run \`npm install\` to install dependencies
3. Set up your MongoDB connection in \`src/config/database.js\`
4. Run \`npm start\` to start the backend server
`
    : techStack === "html-css-js-flask-sqlite"
    ? `
#### Setup
1. Create a Python virtual environment: \`python -m venv venv\`
2. Activate the virtual environment:
   - Windows: \`venv\\Scripts\\activate\`
   - Unix/MacOS: \`source venv/bin/activate\`
3. Install dependencies: \`pip install -r requirements.txt\`
4. Run the Flask application: \`python app.py\`
`
    : techStack === "vue-django-postgres"
    ? `
#### Frontend Setup
1. Navigate to the frontend directory
2. Run \`npm install\` to install dependencies
3. Run \`npm run serve\` to start the development server

#### Backend Setup
1. Navigate to the backend directory
2. Create a Python virtual environment: \`python -m venv venv\`
3. Activate the virtual environment
4. Install dependencies: \`pip install -r requirements.txt\`
5. Set up PostgreSQL and update settings in \`settings.py\`
6. Run migrations: \`python manage.py migrate\`
7. Start the server: \`python manage.py runserver\`
`
    : techStack === "react-firebase"
    ? `
#### Setup
1. Create a Firebase project at https://firebase.google.com
2. Enable Authentication, Firestore, and other services as needed
3. Update the Firebase configuration in \`src/config/firebase.js\`
4. Run \`npm install\` to install dependencies
5. Run \`npm start\` to start the development server
`
    : "Follow the documentation for your specific technology stack."
}

## Additional Information
- This project is responsive and optimized for all devices
- The codebase follows modern best practices and design patterns
- For questions or support, please contact support@thynk.ai
`;
    
    zip.file('README.md', readme);
    
    // Add package.json based on tech stack
    if (techStack.includes("react") || techStack.includes("vue")) {
      const packageJson = {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: 'Generated project by Thynk AI',
        scripts: {
          start: techStack.includes("react") ? 'react-scripts start' : 'vue-cli-service serve',
          build: techStack.includes("react") ? 'react-scripts build' : 'vue-cli-service build',
          test: techStack.includes("react") ? 'react-scripts test' : 'vue-cli-service test:unit',
          eject: techStack.includes("react") ? 'react-scripts eject' : 'vue-cli-service eject'
        },
        dependencies: techStack.includes("react") 
          ? {
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "react-router-dom": "^6.15.0",
              "react-scripts": "5.0.1"
            }
          : {
              "vue": "^3.3.4",
              "vue-router": "^4.2.4",
              "vuex": "^4.1.0"
            }
      };
      
      if (techStack === "react-tailwind-node-mongo") {
        zip.file('frontend/package.json', JSON.stringify(packageJson, null, 2));
        
        // Add backend package.json
        const backendPackageJson = {
          name: `${projectName.toLowerCase().replace(/\s+/g, '-')}-backend`,
          version: '1.0.0',
          description: 'Backend for generated project',
          main: 'src/server.js',
          scripts: {
            start: 'node src/server.js',
            dev: 'nodemon src/server.js'
          },
          dependencies: {
            "express": "^4.18.2",
            "mongoose": "^7.4.3",
            "cors": "^2.8.5",
            "dotenv": "^16.3.1",
            "body-parser": "^1.20.2"
          },
          devDependencies: {
            "nodemon": "^3.0.1"
          }
        };
        
        zip.file('backend/package.json', JSON.stringify(backendPackageJson, null, 2));
      } else {
        zip.file('package.json', JSON.stringify(packageJson, null, 2));
      }
    }
    
    // If it's a Flask project, add requirements.txt
    if (techStack === "html-css-js-flask-sqlite") {
      const requirements = `
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
SQLAlchemy==2.0.19
Flask-Cors==4.0.0
python-dotenv==1.0.0
Werkzeug==2.3.7
Jinja2==3.1.2
`;
      zip.file('requirements.txt', requirements);
    }
    
    // Generate the zip file
    zip.generateAsync({ type: 'blob' }).then(resolve);
  });
};