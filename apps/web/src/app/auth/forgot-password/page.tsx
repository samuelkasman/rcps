"use client";

import { Input } from "@/components/form/Input";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/validations/auth";
import { MailIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("Auth");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const getFieldError = (field: keyof ForgotPasswordFormData): string | undefined => {
    const error = errors[field]?.message;
    if (!error) return undefined;

    const errorKeyMap: Record<string, string> = {
      required: t("forgotPassword.errors.emailRequired"),
      invalidEmail: t("forgotPassword.errors.emailInvalid"),
    };

    return errorKeyMap[error] || error;
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);

    try {
      // TODO: Implement password reset API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch {
      setServerError(t("forgotPassword.errors.sendFailed"));
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
    reset();
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
          <h1 className="text-2xl font-medium text-ivory mb-2">
            {t("forgotPassword.success.title")}
          </h1>
          <p className="text-silver">
            {t("forgotPassword.success.message")}{" "}
            <span className="text-ivory">{submittedEmail}</span>
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
            onClick={handleTryAgain}
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
      {serverError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 text-center">{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label={t("common.email")}
          type="email"
          placeholder={t("common.emailPlaceholder")}
          error={getFieldError("email")}
          autoComplete="email"
          {...register("email")}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
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
