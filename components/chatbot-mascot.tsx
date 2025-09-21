"use client"

export function ChatbotMascot() {
  return (
    <div className="relative float-animation">
      {/* Main bot body */}
      <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 glow-effect">
        <div className="h-full w-full rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
          {/* Bot face */}
          <div className="relative">
            {/* Eyes */}
            <div className="flex space-x-3 mb-2">
              <div className="h-3 w-3 rounded-full bg-white pulse-glow" />
              <div className="h-3 w-3 rounded-full bg-white pulse-glow" />
            </div>

            {/* Mouth */}
            <div className="h-2 w-6 rounded-full bg-white/60 mx-auto" />
          </div>
        </div>
      </div>

      {/* Floating particles around the mascot */}
      <div className="absolute -top-2 -right-2 h-2 w-2 rounded-full bg-secondary animate-ping" />
      <div className="absolute -bottom-1 -left-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
      <div className="absolute top-1/2 -right-4 h-1 w-1 rounded-full bg-accent animate-bounce" />
    </div>
  )
}
