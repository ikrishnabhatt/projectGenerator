
import React from "react";
import { useAuth, User } from "@/contexts/AuthContext";
import ExpertRequestForm from "@/components/ExpertRequestForm";
import SubscriptionPrompt from "@/components/SubscriptionPrompt";

// Add isPro property to user to satisfy the component requirements
interface ExpertRequestProps {}

const ExpertRequest: React.FC<ExpertRequestProps> = () => {
  const { user, isAuthenticated } = useAuth();
  
  // If user is not logged in, show subscription prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Expert Project Request</h1>
          <SubscriptionPrompt 
            open={true}
            onClose={() => {}}
            title="Login Required"
            description="Please login to request custom projects built by our expert team."
            buttonText="Login Now"
            buttonLink="/login"
          />
        </div>
      </div>
    );
  }

  // If user is on free plan, show upgrade prompt
  if (!user.isPro) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Expert Project Request</h1>
          <SubscriptionPrompt
            open={true}
            onClose={() => {}}
            title="Pro Plan Required"
            description="Expert project creation is available for Pro plan subscribers."
            buttonText="Upgrade to Pro"
            buttonLink="/pricing"
          />
        </div>
      </div>
    );
  }

  // If user is on Pro plan, show the request form
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Request Expert Project</h1>
        <p className="text-muted-foreground mb-8">
          Our team of experts will create a custom project based on your requirements
        </p>
        
        <ExpertRequestForm />
      </div>
    </div>
  );
};

export default ExpertRequest;
