"use client";

import { Input } from "@/components/form/Input";
import { MailIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement password reset API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch {
      setError(t("forgotPassword.errors.sendFailed"));
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
            <MailIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>

        {/* Message */}
        <div>
          <h1 className="text-2xl font-medium text-ivory mb-2">{t("forgotPassword.success.title")}</h1>
          <p className="text-silver">
            {t("forgotPassword.success.message")}{" "}
            <span className="text-ivory">{email}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/auth/signin">
            <Button className="w-full" size="lg">
              {t("forgotPassword.success.backToSignIn")}
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-sm text-silver hover:text-ivory transition-colors"
          >
            {t("forgotPassword.success.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-medium text-ivory mb-2">{t("forgotPassword.title")}</h1>
        <p className="text-silver">{t("forgotPassword.subtitle")}</p>
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
          label={t("common.email")}
          type="email"
          name="email"
          placeholder={t("common.emailPlaceholder")}
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
          {t("forgotPassword.submit")}
        </Button>
      </form>

      {/* Back link */}
      <p className="text-center text-sm text-silver">
        {t("forgotPassword.rememberPassword")}{" "}
        <Link
          href="/auth/signin"
          className="text-emerald hover:text-emerald-hover font-medium transition-colors"
        >
          {t("forgotPassword.signIn")}
        </Link>
      </p>
    </div>
  );
}
