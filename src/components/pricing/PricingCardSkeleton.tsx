
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const PricingCardSkeleton: React.FC = () => {
  return (
    <Card className="relative animate-pulse">
      <CardHeader className="pb-8">
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-full"></div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Array(4)
          .fill(0)
          .map((_, j) => (
            <div key={j} className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </CardFooter>
    </Card>
  );
};

export default PricingCardSkeleton;
