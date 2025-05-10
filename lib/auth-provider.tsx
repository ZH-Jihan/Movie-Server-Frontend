"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login

    // Simulate admin login with specific credentials
    const isAdmin = email === "admin@example.com" && password === "admin123"

    const user: User = {
      id: "user123",
      name: email.split("@")[0],
      email,
      image: null,
      isAdmin,
    }

    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const signUp = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call to register
    // For demo purposes, we'll simulate a successful registration

    // We don't set the user here as they should log in after registration
    return Promise.resolve()
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isAdmin: user?.isAdmin || false }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
