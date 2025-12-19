import { SidebarLayout } from "@/components/sidebar/SidebarLayout";
import { BeakerIcon, DocumentIcon, TrendingUpIcon, UsersIcon } from "@/components/svg";
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
                  <UsersIcon className="w-5 h-5 text-emerald" />
                </div>
              </div>
              <p className="text-2xl font-heading text-ivory">—</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver text-sm">{t("stats.totalRecipes")}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <DocumentIcon className="w-5 h-5 text-emerald" />
                </div>
              </div>
              <p className="text-2xl font-heading text-ivory">—</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver text-sm">{t("stats.totalIngredients")}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <BeakerIcon className="w-5 h-5 text-emerald" />
                </div>
              </div>
              <p className="text-2xl font-heading text-ivory">—</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver text-sm">{t("stats.activeToday")}</span>
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <TrendingUpIcon className="w-5 h-5 text-emerald" />
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
