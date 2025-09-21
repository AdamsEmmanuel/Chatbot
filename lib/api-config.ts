// API Configuration - Update these values for production deployment
export const API_CONFIG = {
  // Backend API URL - Update this to your deployed backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      REFRESH: "/auth/refresh",
      LOGOUT: "/auth/logout",
      PROFILE: "/auth/profile",
    },
    CHAT: {
      SESSIONS: "/chat/sessions",
      MESSAGES: "/chat/messages",
      SEND: "/chat/send",
      HISTORY: "/chat/history",
    },
    ADMIN: {
      USERS: "/admin/users",
      MESSAGES: "/admin/messages",
      STATS: "/admin/stats",
    },
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
}

// Storage keys for local storage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "chatbot_access_token",
  REFRESH_TOKEN: "chatbot_refresh_token",
  USER_DATA: "chatbot_user_data",
  CHAT_HISTORY: "chatbot_chat_history",
  SETTINGS: "chatbot_settings",
}
