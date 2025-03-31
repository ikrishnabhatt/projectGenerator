
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { PricingPlan } from "@/services/pricingService";
import PlanFeatureList from "./PlanFeatureList";

interface PricingCardProps {
  plan: PricingPlan;
  interval: "month" | "year";
  isAuthenticated: boolean;
  currentPlan: string | null;
  onSubscribe: (planId: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  interval, 
  isAuthenticated, 
  currentPlan, 
  onSubscribe 
}) => {
  const getAdjustedPrice = (price: number): number => {
    if (interval === "year") {
      // Apply 20% discount for yearly billing
      return Math.round(price * 12 * 0.8);
    }
    return price;
  };

  return (
    <Card
      className={`relative overflow-hidden ${
        plan.isPopular ? "border-brand-purple shadow-lg" : ""
      } ${currentPlan === plan.id ? "ring-2 ring-brand-purple" : ""}`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs px-3 py-1">
          Most Popular
        </div>
      )}
      {currentPlan === plan.id && (
        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-3 py-1">
          Current Plan
        </div>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <div className="mt-4 flex items-end">
          <span className="text-4xl font-bold flex items-center">
            <IndianRupee className="h-6 w-6 mb-1" />
            {getAdjustedPrice(plan.price)}
          </span>
          <span className="text-gray-500 ml-2">
            {interval === "month" ? "/month" : "/year"}
          </span>
        </div>
        <CardDescription className="mt-2">
          {plan.id === "free"
            ? "Perfect for getting started"
            : plan.id === "pro"
            ? "Best for individual professionals"
            : "Ideal for teams and businesses"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlanFeatureList features={plan.features} />
      </CardContent>
      <CardFooter>
        {isAuthenticated ? (
          currentPlan === plan.id ? (
            <Button
              className="w-full bg-gray-500 hover:bg-gray-600"
              disabled
            >
              Current Plan
            </Button>
          ) : (
            <Button
              onClick={() => onSubscribe(plan.id)}
              className={`w-full ${
                plan.isPopular
                  ? "bg-brand-purple hover:bg-brand-purple/90"
                  : ""
              }`}
              variant={plan.isPopular ? "default" : "outline"}
            >
              {plan.buttonText}
            </Button>
          )
        ) : (
          <Link to="/login" className="w-full">
            <Button
              className={`w-full ${
                plan.isPopular
                  ? "bg-brand-purple hover:bg-brand-purple/90"
                  : ""
              }`}
              variant={plan.isPopular ? "default" : "outline"}
            >
              Login to Subscribe
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
