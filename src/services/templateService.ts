
import { templateThumbnails } from "@/assets/template-thumbnails";

export type Template = {
  id: string;
  name: string;
  description: string;
  category: 'Dashboard' | 'E-commerce' | 'Portfolio' | 'Blog' | 'SaaS' | 'Mobile App' | 'Landing Page' | 'Other';
  image: string;
  techStack: string[];
  popularity: number;
  author?: string;
  githubUrl?: string;
};

// Mock template data with more templates and proper credits
const templates: Template[] = [
  {
    id: "template-1",
    name: "Admin Dashboard",
    description: "Complete admin dashboard with analytics, user management, and data visualization",
    category: "Dashboard",
    image: templateThumbnails.dashboard,
    techStack: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    popularity: 95,
    author: "TailAdmin",
    githubUrl: "https://github.com/TailAdmin/free-tailwind-dashboard-template"
  },
  {
    id: "template-2",
    name: "E-commerce Store",
    description: "Fully-featured online store with product catalog, cart, and checkout",
    category: "E-commerce",
    image: templateThumbnails.ecommerce,
    techStack: ["React", "Node.js", "MongoDB", "Stripe"],
    popularity: 92,
    author: "adrianhajdin",
    githubUrl: "https://github.com/adrianhajdin/ecommerce"
  },
  {
    id: "template-3",
    name: "Developer Portfolio",
    description: "Professional portfolio website for developers with project showcase",
    category: "Portfolio",
    image: templateThumbnails.portfolio,
    techStack: ["React", "Next.js", "Tailwind CSS"],
    popularity: 88,
    author: "soumyajit4419",
    githubUrl: "https://github.com/soumyajit4419/Portfolio"
  },
  {
    id: "template-4",
    name: "Content Blog",
    description: "Clean and minimal blog with content management system",
    category: "Blog",
    image: templateThumbnails.blog,
    techStack: ["React", "GraphQL", "Contentful"],
    popularity: 85,
    author: "realstoman",
    githubUrl: "https://github.com/realstoman/nextjs-tailwindcss-blog"
  },
  {
    id: "template-5",
    name: "SaaS Landing Page",
    description: "Modern SaaS landing page with feature showcases and subscription plans",
    category: "SaaS",
    image: templateThumbnails.saas,
    techStack: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    popularity: 82,
    author: "cruip",
    githubUrl: "https://github.com/cruip/tailwind-landing-page-template"
  },
  {
    id: "template-6",
    name: "React Native App",
    description: "Cross-platform mobile app template with authentication and navigation",
    category: "Mobile App",
    image: templateThumbnails.mobileApp,
    techStack: ["React Native", "Expo", "Firebase", "Redux"],
    popularity: 78,
    author: "instamobile",
    githubUrl: "https://github.com/instamobile/react-native-starter-kit"
  },
  {
    id: "template-7",
    name: "Personal Blog",
    description: "Minimalist blog template with dark mode and responsive design",
    category: "Blog",
    image: templateThumbnails.blog,
    techStack: ["React", "Gatsby", "Tailwind CSS", "MDX"],
    popularity: 76,
    author: "timlrx",
    githubUrl: "https://github.com/timlrx/tailwind-nextjs-starter-blog"
  },
  {
    id: "template-8",
    name: "Analytics Dashboard",
    description: "Data visualization dashboard with charts, tables, and filtering",
    category: "Dashboard",
    image: templateThumbnails.dashboard,
    techStack: ["React", "TypeScript", "D3.js", "Material UI"],
    popularity: 74,
    author: "cruip",
    githubUrl: "https://github.com/cruip/open-react-template"
  },
  {
    id: "template-9",
    name: "Creative Portfolio",
    description: "Stunning portfolio for designers and creatives with beautiful animations",
    category: "Portfolio",
    image: templateThumbnails.portfolio,
    techStack: ["React", "Next.js", "Framer Motion", "Tailwind CSS"],
    popularity: 72,
    author: "bchiang7",
    githubUrl: "https://github.com/bchiang7/v4"
  },
  {
    id: "template-10",
    name: "Company Website",
    description: "Professional company website with team profiles and services showcase",
    category: "Landing Page",
    image: templateThumbnails.landingPage,
    techStack: ["React", "Next.js", "Tailwind CSS"],
    popularity: 70,
    author: "cruip",
    githubUrl: "https://github.com/cruip/tailwind-landing-page-template"
  }
];

// API methods
export const getAllTemplates = async (): Promise<Template[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return templates;
};

export const getTemplatesByCategory = async (category: string): Promise<Template[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return templates.filter(template => 
    category === 'All' ? true : template.category === category
  );
};

export const getTemplateById = async (id: string): Promise<Template | undefined> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  return templates.find(template => template.id === id);
};

export const downloadTemplate = async (template: Template): Promise<string> => {
  try {
    // In a real implementation, this would download or create a ZIP file from the template
    // For now, we'll create a JSON blob with the template data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const templateData = JSON.stringify({
      name: template.name,
      description: template.description,
      category: template.category,
      techStack: template.techStack,
      author: template.author,
      githubUrl: template.githubUrl
    }, null, 2);
    
    return URL.createObjectURL(new Blob(
      [templateData], 
      { type: 'application/json' }
    ));
  } catch (error) {
    console.error("Error downloading template:", error);
    throw new Error("Failed to download template");
  }
};
