"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/usercontext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, LogOut, Menu, Settings, User, Loader2 } from "lucide-react";
import { axiosInstance } from "@/axios/axios";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [userLoading, setUserLoading] = useState(true);

  const getUser = async () => {
    try {
      setUserLoading(true);
      const res = await axiosInstance.get("/auth/me");
      if (res.data.success && res.data.user) {
        setUser(res.data.user.name);
        setEmail(res.data.user.email);
        console.log("User data fetched successfully:", res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser("");
      setEmail("");
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Redirecting to logout...");
      const response = await axiosInstance.post("/auth/logout");

      if (response.data.success) {
        console.log("Logout successful:", response.data.message);
        console.log("Redirecting to login page...");

        // You might want to redirect to login page or clear local state
        // For example:
        // router.push("/login");
        // or trigger a context method to clear user state

        // Reload the page to clear any cached state
        window.location.href = "/login"; // or wherever you want to redirect
      }
    } catch (error) {
      console.error("Logout error:", error);
      console.log("Logout failed, redirecting anyway...");
      // Even if logout fails on backend, redirect to clear frontend state
      window.location.href = "/login";
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "U";
  };

  const getFirstName = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
      return name.split(" ")[0];
    }
    return email ? email.split("@")[0] : "User";
  };

  // Show loading state while checking authentication or fetching user data
  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex items-center mb-8">
                    <div className="bg-primary rounded-lg p-2 mr-3">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold">Study Reminder</span>
                  </div>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="flex items-center">
                <div className="bg-primary rounded-lg p-2 mr-3">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Study Reminder
                </span>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {/* User Greeting */}
              <div className="hidden sm:block">
                <span className="text-gray-700 font-medium">
                  Hi {getFirstName(user, email)}!
                </span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(user, email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {email || "No email"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
