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
    <div className="bg-background">
      <Hero />
      
      {/* Feature Cards with gradient background - improved dark mode */}
      <section className="py-16 bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <FeatureCards />
      </section>
      
      {/* Popular Templates with gradient background - improved dark mode */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <PopularTemplates />
      </section>
      
      {/* Create with Experts Section - improved dark mode */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-yellow-50 to-lime-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#5A9C99] dark:text-[#7be3df]">Create Custom Projects with Experts</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Need something more tailored to your specific needs? Our expert team will create a custom project just for you.
              </p>
            </div>
            
            <Card className="border-[#5A9C99]/30 dark:border-[#5A9C99]/50 dark:bg-gray-800/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#5A9C99] dark:text-[#7be3df]">Expert-Crafted Projects</CardTitle>
                <CardDescription className="text-[#5A9C99] dark:text-[#5A9C99]/80">
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
                  <Button className="w-full bg-[#5A9C99] hover:bg-[#787c25] text-white">
                    Request Expert Project
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Pricing Section Preview - improved dark mode */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#5A9C99] dark:text-[#7be3df]">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Choose the plan that's right for you or your team
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-gray-800/60">
                <CardHeader>
                  <CardTitle className="text-[#5A9C99] dark:text-[#7be3df]">Free</CardTitle>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold flex items-center text-[#5A9C99] dark:text-[#7be3df]">
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
                    <Button variant="outline" className="w-full border-[#5A9C99] text-[#5A9C99] hover:border-[#F6F8D5] hover:text-[#787c25] dark:text-[#7be3df] dark:border-[#7be3df]">View Plans</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="border-[#5A9C99] shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:border-[#5A9C99]">
                <div className="absolute top-0 right-0 bg-[#5A9C99] text-white text-xs px-3 py-1">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-[#5A9C99] dark:text-[#7be3df]">Pro</CardTitle>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold flex items-center text-[#5A9C99] dark:text-[#7be3df]">
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
                    <Button className="w-full bg-[#5A9C99] hover:bg-[#787c25] text-white">View Plans</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-gray-800/60">
                <CardHeader>
                  <CardTitle className="text-[#5A9C99] dark:text-[#7be3df]">Enterprise</CardTitle>
                  <div className="mt-4 flex items-end">
                    <span className="text-4xl font-bold flex items-center text-[#5A9C99] dark:text-[#7be3df]">
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
                    <Button variant="outline" className="w-full border-[#5A9C99] text-[#5A9C99] hover:border-[#F6F8D5] hover:text-[#787c25] dark:text-[#7be3df] dark:border-[#7be3df]">Contact Sales</Button>
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
