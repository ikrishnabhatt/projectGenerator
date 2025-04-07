
import React, { useState, useEffect } from "react";
import { getPricingPlans, PricingPlan } from "@/services/pricingService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingPlans from "@/components/pricing/PricingPlans";
import CustomPlanSection from "@/components/pricing/CustomPlanSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ZapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPricingPlans();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe to a plan");
      return;
    }
    
    // Redirect to payment checkout with plan parameter
    navigate(`/payment-checkout?plan=${planId}`);
  };

  const handleTopUp = (option: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to top up AI credits");
      return;
    }
    
    // Redirect to payment checkout with topup parameters
    navigate(`/payment-checkout?type=topup&option=${option}`);
  };

  const getCurrentPlan = () => {
    if (!isAuthenticated || !user) return null;
    return user.isPro ? "pro" : "free";
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto">
        <PricingHeader interval={interval} setInterval={setInterval} />
        
        <PricingPlans
          plans={plans}
          loading={loading}
          interval={interval}
          isAuthenticated={isAuthenticated}
          currentPlan={currentPlan}
          onSubscribe={handleSubscribe}
        />

        {/* AI Credits Top-up Card */}
        <div className="mt-12">
          <Card className="border-orange-300 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                  <PlusCircle className="h-5 w-5 text-orange-500 dark:text-orange-300" />
                </div>
                AI Credits Top-up
              </CardTitle>
              <CardDescription>
                Need more AI generations? Top up your credits without changing your plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-xl font-semibold">₹299</p>
                  <p className="text-gray-600 dark:text-gray-300">10 AI Generations</p>
                  <Button 
                    onClick={() => handleTopUp("1")} 
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Select
                  </Button>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-xl font-semibold">₹499</p>
                  <p className="text-gray-600 dark:text-gray-300">20 AI Generations</p>
                  <Button 
                    onClick={() => handleTopUp("2")} 
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Select
                  </Button>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-xl font-semibold">₹899</p>
                  <p className="text-gray-600 dark:text-gray-300">50 AI Generations</p>
                  <Button 
                    onClick={() => handleTopUp("3")} 
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Select
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CustomPlanSection />
      </div>
    </div>
  );
};

export default Pricing;
