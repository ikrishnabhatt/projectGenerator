
import React from "react";
import ExpertRequestForm from "@/components/ExpertRequestForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Crown, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const ExpertRequest = () => {
  const { isAuthenticated, user } = useAuth();
  const isPremiumUser = isAuthenticated && (user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'team');

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]" 
      style={{ 
        background: "linear-gradient(to bottom right, #fff5e6, #ffffff)"
      }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-orange-100 text-orange-600 px-4 py-1 rounded-full mb-4">
            <Crown className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Premium Feature</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Create by Experts</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let our experienced team build a custom project tailored to your specific requirements.
          </p>
        </div>
        
        {isPremiumUser ? (
          <ExpertRequestForm />
        ) : (
          <Card className="border-orange-300 shadow-md">
            <CardHeader className="text-center border-b border-orange-100 bg-orange-50">
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-2xl text-orange-700">Premium Access Required</CardTitle>
              <CardDescription className="text-orange-700/80">
                This feature is available exclusively for Pro and Team plan subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-orange-100">
                  <h3 className="text-lg font-medium flex items-center mb-3">
                    <Star className="h-5 w-5 text-orange-500 mr-2" />
                    Why Expert Creation?
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Custom-built projects by professional developers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Direct communication with our expert team</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Perfectly tailored to your specific business needs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Premium support and maintenance options</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <p className="text-center text-gray-600">
                    Upgrade to a Pro or Team plan to access this premium feature.
                  </p>
                  <Link to="/pricing">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      View Premium Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExpertRequest;
