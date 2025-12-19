"use client";

import { Input } from "@/components/form/Input";
import { GoogleIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations("Auth");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("signUp.errors.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("signUp.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("signUp.errors.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("signUp.errors.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("signUp.errors.passwordTooShort");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("signUp.errors.passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Register user via API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          setError(t("signUp.errors.emailExists"));
        } else {
          throw new Error(data.error || "Failed to create account");
        }
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("signUp.errors.createFailed"));
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("signUp.errors.unexpected"));
    } finally {
      setIsLoading(false);
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
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t("signUp.name")}
          type="text"
          name="name"
          placeholder={t("signUp.namePlaceholder")}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          label={t("common.email")}
          type="email"
          name="email"
          placeholder={t("common.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label={t("common.password")}
          type="password"
          name="password"
          placeholder={t("common.passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          hint={t("signUp.passwordHint")}
          autoComplete="new-password"
        />

        <Input
          label={t("signUp.confirmPassword")}
          type="password"
          name="confirmPassword"
          placeholder={t("common.passwordPlaceholder")}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
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
