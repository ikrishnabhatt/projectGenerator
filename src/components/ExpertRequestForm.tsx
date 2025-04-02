import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Clock, Mail, UserCog } from "lucide-react";

type ExpertRequestStatus = 'not_submitted' | 'sent' | 'received' | 'working' | 'completed';

const ExpertRequestForm = () => {
  const { isAuthenticated, user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [requirements, setRequirements] = useState('');
  const [requestStatus, setRequestStatus] = useState<ExpertRequestStatus>('not_submitted');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !projectType || !budget || !requirements) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRequestStatus('sent');
      toast.success("Request submitted successfully!");
      
      setTimeout(() => {
        setRequestStatus('received');
        toast.success("Your request has been received by our team!");
      }, 5000);
      
      setTimeout(() => {
        setRequestStatus('working');
        toast.success("Our experts are now working on your project!");
      }, 10000);
      
      setTimeout(() => {
        setRequestStatus('completed');
        toast.success("Your project has been completed and emailed to you!");
      }, 15000);
      
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 bg-[#d0f1ee]">
      <Card className="border-t-4 border-[#5A9C99] rounded-xl bg-[#F6F8D5]">
        <CardHeader>
          <CardTitle className="text-[#5A9C99]">Request a Custom Project from Our Experts</CardTitle>
          <CardDescription className="text-[#A1A55C]">
            Fill in the details below and our expert team will create a custom project tailored to your needs
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {requestStatus === 'not_submitted' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type</Label>
                  <Input 
                    id="project-type" 
                    value={projectType} 
                    onChange={(e) => setProjectType(e.target.value)}
                    placeholder="E.g., E-commerce, Blog, Dashboard"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (INR)</Label>
                  <Input 
                    id="budget" 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Enter your budget in INR"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Project Requirements</Label>
                <Textarea 
                  id="requirements" 
                  value={requirements} 
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your project requirements in detail..."
                  className="min-h-32"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#5A9C99] hover:bg-[#5A9C99]/90 text-white">
                Submit Request
              </Button>
            </form>
          ) : (
            <div className="py-4">
              <h3 className="text-xl font-semibold mb-6 text-center text-[#5A9C99]">Request Status</h3>
              <p className="text-center text-[#A1A55C]">Your request is being processed step by step.</p>
            </div>
          )}
        </CardContent>
        
        {requestStatus !== 'not_submitted' && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" className="border-[#A1A55C] text-[#A1A55C] hover:border-[#5A9C99] hover:text-[#5A9C99]" onClick={() => setRequestStatus('not_submitted')}>
              Submit Another Request
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ExpertRequestForm;
