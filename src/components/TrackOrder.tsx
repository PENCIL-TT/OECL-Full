import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const {
    toast
  } = useToast();
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would connect to your tracking API
    toast({
      title: "Tracking Request Received",
      description: `We're tracking your order: ${trackingNumber}`
    });
  };
  return <section className="relative z-30 -mt-16 mb-16">
      
    </section>;
};
export default TrackOrder;