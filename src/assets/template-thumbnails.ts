
export const templateThumbnails = {
  dashboard: "../../public/template-icons/dashboard.png",
  ecommerce: "../../public/template-icons/ecommerce.jpg",
  portfolio: "../../public/template-icons/portfolio.png",
  blog: "../../public/template-icons/blog.png",
  saas: "../../public/template-icons/saas.jpeg",
  mobileApp: "../../public/template-icons/mobileapp.png",
  landingPage: "../../public/template-icons/landingpage.png",
  adminDashboard: "../../public/template-icons/admindashboard.png",
  contentBlog: "../../public/template-icons/blog.png",
  analyticsApp: "../../public/template-icons/another.jpg",
  ecommerceMobile: "../../public/template-icons/mobileapp.jpg",
  personalPortfolio: "../../public/template-icons/portfolio.png",
  default: "../../public/template-icons/dashboard.png"
};

export const backgroundImages = {
  login: "/lovable-uploads/login-bg.png",
  signup: "/lovable-uploads/signup-bg.png",
  docs: "/lovable-uploads/docs-bg.png",
  hero: "/lovable-uploads/hero-banner.png"
};

/**
 * Function to get a template thumbnail by name or fallback to default
 * This function will first try to find an exact match, then a partial match,
 * and finally fall back to the default if no match is found.
 */
export const getTemplateThumbnail = (name: string): string => {
  // If the provided name is empty, return the default thumbnail
  if (!name) return templateThumbnails.default;
  
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  
  // 1. Try to find exact match in templateThumbnails
  for (const [key, value] of Object.entries(templateThumbnails)) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }
  
  // 2. Try to find partial match in templateThumbnails
  for (const [key, value] of Object.entries(templateThumbnails)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return value;
    }
  }
  
  // 3. If no match found, return default
  return templateThumbnails.default;
};

// Simplifies adding new template images by just putting the file in public folder
// Example: getTemplateImagePath("admin-dashboard") => "/admin-dashboard.png"
export const getTemplateImagePath = (templateName: string): string => {
  // Normalize the template name to kebab-case format
  const normalizedName = templateName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Return the path to the image
  return `/${normalizedName}.png`;
};

// New function to easily get template images from simpler filenames
export const getSimpleTemplateThumbnail = (templateName: string): string => {
  try {
    const simpleName = templateName
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
      
    return `/${simpleName}.png`;
  } catch (error) {
    console.error("Error getting simple template thumbnail:", error);
    return templateThumbnails.default;
  }
};
