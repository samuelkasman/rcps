"use client";

import { Input } from "@/components/form/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement password reset API call
      // const response = await fetch("/api/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error("Failed to send reset email");
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8 text-center">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div>
          <h1 className="text-2xl font-medium text-ivory mb-2">Check your email</h1>
          <p className="text-silver">
            We&apos;ve sent a password reset link to{" "}
            <span className="text-ivory">{email}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/auth/signin">
            <Button className="w-full" size="lg">
              Back to sign in
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-sm text-silver hover:text-ivory transition-colors"
          >
            Didn&apos;t receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-medium text-ivory mb-2">Forgot password?</h1>
        <p className="text-silver">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Send reset link
        </Button>
      </form>

      {/* Back link */}
      <p className="text-center text-sm text-silver">
        Remember your password?{" "}
        <Link
          href="/auth/signin"
          className="text-emerald hover:text-emerald-hover font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

