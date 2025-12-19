"use client";

import { Input } from "@/components/form/Input";
import { GoogleIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  const error = searchParams.get("error");
  const t = useTranslations("Auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setFormError(t("signIn.errors.invalidCredentials"));
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setFormError(t("signIn.errors.unexpected"));
    } finally {
      setIsLoading(false);
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
      {(error || formError) && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 text-center">
            {formError || getErrorMessage(error)}
          </p>
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

        <div>
          <Input
            label={t("common.password")}
            type="password"
            name="password"
            placeholder={t("common.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
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

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
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
