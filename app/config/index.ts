// Define environment variable types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_PORT: string
      NEXT_PUBLIC_API_HOST: string
    }
  }
}

// API Configuration
export const API_CONFIG = {
  PORT: process.env.NEXT_PUBLIC_API_PORT || '3500',
  HOST: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
  get BASE_URL() {
    return `http://${this.HOST}:${this.PORT}/api`
  }
} as const

// Prevent TypeScript error about global augmentation
export {} 