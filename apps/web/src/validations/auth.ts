import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "required").email("invalidEmail"),
  password: z.string().min(1, "required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(1, "required"),
    email: z.string().min(1, "required").email("invalidEmail"),
    password: z.string().min(1, "required").min(8, "passwordTooShort"),
    confirmPassword: z.string().min(1, "required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "required").email("invalidEmail"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
