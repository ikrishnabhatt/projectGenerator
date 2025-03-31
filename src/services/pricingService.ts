
export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  buttonText: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '3 project generations per month',
      'Access to basic templates',
      'Community support',
      'Limited AI features'
    ],
    buttonText: 'Get Started'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1499,
    interval: 'month',
    features: [
      'Unlimited project generations',
      'Access to all templates',
      'Priority support',
      'Advanced AI features',
      'Custom code exports'
    ],
    isPopular: true,
    buttonText: 'Upgrade Now'
  },
  {
    id: 'team',
    name: 'Team',
    price: 3999,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom branding',
      'API access',
      'Dedicated support'
    ],
    buttonText: 'Contact Sales'
  }
];

export const getPricingPlans = async (): Promise<PricingPlan[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return pricingPlans;
};
