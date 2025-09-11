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
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refetchUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
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
  const [loading, setLoading] = useState(true); // Start as true for initial auth check
  const [error, setError] = useState<string | null>(null);
  const [previousEmail, setPreviousEmail] = useState<string | null>(null);
  const router = useRouter();

  // Check auth on mount - initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Watch for email changes and refetch user data
  useEffect(() => {
    if (user && user.email !== previousEmail && previousEmail !== null) {
      console.log("Email changed detected, refetching user data");
      checkAuth();
    }
  }, [user?.email, previousEmail]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching user data from /auth/me");

      // Use your /auth/me endpoint
      const response = await axiosInstance.get("/auth/me");

      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setPreviousEmail(userData.email);
        console.log("User data fetched successfully:", userData);
      } else {
        setUser(null);
        setPreviousEmail(null);
        setError(response.data.message || "Failed to fetch user");
        console.log("No user data received or unsuccessful response");
      }
    } catch (error: any) {
      // If profile check fails, user is not authenticated
      setUser(null);
      setPreviousEmail(null);

      // Only set error if it's not a 401 (unauthorized) - that's normal for logged out users
      if (error.response?.status !== 401) {
        setError(
          error.response?.data?.message || "Authentication check failed"
        );
      }

      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to refetch user data
  const refetchUser = async () => {
    await checkAuth();
  };

  // Function to update user data locally
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // If email changed, update previousEmail to trigger refetch
      if (userData.email && userData.email !== previousEmail) {
        console.log("Email changed via updateUser, will trigger refetch");
        setPreviousEmail(userData.email);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        // After successful login, fetch user data from /auth/me
        await checkAuth();
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
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully!");
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
      toast.error(
        "Logout failed on server, but you have been logged out locally."
      );
    } finally {
      setUser(null);
      setPreviousEmail(null);
      setError(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        setUser,
        refetchUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
