
import React from "react";
import { PricingPlan } from "@/services/pricingService";
import PricingCard from "./PricingCard";
import PricingCardSkeleton from "./PricingCardSkeleton";

interface PricingPlansProps {
  plans: PricingPlan[];
  loading: boolean;
  interval: "month" | "year";
  isAuthenticated: boolean;
  currentPlan: string | null;
  onSubscribe: (planId: string) => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({
  plans,
  loading,
  interval,
  isAuthenticated,
  currentPlan,
  onSubscribe,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {loading
        ? Array(3)
            .fill(0)
            .map((_, i) => <PricingCardSkeleton key={i} />)
        : plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              interval={interval}
              isAuthenticated={isAuthenticated}
              currentPlan={currentPlan}
              onSubscribe={onSubscribe}
            />
          ))}
    </div>
  );
};

export default PricingPlans;
