"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { FloatingElements } from "@/components/floating-elements"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with neon gradient */}
      <div className="absolute inset-0 neon-gradient opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

      {/* Floating background elements */}
      <FloatingElements />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="glassmorphism w-full max-w-md p-8 glow-effect">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-glow mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your AI companion</p>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-input/50 border-border/30 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-input/50 border-border/30 focus:border-primary/50"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 glow-effect transition-all duration-300 hover:scale-105"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
