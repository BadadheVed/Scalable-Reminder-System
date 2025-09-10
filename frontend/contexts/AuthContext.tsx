"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/axios/axios"; // Using your axiosInstance
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to get user profile - you'll need to implement this endpoint
      // or check if there's a valid token cookie
      const response = await axiosInstance.get("/api/user/profile");

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // If profile check fails, user is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const userData: User = {
          id: response.data.user?.id || "", // Adjust based on your backend response
          email: email,
          name: response.data.name,
          token: response.data.token,
        };

        setUser(userData);
        toast.success("Login successful!");

        // Redirect after successful login
        router.push("/dashboard");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      throw error; // Re-throw to let the component handle it
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/signup", {
        email,
        password,
        name,
      });

      if (response.data.success) {
        // Note: Your backend doesn't return a token for signup
        // So we just show success and redirect to login
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Account creation failed. Please try again.";
      toast.error(errorMessage);
      throw error; // Re-throw to let the component handle it
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post("/api/auth/logout");
      toast.success("Logged out successfully!");
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
      toast.error(
        "Logout failed on server, but you have been logged out locally."
      );
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
