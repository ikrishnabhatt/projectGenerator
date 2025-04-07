
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, CreditCard, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define subscription plans
const subscriptionPlans = {
  "pro": {
    name: "Pro Plan",
    price: 1499,
    interval: "month"
  },
  "business": {
    name: "Business Plan",
    price: 3999,
    interval: "month"
  }
};

// Define credit packages
const creditPackages = [
  {
    id: "credits-10",
    name: "10 Credits",
    price: 299,
    credits: 10
  },
  {
    id: "credits-25",
    name: "25 Credits",
    price: 699,
    credits: 25
  },
  {
    id: "credits-50",
    name: "50 Credits",
    price: 1299,
    credits: 50
  }
];

const PaymentCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");
  const creditPackage = searchParams.get("credits");
  const navigate = useNavigate();
  const { user, isAuthenticated, upgradeToPro, updateCredits } = useAuth();
  
  // Default to subscription tab if plan is specified, or credits tab if credits package is specified
  const defaultTab = planId ? "subscription" : "credits";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Payment state
  const [selectedPlan, setSelectedPlan] = useState<string | null>(planId);
  const [selectedCredits, setSelectedCredits] = useState<string | null>(creditPackage || "credits-10");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Credit card details
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  
  // UPI details
  const [upiId, setUpiId] = useState("");
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to continue with payment");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Handle expiry date input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setCardExpiry(formattedValue);
  };
  
  // Get selected plan details
  const getSelectedPlan = () => {
    if (!selectedPlan) return null;
    return subscriptionPlans[selectedPlan as keyof typeof subscriptionPlans];
  };
  
  // Get selected credits package
  const getSelectedCreditsPackage = () => {
    return creditPackages.find(pkg => pkg.id === selectedCredits);
  };
  
  // Get current selected item (plan or credits)
  const getCurrentSelection = () => {
    if (activeTab === "subscription") {
      return getSelectedPlan();
    } else {
      return getSelectedCreditsPackage();
    }
  };
  
  // Process payment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (paymentMethod === "card") {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
        toast.error("Please fill in all card details");
        return;
      }
      
      if (cardNumber.replace(/\s/g, "").length < 16) {
        toast.error("Please enter a valid card number");
        return;
      }
      
      if (cardCvc.length < 3) {
        toast.error("Please enter a valid CVC code");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId || !upiId.includes("@")) {
        toast.error("Please enter a valid UPI ID");
        return;
      }
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (activeTab === "subscription") {
        // Upgrade user to pro
        upgradeToPro();
      } else {
        // Add credits to user account
        const creditsToAdd = getSelectedCreditsPackage()?.credits || 0;
        updateCredits((user?.credits || 0) + creditsToAdd);
      }
      
      setIsCompleted(true);
      toast.success(`Payment successful! ${activeTab === "subscription" ? "Your account has been upgraded." : "Credits have been added to your account."}`);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // If payment is completed, show success message
  if (isCompleted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Payment Successful</CardTitle>
            <CardDescription>
              {activeTab === "subscription" 
                ? "Your subscription has been activated." 
                : "Credits have been added to your account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              {activeTab === "subscription" 
                ? "You now have access to all Pro features." 
                : `Your new balance: ${user?.credits || 0} credits`}
            </p>
            <Button className="w-full" onClick={() => navigate("/")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Main checkout UI
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Payment form */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Complete your purchase securely</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 grid grid-cols-2">
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  <TabsTrigger value="credits">Buy Credits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="subscription">
                  <div className="mb-6">
                    <Label className="mb-3 block">Select a subscription plan</Label>
                    <RadioGroup 
                      value={selectedPlan || ""} 
                      onValueChange={setSelectedPlan}
                      className="gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pro" id="plan-pro" />
                        <Label htmlFor="plan-pro" className="flex-1 cursor-pointer">
                          <div className="p-3 border rounded-md hover:border-primary flex justify-between">
                            <span>Pro Plan</span>
                            <span className="font-bold flex items-center">
                              <IndianRupee className="h-4 w-4" /> 1,499/mo
                            </span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="plan-business" />
                        <Label htmlFor="plan-business" className="flex-1 cursor-pointer">
                          <div className="p-3 border rounded-md hover:border-primary flex justify-between">
                            <span>Business Plan</span>
                            <span className="font-bold flex items-center">
                              <IndianRupee className="h-4 w-4" /> 3,999/mo
                            </span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>
                
                <TabsContent value="credits">
                  <div className="mb-6">
                    <Label className="mb-3 block">Select a credit package</Label>
                    <RadioGroup 
                      value={selectedCredits || ""} 
                      onValueChange={setSelectedCredits}
                      className="gap-4"
                    >
                      {creditPackages.map((pkg) => (
                        <div key={pkg.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={pkg.id} id={pkg.id} />
                          <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                            <div className="p-3 border rounded-md hover:border-primary flex justify-between">
                              <div>
                                <span className="block font-medium">{pkg.name}</span>
                                <span className="text-sm text-muted-foreground">Best value for small projects</span>
                              </div>
                              <span className="font-bold flex items-center">
                                <IndianRupee className="h-4 w-4" /> {pkg.price}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mb-6 mt-8">
                <Label className="mb-3 block">Choose a payment method</Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-3 gap-3"
                >
                  <div>
                    <RadioGroupItem value="card" id="method-card" className="sr-only" />
                    <Label htmlFor="method-card">
                      <div className={`
                        p-4 border rounded-md flex flex-col items-center justify-center text-center h-24 cursor-pointer
                        ${paymentMethod === "card" ? "border-2 border-primary bg-primary/5" : "hover:bg-muted/50"}
                      `}>
                        <CreditCard className="mb-1 h-6 w-6" />
                        <span className="text-sm font-medium">Credit / Debit Card</span>
                      </div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="upi" id="method-upi" className="sr-only" />
                    <Label htmlFor="method-upi">
                      <div className={`
                        p-4 border rounded-md flex flex-col items-center justify-center text-center h-24 cursor-pointer
                        ${paymentMethod === "upi" ? "border-2 border-primary bg-primary/5" : "hover:bg-muted/50"}
                      `}>
                        <svg className="mb-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,0C5.373,0,0,5.373,0,12s5.373,12,12,12s12-5.373,12-12S18.627,0,12,0z M8.728,13.683 c-0.112,0.316-0.411,0.526-0.744,0.526c-0.091,0-0.184-0.016-0.274-0.049l-2.17-0.772c-0.414-0.147-0.63-0.602-0.483-1.016 c0.147-0.414,0.602-0.631,1.016-0.483l2.17,0.772C8.659,12.814,8.876,13.269,8.728,13.683z M12,9c-0.441,0-0.849,0.118-1.202,0.323 L9.3,6.475C8.962,5.8,8.010,5.5,7.335,5.838c-0.675,0.337-0.951,1.164-0.614,1.839l2.129,4.259 c-0.053,0.207-0.08,0.422-0.08,0.644c0,1.381,1.119,2.5,2.5,2.5s2.5-1.119,2.5-2.5S13.381,9,12,9z M18.726,14.446l-2.509,0.893 c-0.671,0.239-1.407-0.112-1.645-0.784c-0.239-0.671,0.112-1.407,0.784-1.645l2.509-0.893c0.671-0.239,1.407,0.112,1.645,0.784 C19.749,13.472,19.398,14.208,18.726,14.446z"/>
                        </svg>
                        <span className="text-sm font-medium">UPI</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                {paymentMethod === "card" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input 
                        id="card-name" 
                        placeholder="Name as on card" 
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input 
                        id="card-number" 
                        placeholder="1234 5678 9012 3456" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Expiry Date</Label>
                        <Input 
                          id="card-expiry" 
                          placeholder="MM/YY" 
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="card-cvc">CVC</Label>
                        <Input 
                          id="card-cvc" 
                          placeholder="123" 
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input 
                      id="upi-id" 
                      placeholder="yourname@upi" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                )}
                
                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Pay ₹${getCurrentSelection()?.price || 0}`}
                  </Button>
                  
                  <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 mr-1" />
                    Secured by 256-bit encryption
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">
                    {activeTab === "subscription" 
                      ? getSelectedPlan()?.name || "No plan selected"
                      : getSelectedCreditsPackage()?.name || "No credits selected"
                    }
                  </span>
                </div>
                
                {activeTab === "subscription" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                )}
                
                {activeTab === "credits" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-medium">{getSelectedCreditsPackage()?.credits || 0}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {getCurrentSelection()?.price || 0}
                  </span>
                </div>
              </div>
              
              {activeTab === "subscription" && (
                <div className="bg-muted/50 p-3 rounded-md text-sm mt-4">
                  <p>Your subscription will renew automatically each month until cancelled.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="block">
              {user && !user.isPro && (
                <div className="text-xs text-muted-foreground mb-6">
                  <p className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    You are currently on the Free plan
                  </p>
                </div>
              )}
              
              <Button
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate(-1)}
              >
                Return to previous page
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
