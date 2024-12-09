// Define environment variable types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_PORT: string
      NEXT_PUBLIC_API_HOST: string
      NEXT_PUBLIC_CHAT_API_HOST: string
      NEXT_PUBLIC_CHAT_API_PORT: string
    }
  }
}

// API Configuration
export const API_CONFIG = {
  PORT: process.env.NEXT_PUBLIC_API_PORT || '5000',
  HOST: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
  CHAT_HOST: process.env.NEXT_PUBLIC_CHAT_API_HOST || 'localhost',
  CHAT_PORT: process.env.NEXT_PUBLIC_CHAT_API_PORT || '5001',
  get BASE_URL() {
    return `http://${this.HOST}:${this.PORT}/api`
  },
  get CHAT_URL() {
    return `http://${this.CHAT_HOST}:${this.CHAT_PORT}`
  }
} as const

// Prevent TypeScript error about global augmentation
export {} 