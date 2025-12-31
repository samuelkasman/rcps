import { SidebarLayout } from "@/components/sidebar/SidebarLayout";
import { BeakerIcon, DocumentIcon, TrendingUpIcon, UsersIcon } from "@/components/svg";
import { fetchFromApi } from "@/lib/api";
import { getRelativeTimeData } from "@/lib/formatters";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalIngredients: number;
  activeToday: number;
}

interface UserActivityData {
  name: string;
  email: string;
  role: string;
}

interface RecipeActivityData {
  title: string;
  author: string;
  status: string;
}

interface ActivityItem {
  type: "user_registered" | "recipe_created";
  id: string;
  timestamp: string;
  data: UserActivityData | RecipeActivityData;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Dashboard");
  const cookieStore = await cookies();
  const sidebarCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

  if (!session) {
    redirect("/auth/signin");
  }

  const userRole = session.user?.role;

  // Only allow admin users
  if (userRole !== "ADMIN") {
    redirect("/home");
  }

  const data = await fetchFromApi<DashboardData>("/dashboard/stats", {
    next: { revalidate: 30 },
  });

  const stats = data?.stats;
  const recentActivity = data?.recentActivity ?? [];

  // Format activity description using translations
  const getActivityDescription = (activity: ActivityItem): string => {
    if (activity.type === "user_registered") {
      const data = activity.data as UserActivityData;
      return t("activity.userJoined", { name: data.name });
    } else {
      const data = activity.data as RecipeActivityData;
      return t("activity.recipeCreated", { author: data.author, title: data.title });
    }
  };

  // Format relative time using translations
  const formatTime = (timestamp: string): string => {
    const { key, count, date } = getRelativeTimeData(timestamp);
    if (key === "date" && date) {
      return date.toLocaleDateString();
    }
    if (count !== undefined) {
      return t(`time.${key}`, { count });
    }
    return t(`time.${key}`);
  };

  return (
    <SidebarLayout userRole={userRole} initialCollapsed={sidebarCollapsed}>
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-heading text-ivory mb-2">{t("title")}</h1>
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
            <p className="text-2xl font-heading text-ivory">
              {stats?.totalUsers?.toLocaleString() ?? "—"}
            </p>
          </div>

          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-silver text-sm">{t("stats.totalRecipes")}</span>
              <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-emerald" />
              </div>
            </div>
            <p className="text-2xl font-heading text-ivory">
              {stats?.totalRecipes?.toLocaleString() ?? "—"}
            </p>
          </div>

          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-silver text-sm">{t("stats.totalIngredients")}</span>
              <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                <BeakerIcon className="w-5 h-5 text-emerald" />
              </div>
            </div>
            <p className="text-2xl font-heading text-ivory">
              {stats?.totalIngredients?.toLocaleString() ?? "—"}
            </p>
          </div>

          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-silver text-sm">{t("stats.activeToday")}</span>
              <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-emerald" />
              </div>
            </div>
            <p className="text-2xl font-heading text-ivory">
              {stats?.activeToday?.toLocaleString() ?? "—"}
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
            <h2 className="text-lg font-heading text-ivory mb-4">{t("recentActivity")}</h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-center gap-3 py-2 border-b border-charcoal/30 last:border-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "user_registered" ? "bg-blue-500/10" : "bg-emerald/10"
                      }`}
                    >
                      {activity.type === "user_registered" ? (
                        <UsersIcon className="w-4 h-4 text-blue-400" />
                      ) : (
                        <DocumentIcon className="w-4 h-4 text-emerald" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ivory truncate">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-xs text-silver">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-silver text-sm">{t("noData")}</p>
            )}
          </div>

          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6">
            <h2 className="text-lg font-heading text-ivory mb-4">{t("systemStatus")}</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-charcoal/30">
                <span className="text-sm text-silver">{t("system.database")}</span>
                <span className="flex items-center gap-2 text-sm text-emerald">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                  {t("system.operational")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-charcoal/30">
                <span className="text-sm text-silver">{t("system.apiServer")}</span>
                <span className="flex items-center gap-2 text-sm text-emerald">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                  {t("system.operational")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-silver">{t("system.authentication")}</span>
                <span className="flex items-center gap-2 text-sm text-emerald">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                  {t("system.operational")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
