"use client";

import { Input } from "@/components/form/Input";
import { signInSchema, type SignInFormData } from "@/validations/auth";
import { GoogleIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  const urlError = searchParams.get("error");
  const t = useTranslations("Auth");

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const getErrorMessage = (errorCode: string | null): string => {
    switch (errorCode) {
      case "CredentialsSignin":
        return t("signIn.errors.invalidCredentials");
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
        return t("signIn.errors.providerError");
      case "OAuthAccountNotLinked":
        return t("signIn.errors.accountNotLinked");
      case "SessionRequired":
        return t("signIn.errors.sessionRequired");
      default:
        return t("signIn.errors.default");
    }
  };

  const getFieldError = (field: keyof SignInFormData): string | undefined => {
    const error = errors[field]?.message;
    if (!error) return undefined;

    const errorKeyMap: Record<string, string> = {
      required:
        field === "email" ? t("signIn.errors.emailRequired") : t("signIn.errors.passwordRequired"),
      invalidEmail: t("signIn.errors.emailInvalid"),
    };

    return errorKeyMap[error] || error;
  };

  const onSubmit = async (data: SignInFormData) => {
    setServerError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setServerError(t("signIn.errors.invalidCredentials"));
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setServerError(t("signIn.errors.unexpected"));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-medium text-ivory mb-2">{t("signIn.title")}</h1>
        <p className="text-silver">{t("signIn.subtitle")}</p>
      </div>

      {/* Error messages */}
      {(urlError || serverError) && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 text-center">
            {serverError || getErrorMessage(urlError)}
          </p>
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

        <div>
          <Input
            label={t("common.password")}
            type="password"
            placeholder={t("common.passwordPlaceholder")}
            error={getFieldError("password")}
            autoComplete="current-password"
            {...register("password")}
          />
          <div className="mt-2 text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-emerald hover:text-emerald-hover transition-colors"
            >
              {t("signIn.forgotPassword")}
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          {t("signIn.submit")}
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
          onClick={() => signIn("google", { callbackUrl })}
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          {t("common.google")}
        </Button>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-silver">
        {t("signIn.noAccount")}{" "}
        <Link
          href="/auth/signup"
          className="text-emerald hover:text-emerald-hover font-medium transition-colors"
        >
          {t("signIn.signUp")}
        </Link>
      </p>
    </div>
  );
}
