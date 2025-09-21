"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { apiClient, type User } from "@/lib/api-client"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, username: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const currentUser = apiClient.getCurrentUser()
      if (currentUser && apiClient.isAuthenticated()) {
        // Verify token is still valid by fetching profile
        const response = await apiClient.getProfile()
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          // Token invalid, clear stored data
          await apiClient.logout()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    const response = await apiClient.login(email, password)

    if (response.success && response.data) {
      setUser(response.data.user)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true)
    const response = await apiClient.register(email, password, username)

    if (response.success && response.data) {
      setUser(response.data.user)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    await apiClient.logout()
    setUser(null)
    setIsLoading(false)
  }

  const refreshUser = async (): Promise<void> => {
    if (!apiClient.isAuthenticated()) return

    const response = await apiClient.getProfile()
    if (response.success && response.data) {
      setUser(response.data)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
