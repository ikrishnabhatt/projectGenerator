
import React from "react";
import ExpertRequestForm from "@/components/ExpertRequestForm";

const ExpertRequest = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Create by Experts</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let our experienced team build a custom project tailored to your specific requirements.
          </p>
        </div>
        
        <ExpertRequestForm />
      </div>
    </div>
  );
};

export default ExpertRequest;
