
import { ProjectRequirement } from "@/services/aiService";

// Define CSS skeleton structure
interface CssTemplate {
  base: string;
  variables: string;
  components: string;
  utilities: string;
  animations: string;
  darkMode: string;
}

export const generateProjectCss = (requirements: ProjectRequirement): string => {
  const { projectType, themeColor, features } = requirements;
  
  // Generate CSS based on project requirements
  const cssTemplate = getCssTemplate(projectType, themeColor);
  
  // Add feature-specific CSS
  const featureCss = generateFeatureCss(features);
  
  // Combine all CSS parts
  return [
    cssTemplate.base,
    cssTemplate.variables,
    cssTemplate.components,
    featureCss,
    cssTemplate.utilities,
    cssTemplate.animations,
    cssTemplate.darkMode
  ].join('\n\n');
};

// Get CSS template based on project type and theme color
const getCssTemplate = (projectType: string, themeColor?: string): CssTemplate => {
  // Base CSS
  const base = `/* ${projectType.toUpperCase()} - Main CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  color: var(--text-color);
  background-color: var(--bg-color);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-dark);
}

img {
  max-width: 100%;
  height: auto;
}`;

  // Generate CSS variables based on theme color
  let primaryColor, primaryLight, primaryDark, accentColor;

  switch (themeColor) {
    case 'blue':
      primaryColor = '#2563eb';
      primaryLight = '#60a5fa';
      primaryDark = '#1d4ed8';
      accentColor = '#93c5fd';
      break;
    case 'green':
      primaryColor = '#059669';
      primaryLight = '#34d399';
      primaryDark = '#047857';
      accentColor = '#6ee7b7';
      break;
    case 'red':
      primaryColor = '#dc2626';
      primaryLight = '#f87171';
      primaryDark = '#b91c1c';
      accentColor = '#fca5a5';
      break;
    case 'purple':
      primaryColor = '#7c3aed';
      primaryLight = '#a78bfa';
      primaryDark = '#6d28d9';
      accentColor = '#c4b5fd';
      break;
    default:
      primaryColor = '#006A71';
      primaryLight = '#5A9C99';
      primaryDark = '#00565B';
      accentColor = '#A1A55C';
  }

  // CSS variables
  const variables = `:root {
  /* Color variables */
  --primary-color: ${primaryColor};
  --primary-light: ${primaryLight};
  --primary-dark: ${primaryDark};
  --accent-color: ${accentColor};
  
  --bg-color: #ffffff;
  --card-bg: #ffffff;
  --text-color: #1f2937;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
  --input-bg: #f9fafb;
  --input-border: #d1d5db;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Sizing and spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  
  /* Borders and shadows */
  --border-radius-sm: 0.125rem;
  --border-radius: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  --border-radius-2xl: 1rem;
  --border-radius-full: 9999px;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Transitions */
  --transition-all: all 0.2s ease;
  --transition-colors: background-color, border-color, color, fill, stroke 0.2s ease;
  --transition-opacity: opacity 0.2s ease;
  --transition-shadow: box-shadow 0.2s ease;
  --transition-transform: transform 0.2s ease;
}`;

  // Common components CSS based on project type
  let components = '';
  
  if (projectType.includes('e-commerce')) {
    components = `/* E-commerce components */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Product Card */
.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: var(--transition-all);
  height: 100%;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-card__image {
  position: relative;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
}

.product-card__image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

.product-card__content {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-card__title {
  font-size: var(--font-size-lg);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.product-card__price {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.product-card__description {
  color: var(--text-muted);
  margin-bottom: 1rem;
  flex-grow: 1;
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: var(--font-size-base);
  font-weight: 500;
  line-height: 1.5;
  border-radius: var(--border-radius);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-all);
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-secondary:hover {
  background-color: var(--primary-light);
  color: white;
}

.btn-block {
  display: block;
  width: 100%;
}

/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Category pills */
.category-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.category-pill {
  background-color: var(--gray-100);
  color: var(--gray-800);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-all);
}

.category-pill:hover, .category-pill.active {
  background-color: var(--primary-color);
  color: white;
}`;
  } else if (projectType.includes('blog')) {
    components = `/* Blog components */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-container {
  max-width: 768px;
  margin: 0 auto;
}

/* Article card */
.article-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: var(--transition-all);
  margin-bottom: 2rem;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.article-card__image {
  position: relative;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
}

.article-card__image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-card__image img {
  transform: scale(1.05);
}

.article-card__content {
  padding: 1.5rem;
}

.article-card__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.article-card__category {
  color: var(--primary-color);
  font-weight: 500;
}

.article-card__title {
  font-size: var(--font-size-2xl);
  margin-bottom: 0.75rem;
}

.article-card__excerpt {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.article-card__author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.article-card__author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.article-card__author-name {
  font-weight: 500;
}

/* Article content styles */
.article-content h1 {
  font-size: var(--font-size-4xl);
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.article-content h2 {
  font-size: var(--font-size-3xl);
  margin-top: 1.75rem;
  margin-bottom: 1rem;
}

.article-content h3 {
  font-size: var(--font-size-2xl);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.article-content p {
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.article-content img {
  border-radius: var(--border-radius);
  margin: 2rem 0;
}

.article-content blockquote {
  border-left: 4px solid var(--primary-color);
  padding-left: 1rem;
  font-style: italic;
  color: var(--text-muted);
  margin: 2rem 0;
}

.article-content ul, .article-content ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.article-content li {
  margin-bottom: 0.5rem;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  background-color: var(--gray-100);
  color: var(--text-muted);
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
}`;
  } else if (projectType.includes('portfolio') || projectType.includes('personal website')) {
    components = `/* Portfolio components */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero section */
.hero {
  padding: 6rem 0;
  text-align: center;
}

.hero__title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

/* About section */
.about {
  padding: 5rem 0;
}

.about__content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: center;
}

.about__image {
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.about__text h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: 1.5rem;
}

.about__text p {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

/* Skills */
.skills {
  padding: 5rem 0;
  background-color: var(--gray-50);
}

.skills__title {
  font-size: var(--font-size-3xl);
  text-align: center;
  margin-bottom: 3rem;
}

.skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.skill {
  text-align: center;
}

.skill__icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
}

.skill__name {
  font-weight: 500;
}

/* Portfolio grid */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.portfolio-item {
  position: relative;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.portfolio-item__image {
  aspect-ratio: 16/9;
  width: 100%;
  object-fit: cover;
}

.portfolio-item__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: var(--transition-all);
}

.portfolio-item:hover .portfolio-item__overlay {
  opacity: 1;
}

.portfolio-item__title {
  color: white;
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.portfolio-item__category {
  color: var(--gray-200);
  font-size: var(--font-size-sm);
}

.portfolio-item__button {
  margin-top: 1rem;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
}

/* Contact section */
.contact {
  padding: 5rem 0;
}

.contact__form {
  max-width: 36rem;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  background-color: var(--input-bg);
  transition: var(--transition-all);
}

.form-input:focus, .form-textarea:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.2);
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}`;
  } else {
    // Generic components
    components = `/* General components */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Section spacing */
.section {
  padding: 4rem 0;
}

.section-title {
  font-size: var(--font-size-3xl);
  margin-bottom: 2rem;
  text-align: center;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  max-width: 36rem;
  margin: 0 auto 3rem;
  text-align: center;
}

/* Card */
.card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition-all);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card__content {
  padding: 1.5rem;
}

.card__title {
  font-size: var(--font-size-xl);
  margin-bottom: 0.75rem;
}

.card__text {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: var(--font-size-base);
  font-weight: 500;
  line-height: 1.5;
  border-radius: var(--border-radius);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-all);
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-secondary:hover {
  background-color: var(--primary-light);
  color: white;
}

.btn-block {
  display: block;
  width: 100%;
}

/* Grid layouts */
.grid {
  display: grid;
  gap: 2rem;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .sm\\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Feature */
.feature {
  text-align: center;
  padding: 2rem;
}

.feature__icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: var(--primary-color);
}

.feature__title {
  font-size: var(--font-size-xl);
  margin-bottom: 1rem;
}

.feature__text {
  color: var(--text-muted);
}

/* Form elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  background-color: var(--input-bg);
  transition: var(--transition-all);
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.2);
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}`;
  }

  // Utility classes
  const utilities = `/* Utility classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }
.text-4xl { font-size: var(--font-size-4xl); }

.text-primary { color: var(--primary-color); }
.text-muted { color: var(--text-muted); }
.text-white { color: white; }

.bg-primary { background-color: var(--primary-color); }
.bg-light { background-color: var(--gray-50); }
.bg-white { background-color: white; }

.mt-1 { margin-top: var(--spacing-1); }
.mt-2 { margin-top: var(--spacing-2); }
.mt-3 { margin-top: var(--spacing-3); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-6 { margin-top: var(--spacing-6); }
.mt-8 { margin-top: var(--spacing-8); }
.mt-12 { margin-top: var(--spacing-12); }

.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }
.mb-8 { margin-bottom: var(--spacing-8); }
.mb-12 { margin-bottom: var(--spacing-12); }

.mx-auto { margin-left: auto; margin-right: auto; }

.py-1 { padding-top: var(--spacing-1); padding-bottom: var(--spacing-1); }
.py-2 { padding-top: var(--spacing-2); padding-bottom: var(--spacing-2); }
.py-3 { padding-top: var(--spacing-3); padding-bottom: var(--spacing-3); }
.py-4 { padding-top: var(--spacing-4); padding-bottom: var(--spacing-4); }
.py-6 { padding-top: var(--spacing-6); padding-bottom: var(--spacing-6); }
.py-8 { padding-top: var(--spacing-8); padding-bottom: var(--spacing-8); }
.py-12 { padding-top: var(--spacing-12); padding-bottom: var(--spacing-12); }

.px-1 { padding-left: var(--spacing-1); padding-right: var(--spacing-1); }
.px-2 { padding-left: var(--spacing-2); padding-right: var(--spacing-2); }
.px-3 { padding-left: var(--spacing-3); padding-right: var(--spacing-3); }
.px-4 { padding-left: var(--spacing-4); padding-right: var(--spacing-4); }
.px-6 { padding-left: var(--spacing-6); padding-right: var(--spacing-6); }
.px-8 { padding-left: var(--spacing-8); padding-right: var(--spacing-8); }

.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded { border-radius: var(--border-radius); }
.rounded-md { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }
.rounded-xl { border-radius: var(--border-radius-xl); }
.rounded-full { border-radius: var(--border-radius-full); }

.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow { box-shadow: var(--shadow); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

.w-full { width: 100%; }
.h-full { height: 100%; }

.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1; }
.gap-1 { gap: var(--spacing-1); }
.gap-2 { gap: var(--spacing-2); }
.gap-3 { gap: var(--spacing-3); }
.gap-4 { gap: var(--spacing-4); }

.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.inline-flex { display: inline-flex; }

/* Responsive utilities */
@media (min-width: 640px) {
  .sm\\:flex { display: flex; }
  .sm\\:hidden { display: none; }
  .sm\\:block { display: block; }
  .sm\\:text-left { text-align: left; }
  /* Add more sm variants as needed */
}

@media (min-width: 768px) {
  .md\\:flex { display: flex; }
  .md\\:hidden { display: none; }
  .md\\:block { display: block; }
  /* Add more md variants as needed */
}

@media (min-width: 1024px) {
  .lg\\:flex { display: flex; }
  .lg\\:hidden { display: none; }
  .lg\\:block { display: block; }
  /* Add more lg variants as needed */
}

@media (min-width: 1280px) {
  .xl\\:flex { display: flex; }
  .xl\\:hidden { display: none; }
  .xl\\:block { display: block; }
  /* Add more xl variants as needed */
}`;

  // Animations
  const animations = `/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(-30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
.animate-slideInRight { animation: slideInRight 0.5s ease forwards; }
.animate-slideInUp { animation: slideInUp 0.5s ease forwards; }
.animate-pulse { animation: pulse 2s infinite; }

/* Animation delays */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }

/* Hover transitions */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

.hover-shadow {
  transition: box-shadow 0.2s ease;
}

.hover-shadow:hover {
  box-shadow: var(--shadow-md);
}`;

  // Dark mode
  const darkMode = `/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #111827;
    --card-bg: #1f2937;
    --text-color: #f9fafb;
    --text-muted: #9ca3af;
    --border-color: #374151;
    --input-bg: #1f2937;
    --input-border: #4b5563;
  }
}

.dark-mode {
  --bg-color: #111827;
  --card-bg: #1f2937;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --border-color: #374151;
  --input-bg: #1f2937;
  --input-border: #4b5563;
}`;

  return {
    base,
    variables,
    components,
    utilities,
    animations,
    darkMode
  };
};

