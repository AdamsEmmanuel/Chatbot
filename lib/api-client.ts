import { API_CONFIG, STORAGE_KEYS } from "./api-config"

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  is_premium: boolean
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  last_message_preview?: string
}

export interface ChatMessage {
  id: string
  session_id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
  metadata?: Record<string, any>
}

export interface UserSettings {
  notifications: boolean
  voice_mode: boolean
  theme: "light" | "dark" | "system"
  language: string
}

class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  // Get stored auth token
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  // Set auth token
  private setAuthToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  }

  // Remove auth token
  private removeAuthToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  }

  // Make HTTP request with error handling
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getAuthToken()

    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle 401 unauthorized - token expired
        if (response.status === 401) {
          this.removeAuthToken()
          window.location.href = "/login"
        }

        return {
          success: false,
          error: data.detail || data.message || "Request failed",
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ access_token: string; user: User }>> {
    const response = await this.request<{ access_token: string; user: User }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response.success && response.data) {
      this.setAuthToken(response.data.access_token)
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user))
    }

    return response
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<ApiResponse<{ access_token: string; user: User }>> {
    const response = await this.request<{ access_token: string; user: User }>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    })

    if (response.success && response.data) {
      this.setAuthToken(response.data.access_token)
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user))
    }

    return response
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    })

    this.removeAuthToken()
    return response
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE)
  }

  // Chat methods
  async getChatSessions(): Promise<ApiResponse<ChatSession[]>> {
    return this.request<ChatSession[]>(API_CONFIG.ENDPOINTS.CHAT.SESSIONS)
  }

  async createChatSession(title?: string): Promise<ApiResponse<ChatSession>> {
    return this.request<ChatSession>(API_CONFIG.ENDPOINTS.CHAT.SESSIONS, {
      method: "POST",
      body: JSON.stringify({ title }),
    })
  }

  async getChatMessages(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>(`${API_CONFIG.ENDPOINTS.CHAT.MESSAGES}/${sessionId}`)
  }

  async sendMessage(sessionId: string, content: string): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(API_CONFIG.ENDPOINTS.CHAT.SEND, {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, content }),
    })
  }

  async getChatHistory(): Promise<ApiResponse<ChatSession[]>> {
    return this.request<ChatSession[]>(API_CONFIG.ENDPOINTS.CHAT.HISTORY)
  }

  // Settings methods
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (stored) {
      return { success: true, data: JSON.parse(stored) }
    }

    // Default settings
    const defaultSettings: UserSettings = {
      notifications: true,
      voice_mode: false,
      theme: "dark",
      language: "en",
    }

    return { success: true, data: defaultSettings }
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    const currentSettings = await this.getSettings()
    const updatedSettings = { ...currentSettings.data, ...settings }

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings))

    return { success: true, data: updatedSettings }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    return userData ? JSON.parse(userData) : null
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
