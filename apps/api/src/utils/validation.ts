/**
 * Validation utilities for user input
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates password meets minimum requirements
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= MIN_PASSWORD_LENGTH;
};

/**
 * Normalizes email for consistent storage and comparison
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};
