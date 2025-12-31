// Environment configuration
// Centralized access to environment variables

export const config = {
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || "dev-internal-key",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3001", 10),
} as const;
