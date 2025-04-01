
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

const Pricing = () => {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

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
    
    // This would normally redirect to a payment page or process
    toast.success(`Subscribing to ${planId} plan`);
  };

  const handleTopUp = () => {
    if (!isAuthenticated) {
      toast.error("Please login to top up AI credits");
      return;
    }
    
    toast.success("Redirecting to AI credits top-up page");
  };

  const getCurrentPlan = () => {
    if (!isAuthenticated || !user) return null;
    return user.subscriptionTier;
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
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
                <div className="bg-orange-100 p-2 rounded-full">
                  <PlusCircle className="h-5 w-5 text-orange-500" />
                </div>
                AI Credits Top-up
              </CardTitle>
              <CardDescription>
                Need more AI generations? Top up your credits without changing your plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <p className="text-xl font-semibold">₹299</p>
                  <p className="text-gray-600">10 AI Generations</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <p className="text-xl font-semibold">₹499</p>
                  <p className="text-gray-600">20 AI Generations</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <p className="text-xl font-semibold">₹899</p>
                  <p className="text-gray-600">50 AI Generations</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleTopUp} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Top Up AI Credits
              </Button>
            </CardFooter>
          </Card>
        </div>

        <CustomPlanSection />
      </div>
    </div>
  );
};

export default Pricing;
