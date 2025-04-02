import React from "react";
import { Button } from "@/components/ui/button";

interface PricingToggleProps {
  interval: "month" | "year";
  setInterval: (interval: "month" | "year") => void;
}

const PricingToggle: React.FC<PricingToggleProps> = ({ interval, setInterval }) => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="bg-white p-1 rounded-full flex">
        <Button
          variant={interval === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => setInterval("month")}
          className={interval === "month" ? "bg-teal-600 hover:bg-teal-500" : ""}
        >
          Monthly
        </Button>
        <Button
          variant={interval === "year" ? "default" : "ghost"}
          size="sm"
          onClick={() => setInterval("year")}
          className={interval === "year" ? "bg-teal-600 hover:bg-teal-500" : ""}
        >
          Yearly
          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PricingToggle;
