
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'dashboard' | 'e-commerce' | 'portfolio' | 'blog' | 'landing';
  tags: string[];
  features: string[];
  backend: 'none' | 'express' | 'django' | 'laravel' | 'nextjs';
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export const templates: ProjectTemplate[] = [
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'A modern analytics dashboard with charts, tables, and interactive elements.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    category: 'dashboard',
    tags: ['react', 'charts', 'admin', 'business'],
    features: ['Responsive design', 'Interactive charts', 'Data tables', 'Dark mode'],
    backend: 'express',
    complexity: 'intermediate'
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'A complete e-commerce solution with product listings, cart, and checkout.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop',
    category: 'e-commerce',
    tags: ['shop', 'products', 'cart', 'payments'],
    features: ['Product grid', 'Shopping cart', 'Checkout flow', 'User accounts'],
    backend: 'nextjs',
    complexity: 'advanced'
  },
  {
    id: 'portfolio-minimal',
    name: 'Minimal Portfolio',
    description: 'A clean, minimalist portfolio site for showcasing creative work.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop',
    category: 'portfolio',
    tags: ['personal', 'creative', 'showcase', 'minimal'],
    features: ['Project gallery', 'About section', 'Contact form', 'Responsive design'],
    backend: 'none',
    complexity: 'beginner'
  },
  {
    id: 'blog-modern',
    name: 'Modern Blog',
    description: 'A feature-rich blog platform with dark mode and commenting system.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop',
    category: 'blog',
    tags: ['content', 'articles', 'writing', 'publishing'],
    features: ['Article feed', 'Categories', 'Author profiles', 'Comments'],
    backend: 'django',
    complexity: 'intermediate'
  },
  {
    id: 'landing-saas',
    name: 'SaaS Landing Page',
    description: 'A conversion-focused landing page for SaaS products with feature showcase.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    category: 'landing',
    tags: ['marketing', 'saas', 'business', 'startup'],
    features: ['Hero section', 'Feature cards', 'Testimonials', 'Pricing table'],
    backend: 'none',
    complexity: 'beginner'
  },
  {
    id: 'ecommerce-admin',
    name: 'E-commerce Admin',
    description: 'A comprehensive admin panel for managing an e-commerce platform.',
    image: 'https://images.unsplash.com/photo-1553484771-898ed465e931?q=80&w=2070&auto=format&fit=crop',
    category: 'dashboard',
    tags: ['admin', 'e-commerce', 'management', 'business'],
    features: ['Product management', 'Order processing', 'Customer database', 'Analytics'],
    backend: 'laravel',
    complexity: 'advanced'
  }
];
