
import React from "react";
import { Check } from "lucide-react";

interface PlanFeatureListProps {
  features: string[];
}

const PlanFeatureList: React.FC<PlanFeatureListProps> = ({ features }) => {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default PlanFeatureList;
