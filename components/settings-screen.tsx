"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Bell, Crown, LogOut, Edit3, Shield, Palette, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { apiClient, type UserSettings } from "@/lib/api-client"

export function SettingsScreen() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    voice_mode: false,
    theme: "dark",
    language: "en",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      if (!isAuthenticated) return

      try {
        const response = await apiClient.getSettings()
        if (response.success && response.data) {
          setSettings(response.data)
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [isAuthenticated])

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    try {
      await apiClient.updateSettings({ [key]: value })
    } catch (error) {
      console.error("Failed to update setting:", error)
      // Revert on error
      setSettings(settings)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
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

  const getDisplayName = () => {
    if (!user) return "Guest"
    return user.full_name || user.username
  }

  const settingsOptions = [
    {
      icon: Edit3,
      title: "Edit Profile",
      description: "Update your personal information",
      action: () => {
        // Navigate to profile edit page (would need to create this)
        console.log("Edit Profile - would navigate to profile page")
      },
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Bell,
      title: "Notification Settings",
      description: "Manage your notification preferences",
      action: () => updateSetting("notifications", !settings.notifications),
      color: "from-blue-500 to-cyan-500",
      toggle: true,
      toggleValue: settings.notifications,
    },
    {
      icon: Volume2,
      title: "Voice Settings",
      description: "Configure voice interaction preferences",
      action: () => updateSetting("voice_mode", !settings.voice_mode),
      color: "from-green-500 to-teal-500",
      toggle: true,
      toggleValue: settings.voice_mode,
    },
    {
      icon: Crown,
      title: "Upgrade Plan",
      description: user?.is_premium ? "Manage premium features" : "Unlock premium features",
      action: () => {
        // Navigate to upgrade page or manage subscription
        console.log("Upgrade Plan - would navigate to billing page")
      },
      color: "from-yellow-500 to-orange-500",
      premium: !user?.is_premium,
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy settings",
      action: () => {
        // Navigate to privacy settings page
        console.log("Privacy Settings - would navigate to privacy page")
      },
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Palette,
      title: "Theme Settings",
      description: "Customize your app appearance",
      action: () => {
        // Cycle through themes or open theme selector
        const themes = ["light", "dark", "system"] as const
        const currentIndex = themes.indexOf(settings.theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        updateSetting("theme", nextTheme)
      },
      color: "from-pink-500 to-rose-500",
    },
  ]

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-pulse" />

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse delay-500" />

      <div className="relative z-10 p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10 hover:text-purple-300 transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white text-glow">Settings</h1>
          <div className="w-10" />
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-1 animate-pulse">
              <div className="bg-slate-900 rounded-full p-1">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt="User Avatar" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">{getDisplayName()}</h2>
          <p className="text-purple-300 text-sm">{user?.is_premium ? "Premium Member" : "Free Member"}</p>
        </div>

        <div className="space-y-4">
          {settingsOptions.map((option, index) => {
            const IconComponent = option.icon
            return (
              <Card
                key={index}
                className="glassmorphism border-0 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={option.action}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${option.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                        {option.title}
                        {option.premium && <Crown className="inline-block ml-2 h-4 w-4 text-yellow-400" />}
                      </h3>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                  </div>
                  {option.toggle && (
                    <Switch
                      checked={option.toggleValue}
                      onCheckedChange={() => option.action()}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                    />
                  )}
                </div>
              </Card>
            )
          })}

          <Separator className="my-6 bg-white/20" />

          <Card className="glassmorphism border-0 hover:bg-red-500/10 transition-all duration-300 cursor-pointer group">
            <div className="p-4 flex items-center space-x-4" onClick={handleLogout}>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <LogOut className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-red-300 transition-colors duration-300">
                  Logout
                </h3>
                <p className="text-sm text-gray-400">Sign out of your account</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
