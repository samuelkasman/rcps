"use client";

import { Input } from "@/components/form/Input";
import { signUpSchema, type SignUpFormData } from "@/validations/auth";
import { GoogleIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations("Auth");

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const getFieldError = (field: keyof SignUpFormData): string | undefined => {
    const error = errors[field]?.message;
    if (!error) return undefined;

    // Map validation error keys to translation keys
    const errorKeyMap: Record<string, string> = {
      required:
        field === "name"
          ? t("signUp.errors.nameRequired")
          : field === "email"
            ? t("signUp.errors.emailRequired")
            : t("signUp.errors.passwordRequired"),
      invalidEmail: t("signUp.errors.emailInvalid"),
      passwordTooShort: t("signUp.errors.passwordTooShort"),
      passwordMismatch: t("signUp.errors.passwordMismatch"),
    };

    return errorKeyMap[error] || error;
  };

  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null);

    try {
      // Register user via API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 409) {
          setServerError(t("signUp.errors.emailExists"));
        } else {
          throw new Error(responseData.error || "Failed to create account");
        }
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError(t("signUp.errors.createFailed"));
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t("signUp.errors.unexpected"));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-medium text-ivory mb-2">{t("signUp.title")}</h1>
        <p className="text-silver">{t("signUp.subtitle")}</p>
      </div>

      {/* Error message */}
      {serverError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 text-center">{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={t("signUp.name")}
          type="text"
          placeholder={t("signUp.namePlaceholder")}
          error={getFieldError("name")}
          autoComplete="name"
          {...register("name")}
        />

        <Input
          label={t("common.email")}
          type="email"
          placeholder={t("common.emailPlaceholder")}
          error={getFieldError("email")}
          autoComplete="email"
          {...register("email")}
        />

        <Input
          label={t("common.password")}
          type="password"
          placeholder={t("common.passwordPlaceholder")}
          error={getFieldError("password")}
          hint={!errors.password ? t("signUp.passwordHint") : undefined}
          autoComplete="new-password"
          {...register("password")}
        />

        <Input
          label={t("signUp.confirmPassword")}
          type="password"
          placeholder={t("common.passwordPlaceholder")}
          error={getFieldError("confirmPassword")}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          {t("signUp.submit")}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-charcoal" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-midnight text-ash">{t("common.orContinueWith")}</span>
        </div>
      </div>

      {/* Social providers */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full max-w-xs"
          onClick={() => signIn("google", { callbackUrl: "/home" })}
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          {t("common.google")}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-ash">
        {t("signUp.terms")}{" "}
        <Link href="/terms" className="text-silver hover:text-ivory transition-colors">
          {t("signUp.termsOfService")}
        </Link>{" "}
        {t("signUp.and")}{" "}
        <Link href="/privacy" className="text-silver hover:text-ivory transition-colors">
          {t("signUp.privacyPolicy")}
        </Link>
      </p>

      {/* Sign in link */}
      <p className="text-center text-sm text-silver">
        {t("signUp.hasAccount")}{" "}
        <Link
          href="/auth/signin"
          className="text-emerald hover:text-emerald-hover font-medium transition-colors"
        >
          {t("signUp.signIn")}
        </Link>
      </p>
    </div>
  );
}
