
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type SubscriptionPromptProps = {
  open: boolean;
  onClose: () => void;
};

const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            You've used all your free generations. Upgrade to a premium plan to continue creating amazing projects.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-2">Pro Plan Benefits</h3>
            <ul className="text-sm text-amber-700 space-y-1">
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
          <Button variant="outline" onClick={onClose}>Maybe Later</Button>
          <Link to="/pricing" className="w-full sm:w-auto">
            <Button className="w-full bg-brand-purple hover:bg-brand-purple/90">View Plans</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPrompt;
