"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function Logo() {
  const { data: session } = useSession();
  const t = useTranslations("Landing");
  const href = session ? "/home" : "/";

  return (
    <Link
      href={href}
      className="font-heading text-2xl tracking-wide text-ivory hover:text-emerald transition-colors duration-200"
    >
      {t("title")}
    </Link>
  );
}

