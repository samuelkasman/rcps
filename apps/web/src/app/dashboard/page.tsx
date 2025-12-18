import { SidebarLayout } from "@/components/sidebar/SidebarLayout";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Dashboard");
  const cookieStore = await cookies();
  const sidebarCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

  if (!session) {
    redirect("/auth/signin");
  }

  const userRole = (session.user as any)?.role;

  // Only allow admin users
  if (userRole !== "ADMIN") {
    redirect("/home");
  }

  return (
    <SidebarLayout userRole={userRole} initialCollapsed={sidebarCollapsed}>
      <div className="max-w-6xl mx-auto py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-heading text-ivory mb-2">
              {t("title")}
            </h1>
            <p className="text-silver">{t("subtitle")}</p>
          </div>

          {/* Stats grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver text-sm">{t("stats.totalUsers")}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-heading text-ivory">—</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver text-sm">{t("stats.totalRecipes")}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-heading text-ivory">—</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver text-sm">{t("stats.totalIngredients")}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-heading text-ivory">—</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver text-sm">{t("stats.activeToday")}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-heading text-ivory">—</p>
            </div>
          </div>

          {/* Placeholder sections */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <h2 className="text-lg font-heading text-ivory mb-4">{t("recentActivity")}</h2>
              <p className="text-silver text-sm">{t("noData")}</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <h2 className="text-lg font-heading text-ivory mb-4">{t("systemStatus")}</h2>
              <p className="text-silver text-sm">{t("allSystemsOperational")}</p>
            </div>
          </div>
        </div>
    </SidebarLayout>
  );
}

