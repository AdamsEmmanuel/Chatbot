"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, X, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export function VoiceInteractionScreen() {
  const [isListening, setIsListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    } else {
      setAudioLevel(0)
    }
  }, [isListening])

  const toggleListening = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (isListening) {
      setIsListening(false)
      setIsProcessing(true)

      // Simulate processing voice input
      setTimeout(() => {
        setTranscript("Voice input processed successfully!")
        setIsProcessing(false)
      }, 2000)
    } else {
      setIsListening(true)
      setTranscript("")

      // Here you would implement real speech recognition
      // Example: Web Speech API or external service integration
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        // Web Speech API implementation would go here
        console.log("Starting speech recognition...")
      } else {
        console.log("Speech recognition not supported")
      }
    }
  }

  const handleCancel = () => {
    setIsListening(false)
    setTranscript("")
    router.back()
  }

  const handleSave = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)

    try {
      // Navigate to chat with the voice transcript
      router.push(`/chat?message=${encodeURIComponent(transcript)}`)
    } catch (error) {
      console.error("Failed to save voice input:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-pulse" />

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-chart-3/30 rounded-full blur-xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-glow">
            {isListening ? "I'm listening..." : isProcessing ? "Processing..." : "Go ahead, I'm listening…"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isListening
              ? "Speak naturally, I'll understand"
              : isProcessing
                ? "Converting speech to text..."
                : "Tap the microphone to start"}
          </p>

          {transcript && (
            <div className="mt-4 p-4 bg-card/50 rounded-lg border border-border/30 max-w-md mx-auto">
              <p className="text-sm text-card-foreground">{transcript}</p>
            </div>
          )}
        </div>

        <div className="relative mb-16">
          <div className="flex items-center justify-center space-x-2 h-32">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-primary via-secondary to-accent rounded-full transition-all duration-100"
                style={{
                  width: "4px",
                  height: isListening ? `${20 + audioLevel * Math.sin(i * 0.5) * 0.8}px` : "8px",
                  opacity: isListening ? 0.8 + Math.sin(i * 0.3) * 0.2 : 0.3,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>

          {(isListening || isProcessing) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
          )}
        </div>

        <div className="relative mb-16">
          <Button
            onClick={toggleListening}
            size="lg"
            disabled={isProcessing}
            className={`
              w-20 h-20 rounded-full transition-all duration-300 border-2
              ${
                isListening
                  ? "bg-destructive hover:bg-destructive/90 border-destructive glow-effect"
                  : isProcessing
                    ? "bg-muted border-muted cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 border-primary/50 hover:border-primary"
              }
            `}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : isListening ? (
              <MicOff className="w-8 h-8 text-destructive-foreground" />
            ) : (
              <Mic className="w-8 h-8 text-primary-foreground" />
            )}
          </Button>

          {isListening && <div className="absolute inset-0 rounded-full border-2 border-destructive/50 animate-ping" />}
        </div>

        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleCancel}
            className="glassmorphism hover:bg-white/10 text-foreground border border-border/50"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleSave}
            className="glassmorphism hover:bg-white/10 text-foreground border border-border/50"
            disabled={!transcript || isProcessing}
          >
            <Save className="w-5 h-5 mr-2" />
            {isProcessing ? "Processing..." : "Send to Chat"}
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/40 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 800}ms`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>
    </div>
  )
}
