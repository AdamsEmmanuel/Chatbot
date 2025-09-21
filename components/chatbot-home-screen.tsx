"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Mic, TrendingUp, Heart, Briefcase, Cpu, Clock, Settings } from "lucide-react"
import { FloatingElements } from "@/components/floating-elements"
import { useAuth } from "@/components/auth-provider"
import { apiClient, type ChatSession } from "@/lib/api-client"
import Link from "next/link"

export function ChatbotHomeScreen() {
  const { user, isAuthenticated } = useAuth()
  const [recentChats, setRecentChats] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const topics = [
    { name: "Finance", icon: TrendingUp, color: "from-green-400 to-emerald-600" },
    { name: "Health", icon: Heart, color: "from-red-400 to-pink-600" },
    { name: "Business", icon: Briefcase, color: "from-blue-400 to-indigo-600" },
    { name: "Tech", icon: Cpu, color: "from-purple-400 to-violet-600" },
  ]

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        const response = await apiClient.getChatHistory()
        if (response.success && response.data) {
          setRecentChats(response.data.slice(0, 4)) // Show last 4 chats
        }
      } catch (error) {
        console.error("Failed to load chat history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChatHistory()
  }, [isAuthenticated])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "Yesterday"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const getUserInitials = () => {
    if (!user) return "U"
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return user.username.slice(0, 2).toUpperCase()
  }

  const getDisplayName = () => {
    if (!user) return "Guest"
    return user.full_name || user.username
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 neon-gradient opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <FloatingElements />

        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <Card className="glassmorphism w-full max-w-md p-8 text-center glow-effect">
            <h1 className="text-2xl font-bold text-glow mb-4">Welcome to AI Companion</h1>
            <p className="text-muted-foreground mb-6">Please sign in to continue</p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 bg-transparent">
                  Create Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with neon gradient */}
      <div className="absolute inset-0 neon-gradient opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

      {/* Floating background elements */}
      <FloatingElements />

      {/* Main content */}
      <div className="relative z-10 min-h-screen p-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/50 glow-effect">
              <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-glow">Welcome back, {getDisplayName()}!</h1>
              <p className="text-sm text-muted-foreground">
                {user?.is_premium ? "Premium Member" : "Ready to chat with your AI companion?"}
              </p>
            </div>
          </div>
          <Link href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 glow-effect transition-all duration-300 hover:scale-105"
            >
              <Settings className="h-5 w-5 text-primary" />
            </Button>
          </Link>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <Link href="/chat">
            <Button
              size="lg"
              className="h-20 w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold glow-effect transition-all duration-300 hover:scale-105 glassmorphism"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              <div className="text-left">
                <div className="text-lg">Chat with Bot</div>
                <div className="text-sm opacity-80">Start a text conversation</div>
              </div>
            </Button>
          </Link>

          <Link href="/voice">
            <Button
              size="lg"
              className="h-20 w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground font-semibold glow-effect transition-all duration-300 hover:scale-105 glassmorphism"
            >
              <Mic className="mr-3 h-6 w-6" />
              <div className="text-left">
                <div className="text-lg">Talk with Bot</div>
                <div className="text-sm opacity-80">Voice conversation mode</div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Topics Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-center text-glow">Popular Topics</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 justify-center">
            {topics.map((topic) => {
              const IconComponent = topic.icon
              return (
                <Card
                  key={topic.name}
                  className="flex-shrink-0 glassmorphism hover:bg-card/20 transition-all duration-300 hover:scale-105 cursor-pointer p-4 min-w-[120px] text-center glow-effect"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${topic.color} mb-2 mx-auto`}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-card-foreground">{topic.name}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* History Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-glow">Recent Conversations</h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="glassmorphism p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-primary/20 rounded w-3/4" />
                      <div className="h-3 bg-primary/10 rounded w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : recentChats.length > 0 ? (
            <div className="space-y-3">
              {recentChats.map((chat) => (
                <Link key={chat.id} href={`/chat?session=${chat.id}`}>
                  <Card className="glassmorphism hover:bg-card/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-card-foreground truncate">{chat.title}</h3>
                        <p className="text-sm text-muted-foreground/80 truncate">
                          {chat.last_message_preview || `${chat.message_count} messages`}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{formatTime(chat.updated_at)}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="glassmorphism p-6 text-center">
              <p className="text-muted-foreground mb-4">No conversations yet</p>
              <Link href="/chat">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                  Start Your First Chat
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Quick Access Footer */}
        <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:mt-8">
          <Card className="glassmorphism p-4 text-center max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-2">Need help getting started?</p>
            <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 bg-transparent">
              View Tutorial
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
