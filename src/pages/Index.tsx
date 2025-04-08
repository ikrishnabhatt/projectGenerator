
import React from "react";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import PopularTemplates from "@/components/PopularTemplates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check, ArrowRight, IndianRupee, Code, Bot, Rocket, Users } from "lucide-react";
import PlanFeatureList from "@/components/pricing/PlanFeatureList";

const Index = () => {
  return (
    <div>
      <Hero />
      
      {/* Feature Cards with gradient background */}
      <section className="py-16 features-gradient-light dark:features-gradient-dark">
        <FeatureCards />
      </section>
      
      {/* Popular Templates with gradient background */}
      <section className="py-16 templates-gradient-light dark:templates-gradient-dark">
        <PopularTemplates />
      </section>
      
      {/* Create with Experts Section */}
      <section className="py-16 experts-gradient-light dark:experts-gradient-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#5A9C99] dark:text-teal-300">Create Custom Projects with Experts</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Need something more tailored to your specific needs? Our expert team will create a custom project just for you.
              </p>
            </div>
            
            <Card className="border-[#5A9C99]/30 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#5A9C99] dark:text-teal-300">Expert-Crafted Projects</CardTitle>
                <CardDescription className="text-[#5A9C99]/80 dark:text-teal-300/80">
                  Get a professionally built project created by our team of experienced developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <PlanFeatureList features={[
                      "Custom Requirements",
                      "Professional Quality",
                      "Best Practices Implementation"
                    ]} />
                  </div>
                  <div>
                    <PlanFeatureList features={[
                      "Full Documentation",
                      "Expert Support",
                      "Direct Communication"
                    ]} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/create-by-experts" className="w-full">
                  <Button className="w-full bg-[#5A9C99] hover:bg-[#787c25] dark:bg-[#5A9C99]/80 dark:hover:bg-[#787c25]/80">
                    Request Expert Project
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Pricing Section Preview */}
      <section className="py-16 pricing-gradient-light dark:pricing-gradient-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#5A9C99] dark:text-teal-300">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Choose the plan that's right for you or your team
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#5A9C99] dark:text-teal-300">Free</CardTitle>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold flex items-center text-[#5A9C99] dark:text-teal-300">
                      <IndianRupee className="h-6 w-6 mb-1" />
                      0
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <PlanFeatureList features={[
                    "3 project generations",
                    "Basic templates"
                  ]} />
                </CardContent>
                <CardFooter>
                  <Link to="/pricing" className="w-full">
                    <Button variant="outline" className="w-full border-[#5A9C99] text-[#5A9C99] hover:border-[#F6F8D5] hover:text-[#787c25] dark:border-teal-500 dark:text-teal-300">View Plans</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="border-[#5A9C99] shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
                <div className="absolute top-0 right-0 bg-[#5A9C99] dark:bg-teal-700 text-white text-xs px-3 py-1">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-[#5A9C99] dark:text-teal-300">Pro</CardTitle>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold flex items-center text-[#5A9C99] dark:text-teal-300">
                      <IndianRupee className="h-6 w-6 mb-1" />
                      1,499
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <PlanFeatureList features={[
                    "Unlimited generations",
                    "All templates",
                    "Priority support"
                  ]} />
                </CardContent>
                <CardFooter>
                  <Link to="/pricing" className="w-full">
                    <Button className="w-full bg-[#5A9C99] hover:bg-[#787c25] dark:bg-[#5A9C99]/80 dark:hover:bg-[#787c25]/80">View Plans</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#5A9C99] dark:text-teal-300">Enterprise</CardTitle>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold flex items-center text-[#5A9C99] dark:text-teal-300">
                      <IndianRupee className="h-6 w-6 mb-1" />
                      4,999
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <PlanFeatureList features={[
                    "Unlimited everything",
                    "Custom integrations",
                    "Dedicated support"
                  ]} />
                </CardContent>
                <CardFooter>
                  <Link to="/pricing" className="w-full">
                    <Button variant="outline" className="w-full border-[#5A9C99] text-[#5A9C99] hover:border-[#F6F8D5] hover:text-[#787c25] dark:border-teal-500 dark:text-teal-300">Contact Sales</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
