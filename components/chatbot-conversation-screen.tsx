"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Mic, Heart, Copy, Bookmark, ArrowLeft } from "lucide-react"
import { FloatingElements } from "@/components/floating-elements"
import { useAuth } from "@/components/auth-provider"
import { apiClient, type ChatMessage, type ChatSession } from "@/lib/api-client"
import Link from "next/link"

export function ChatbotConversationScreen() {
  const { user, isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadChatData = async () => {
      if (!isAuthenticated) return

      setIsLoading(true)

      try {
        let session: ChatSession | null = null

        if (sessionId) {
          // Load existing session messages
          const messagesResponse = await apiClient.getChatMessages(sessionId)
          if (messagesResponse.success && messagesResponse.data) {
            setMessages(messagesResponse.data)
          }

          // Get session info from chat history
          const historyResponse = await apiClient.getChatHistory()
          if (historyResponse.success && historyResponse.data) {
            session = historyResponse.data.find((s) => s.id === sessionId) || null
            setCurrentSession(session)
          }
        } else {
          // Create new session
          const sessionResponse = await apiClient.createChatSession("New Chat")
          if (sessionResponse.success && sessionResponse.data) {
            session = sessionResponse.data
            setCurrentSession(session)

            // Add welcome message
            const welcomeMessage: ChatMessage = {
              id: "welcome",
              session_id: session.id,
              content: "Hello! I'm your AI companion. How can I help you today?",
              sender: "bot",
              timestamp: new Date().toISOString(),
            }
            setMessages([welcomeMessage])
          }
        }
      } catch (error) {
        console.error("Failed to load chat data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChatData()
  }, [sessionId, isAuthenticated])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession || isSending) return

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: currentSession.id,
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsSending(true)

    try {
      const response = await apiClient.sendMessage(currentSession.id, inputValue)

      if (response.success && response.data) {
        // Replace temp message with real message and add bot response
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== userMessage.id)
          return [...filtered, response.data]
        })
      } else {
        // Handle error - show error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          session_id: currentSession.id,
          content: "Sorry, I'm having trouble responding right now. Please try again.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        session_id: currentSession.id,
        content: "Network error. Please check your connection and try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input logic would go here
  }

  const handleReaction = async (messageId: string, reaction: string) => {
    if (reaction === "copy") {
      const message = messages.find((m) => m.id === messageId)
      if (message) {
        await navigator.clipboard.writeText(message.content)
        // Could show a toast notification here
      }
    } else if (reaction === "like") {
      // Could implement like functionality with API
      console.log(`Liked message ${messageId}`)
    } else if (reaction === "save") {
      // Could implement save functionality with API
      console.log(`Saved message ${messageId}`)
    }
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute inset-0 bg-gradient-to-tl from-background/90 via-background/95 to-background" />

      {/* Floating background elements */}
      <FloatingElements />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 glassmorphism">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Avatar className="h-10 w-10 ring-2 ring-primary/30 glow-effect">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                AI
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-glow">{currentSession?.title || "AI Companion"}</h1>
              <p className="text-xs text-muted-foreground">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 ring-1 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`group relative max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                  {/* Message bubble */}
                  <div
                    className={`p-4 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground ml-auto"
                        : "glassmorphism glow-effect text-card-foreground"
                    } transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">{formatTime(message.timestamp)}</p>
                  </div>

                  {/* Reaction icons for bot messages */}
                  {message.sender === "bot" && (
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleReaction(message.id, "like")}
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary"
                        onClick={() => handleReaction(message.id, "copy")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent"
                        onClick={() => handleReaction(message.id, "save")}
                      >
                        <Bookmark className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 ring-1 ring-secondary/20">
                    <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-secondary/20 to-primary/20 text-secondary text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <Avatar className="h-8 w-8 ring-1 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 glassmorphism p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t border-border/50 glassmorphism">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isSending}
                className="pr-12 bg-input/50 border-border/30 focus:border-primary/50 focus:ring-primary/20 rounded-2xl h-12 text-foreground placeholder:text-muted-foreground/60"
              />

              {/* Voice input button */}
              <Button
                variant="ghost"
                size="sm"
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full transition-all duration-300 ${
                  isListening
                    ? "bg-secondary/20 text-secondary glow-effect"
                    : "hover:bg-muted/20 text-muted-foreground hover:text-foreground"
                }`}
                onClick={toggleVoiceInput}
              >
                <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
              </Button>
            </div>

            {/* Send button */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              className="h-12 w-12 p-0 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:from-muted disabled:to-muted glow-effect transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
