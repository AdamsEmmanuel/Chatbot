"use client"

export function FloatingElements() {
  return (
    <>
      {/* Floating geometric shapes */}
      <div
        className="absolute top-20 left-10 h-4 w-4 rounded-full bg-primary/30 animate-bounce"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-40 right-16 h-6 w-6 rounded-full bg-secondary/20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-32 left-20 h-3 w-3 rounded-full bg-accent/40 animate-ping"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 right-10 h-5 w-5 rounded-full bg-primary/25 float-animation"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute top-1/3 left-1/4 h-2 w-2 rounded-full bg-secondary/30 animate-bounce"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute top-2/3 right-1/3 h-4 w-4 rounded-full bg-accent/20 animate-pulse"
        style={{ animationDelay: "3s" }}
      />

      {/* Larger floating elements for desktop */}
      <div
        className="hidden md:block absolute top-16 right-1/4 h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 float-animation"
        style={{ animationDelay: "2.5s" }}
      />
      <div
        className="hidden md:block absolute bottom-24 left-1/3 h-6 w-6 rounded-lg bg-gradient-to-br from-secondary/15 to-accent/15 animate-pulse"
        style={{ animationDelay: "4s" }}
      />
    </>
  )
}
