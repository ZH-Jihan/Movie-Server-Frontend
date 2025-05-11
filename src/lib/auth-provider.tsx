"use client";

import type { AuthContextType } from "@/interfaces/auth-context";
import type { User } from "@/interfaces/user";
import { login, logout, register } from "@/services/auth";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
      setIsHydrated(true);
    }
    fetchUser();
  }, []);

  if (!isHydrated) {
    return null;
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await login({ email, password });
      // After login, fetch user info and update context
      if (result) {
        const data = await fetch("/api/auth/me").then((res) => res.json());
        setUser(data.user);
        return result
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Use the register function from services/auth
    const data = { name, email, password };
    try {
      const res = await register(data);
      return res;
      // Optionally, handle post-registration logic
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      // Optionally handle error
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signUp, signOut, isAdmin: user?.isAdmin || false }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
