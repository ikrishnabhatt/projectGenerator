
import React from "react";
import PricingToggle from "./PricingToggle";

interface PricingHeaderProps {
  interval: "month" | "year";
  setInterval: (interval: "month" | "year") => void;
}

const PricingHeader: React.FC<PricingHeaderProps> = ({ interval, setInterval }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Choose the perfect plan for your needs. Upgrade or downgrade at any time.
      </p>
      <PricingToggle interval={interval} setInterval={setInterval} />
    </div>
  );
};

export default PricingHeader;
