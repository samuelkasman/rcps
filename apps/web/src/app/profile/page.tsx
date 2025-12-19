"use client";

import { BookIcon, PlusIcon } from "@/components/svg";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const t = useTranslations("Profile");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-midnight pt-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-charcoal" />
              <div className="space-y-3">
                <div className="h-6 w-48 bg-charcoal rounded" />
                <div className="h-4 w-32 bg-charcoal rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  return (
    <div className="min-h-screen bg-midnight pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-24 h-24 rounded-full bg-charcoal flex items-center justify-center text-ivory text-3xl font-medium uppercase">
            {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-medium text-ivory mb-1">
              {session?.user?.name || t("user")}
            </h1>
            <p className="text-silver">{session?.user?.email}</p>
          </div>
        </div>

        {/* Profile sections */}
        <div className="space-y-8">
          {/* Account settings */}
          <section className="p-6 rounded-xl border border-charcoal bg-charcoal/20">
            <h2 className="text-lg font-medium text-ivory mb-4">{t("accountSettings")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-charcoal/50">
                <div>
                  <p className="text-ivory">{t("email")}</p>
                  <p className="text-sm text-silver">{session?.user?.email}</p>
                </div>
                <Button variant="ghost" size="sm">{t("edit")}</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-charcoal/50">
                <div>
                  <p className="text-ivory">{t("password")}</p>
                  <p className="text-sm text-silver">••••••••</p>
                </div>
                <Button variant="ghost" size="sm">{t("change")}</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-ivory">{t("displayName")}</p>
                  <p className="text-sm text-silver">{session?.user?.name || t("notSet")}</p>
                </div>
                <Button variant="ghost" size="sm">{t("edit")}</Button>
              </div>
            </div>
          </section>

          {/* Quick links */}
          <section className="p-6 rounded-xl border border-charcoal bg-charcoal/20">
            <h2 className="text-lg font-medium text-ivory mb-4">{t("quickLinks")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/recipes"
                className="p-4 rounded-lg border border-charcoal hover:border-smoke bg-midnight/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald group-hover:bg-emerald/20 transition-colors">
                    <BookIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-ivory font-medium">{t("myRecipes")}</p>
                    <p className="text-sm text-silver">{t("viewYourCollection")}</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/recipes/new"
                className="p-4 rounded-lg border border-charcoal hover:border-smoke bg-midnight/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald group-hover:bg-emerald/20 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-ivory font-medium">{t("newRecipe")}</p>
                    <p className="text-sm text-silver">{t("addNewRecipe")}</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Danger zone */}
          <section className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
            <h2 className="text-lg font-medium text-ivory mb-4">{t("dangerZone")}</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ivory">{t("deleteAccount")}</p>
                <p className="text-sm text-silver">{t("deleteAccountDescription")}</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
                {t("delete")}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
