"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { axiosInstance } from "@/axios/axios"; // Adjust the import path as needed

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the context value type
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component props
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data
  const fetchUser = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setError(response.data.message || "Failed to fetch user");
        setUser(null);
      }
    } catch (err: any) {
      // Handle 401 (no token) gracefully - this is expected when user is not logged in
      if (err.response?.status === 401) {
        setUser(null);
        setError(null); // Don't set error for 401, it's expected
        console.log("User not authenticated (no token)");
      } else {
        setError(err.response?.data?.message || "Failed to fetch user");
        setUser(null);
        console.error("Error fetching user:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to logout user
  const logout = (): void => {
    setUser(null);
    setError(null);
    // You might want to call a logout API endpoint here as well
    // await axiosInstance.post('/auth/logout');
  };

  // Function to update user data locally
  const updateUser = (userData: Partial<User>): void => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
  };

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    fetchUser,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

// Optional: Hook to get user data with additional utilities
export const useAuth = () => {
  const { user, loading, error, fetchUser, logout, updateUser } = useUser();

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isLoading: loading,
    hasError: !!error,
    refetchUser: fetchUser,
    signOut: logout,
    updateUserData: updateUser,
  };
};