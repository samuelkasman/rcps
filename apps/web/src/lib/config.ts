// Environment configuration for the web app

export const config = {
  API_URL: process.env.API_URL || "http://localhost:3001",
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || "dev-internal-key",
} as const;
