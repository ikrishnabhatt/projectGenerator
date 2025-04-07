
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type SubscriptionPromptProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({ 
  open, 
  onClose,
  title = "Upgrade Your Plan",
  description = "You've used all your free generations. Upgrade to a premium plan to continue creating amazing projects.",
  buttonText = "View Plans",
  buttonLink = "/pricing"
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#F6F8D5] border-t-4 border-[#5A9C99] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-[#5A9C99]">{title}</DialogTitle>
          <DialogDescription className="text-[#A1A55C]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="bg-[#d0f1ee] p-4 rounded-md border border-[#5A9C99]">
            <h3 className="font-medium text-[#5A9C99] mb-2">Pro Plan Benefits</h3>
            <ul className="text-sm text-[#A1A55C] space-y-1">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Unlimited project generations</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Access to all templates</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Advanced AI features</span>
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button variant="outline" className="border-[#A1A55C] text-[#A1A55C] hover:border-[#5A9C99] hover:text-[#5A9C99]" onClick={onClose}>Maybe Later</Button>
          <Link to={buttonLink} className="w-full sm:w-auto">
            <Button className="w-full bg-[#5A9C99] hover:bg-[#5A9C99]/90 text-white">{buttonText}</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPrompt;
