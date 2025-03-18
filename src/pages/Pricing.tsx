import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Star, ZapIcon, Users, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
// import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "AI+",
      description: "Perfect for individuals who need AI assistance for personal projects",
      priceMonthly: 9.99,
      priceYearly: 99.99,
      features: [
        { name: "5 AI projects per month", included: true },
        { name: "Basic code generation", included: true },
        { name: "Email support", included: true },
        { name: "Access to templates", included: true },
        { name: "Advanced customization", included: false },
        { name: "API access", included: false },
        { name: "Priority support", included: false },
      ],
      popular: false,
      icon: ZapIcon
    },
    {
      name: "Expert++",
      description: "For professionals and teams who need advanced AI tools and collaboration",
      priceMonthly: 29.99,
      priceYearly: 299.99,
      features: [
        { name: "Unlimited AI projects", included: true },
        { name: "Advanced code generation", included: true },
        { name: "Priority email & chat support", included: true },
        { name: "Premium templates", included: true },
        { name: "Advanced customization", included: true },
        { name: "API access", included: true },
        { name: "Team collaboration tools", included: true },
      ],
      popular: true,
      icon: Cpu
    },
    {
      name: "AI Points Topup",
      description: "Add more AI points to your account for larger projects",
      priceMonthly: 19.99,
      priceYearly: null, // Not applicable for points topup
      pointsAmount: 1000,
      features: [
        { name: "1000 AI generation points", included: true },
        { name: "No expiration date", included: true },
        { name: "Works with any plan", included: true },
        { name: "Bulk discounts available", included: true },
      ],
      popular: false,
      icon: Users
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12 mt-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Pricing Plans for <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">Every Developer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to enhance your development workflow with AI-powered assistance.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <Tabs 
            defaultValue="monthly" 
            className="w-[400px]"
            onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly <span className="ml-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-3 py-0.5 text-xs text-white">Save 17%</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col border-2 ${
                plan.popular ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" /> Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-violet-100 text-blue-600">
                    <plan.icon className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 min-h-[50px]">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4 flex-grow">
                <div className="mb-6">
                  {plan.name === "AI Points Topup" ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                      <span className="text-gray-600 ml-2">for {plan.pointsAmount} points</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">
                        ${billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly}
                      </span>
                      <span className="text-gray-600 ml-2">/ {billingCycle === "monthly" ? "month" : "year"}</span>
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "" : "text-gray-400"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700' 
                      : ''
                  }`}
                  asChild
                >
                  <Link to="/signup">
                    {plan.name === "AI Points Topup" ? "Buy Points" : "Get Started"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">What's the difference between AI+ and Expert++?</h3>
              <p className="text-gray-600">
                AI+ is designed for individual use with basic AI features, while Expert++ offers unlimited projects, 
                advanced features, and team collaboration tools for professionals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How do AI Points work?</h3>
              <p className="text-gray-600">
                AI Points are used for generating code and projects. Each generation consumes points based on complexity.
                Points can be added to any plan to extend your usage beyond plan limits.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade, downgrade, or cancel your plan at any time. When upgrading, you'll be 
                prorated for the remainder of your billing period.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
