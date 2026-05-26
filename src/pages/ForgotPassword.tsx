
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="relative bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-200">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="h-10 w-10 bg-kargon-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-6 mt-4 text-kargon-dark">Forgot Password</h2>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                <p>Password reset instructions have been sent to your email.</p>
              </div>
              <p>Please check your inbox and follow the instructions to reset your password.</p>
              <Link to="/login">
                <Button variant="link" className="text-kargon-red">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-600 mb-4">
                Enter your email address below and we'll send you instructions to reset your password.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-kargon-red hover:bg-kargon-red/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "SUBMITTING..." : "Reset Password"}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Remembered your password?{" "}
                  <Link to="/login" className="text-kargon-red hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
