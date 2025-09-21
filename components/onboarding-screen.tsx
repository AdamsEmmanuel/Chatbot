"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChatbotMascot } from "@/components/chatbot-mascot"
import { FloatingElements } from "@/components/floating-elements"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export function OnboardingScreen() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/")
    } else {
      router.push("/register")
    }
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
        <Card className="glassmorphism w-full max-w-md p-8 text-center glow-effect">
          {/* Chatbot mascot */}
          <div className="mb-8 flex justify-center">
            <ChatbotMascot />
          </div>

          {/* Main heading */}
          <h1 className="mb-4 text-3xl font-bold text-glow text-balance md:text-4xl">
            Meet Your Intelligent Chat Companion
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-muted-foreground text-pretty leading-relaxed">
            Get instant answers, engage in friendly conversations, and discover the power of AI assistance tailored just
            for you.
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-4 text-lg glow-effect transition-all duration-300 hover:scale-105"
            >
              {isAuthenticated ? "Continue to Chat" : "Get Started"}
            </Button>

            {!isAuthenticated && (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-primary/30 hover:bg-primary/10 bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-secondary/30 hover:bg-secondary/10 bg-transparent"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Additional info */}
          <p className="mt-6 text-sm text-muted-foreground/70">
            {isAuthenticated ? "Welcome back!" : "No setup required • Start chatting instantly"}
          </p>
        </Card>
      </div>
    </div>
  )
}
