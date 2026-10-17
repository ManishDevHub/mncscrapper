import React, { createContext, useContext, useState, useEffect } from "react";
import api, { type User } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (currentToken: string) => {
    try {
      const res = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("careerhub_user", JSON.stringify(res.data.user));
      }
    } catch (e) {
      // If token expired or invalid, keep stored or clean up gracefully
    }
  };

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("careerhub_token");
      const storedUser = localStorage.getItem("careerhub_user");

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            // ignore
          }
        }
        fetchProfile(storedToken);
      }
    } catch (e) {
      console.error("Failed to parse stored auth", e);
      localStorage.removeItem("careerhub_token");
      localStorage.removeItem("careerhub_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("careerhub_token", newToken);
    localStorage.setItem("careerhub_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("careerhub_token");
    localStorage.removeItem("careerhub_user");
  };

  const refreshUser = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
