
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CustomPlanSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-16 bg-gray-100 rounded-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          We offer custom plans for enterprise clients with specific needs.
          Contact our sales team to get a tailored quote.
        </p>
        <Button variant="outline" size="lg" onClick={() => navigate("/create-by-experts")}>
          Contact Sales
        </Button>
      </div>
    </div>
  );
};

export default CustomPlanSection;