// Generate feature-specific CSS
const generateFeatureCss = (features: string[]): string => {
  let featureCss = '';

  // Check for specific features and add related CSS
  if (features.includes('darkMode') || features.includes('dark mode')) {
    featureCss += `
/* Dark Mode Toggle */
.dark-mode-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.toggle-switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: .4s;
  border-radius: 30px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

.dark-icon, .light-icon {
  width: 18px;
  height: 18px;
}`;
  }

  if (features.includes('authentication') || features.includes('login') || features.includes('register')) {
    featureCss += `
/* Authentication forms */
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.auth-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: var(--font-size-2xl);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-input {
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: var(--border-radius);
  background-color: var(--input-bg);
}

.auth-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-all);
}

.auth-button:hover {
  background-color: var(--primary-dark);
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: var(--font-size-sm);
}

.error-message {
  color: var(--error);
  font-size: var(--font-size-sm);
  margin-top: 0.5rem;
}`;
  }

  if (features.includes('responsive')) {
    featureCss += `
/* Additional responsive utilities */
/* Small screens */
@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }
  
  .section {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: var(--font-size-2xl);
  }
  
  .section-subtitle {
    font-size: var(--font-size-base);
  }
  
  .hide-sm {
    display: none;
  }
}

/* Medium screens */
@media (min-width: 641px) and (max-width: 1024px) {
  .hide-md {
    display: none;
  }
}

/* Large screens */
@media (min-width: 1025px) {
  .container {
    padding: 0 2rem;
  }
  
  .hide-lg {
    display: none;
  }
}`;
  }

  return featureCss;
};

// Export the css generation service
export default {
  generateProjectCss
};
