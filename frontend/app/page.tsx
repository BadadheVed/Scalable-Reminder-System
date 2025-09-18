"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, LogIn } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  // useEffect(() => {
  //   if (!loading) {
  //     if (user) {
  //       router.push("/dashboard");
  //     } else {
  //       router.push("/login");
  //     }
  //   }
  // }, [user, loading, router]);

  // Show the login button after 5 seconds to account for cold start
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto px-6">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground mb-4">Loading...</p>

          {/* Cold start notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Notice:</strong> OnRender.com cold start may cause delays
              during initial loading. Please wait a moment while the server
              wakes up.
            </p>
          </div>

          {/* Login button appears after 5 seconds */}
          {showButton && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">
                Taking longer than expected?
              </p>
              <button
                onClick={handleLoginClick}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
