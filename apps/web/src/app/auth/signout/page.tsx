"use client";

import { LogoutIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SignOutPage() {
  const t = useTranslations("Auth");

  return (
    <div className="space-y-8 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-charcoal/50 flex items-center justify-center">
          <LogoutIcon className="w-8 h-8 text-silver" />
        </div>
      </div>

      {/* Message */}
      <div>
        <h1 className="text-2xl font-medium text-ivory mb-2">{t("signOut.title")}</h1>
        <p className="text-silver">{t("signOut.subtitle")}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
          size="lg"
        >
          {t("signOut.submit")}
        </Button>
        <Link href="/">
          <Button variant="ghost" className="w-full" size="lg">
            {t("signOut.cancel")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
