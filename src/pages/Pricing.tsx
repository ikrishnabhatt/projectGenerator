
import React, { useState, useEffect } from "react";
import { getPricingPlans, PricingPlan } from "@/services/pricingService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingPlans from "@/components/pricing/PricingPlans";
import CustomPlanSection from "@/components/pricing/CustomPlanSection";

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

        <CustomPlanSection />
      </div>
    </div>
  );
};

export default Pricing;
