
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { backgroundImages } from "@/assets/template-thumbnails";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500" />
          <div 
            className="absolute inset-0 bg-center bg-cover" 
            style={{ backgroundImage: `url(${backgroundImages.login})` }}
          />
        </div>
        
        <Card className="w-full max-w-md relative z-10 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {sent ? "Check Your Email" : "Reset Your Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {sent 
                ? "We've sent you instructions to reset your password" 
                : "Enter your email and we'll send you instructions to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-purple hover:bg-brand-purple/90"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4 text-sm text-gray-600">
                  If an account exists with the email <span className="font-semibold">{email}</span>,
                  you will receive password reset instructions shortly.
                </p>
                <p className="text-sm text-gray-600">
                  Please check your email and follow the instructions to reset your password.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-brand-purple hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
