import { SidebarLayout } from "@/components/sidebar/SidebarLayout";
import { HeartIcon, PlusIcon, SearchIcon } from "@/components/svg";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Home");
  const cookieStore = await cookies();
  const sidebarCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

  if (!session) {
    redirect("/auth/signin");
  }

  const userRole = (session.user as any)?.role;

  return (
    <SidebarLayout userRole={userRole} initialCollapsed={sidebarCollapsed}>
      <div className="max-w-6xl mx-auto py-12">
        {/* Welcome section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading text-ivory mb-3">
            {t("welcome")}, {session.user?.name || "User"}
          </h1>
          <p className="text-silver text-lg">{t("description")}</p>
        </div>

        {/* Placeholder content area */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards */}
          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6 hover:border-emerald/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center mb-4">
              <PlusIcon className="w-6 h-6 text-emerald" />
            </div>
            <h3 className="text-lg font-medium text-ivory mb-2">Create Recipe</h3>
            <p className="text-silver text-sm">Add your favorite recipes to your collection</p>
          </div>

          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6 hover:border-emerald/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center mb-4">
              <SearchIcon className="w-6 h-6 text-emerald" />
            </div>
            <h3 className="text-lg font-medium text-ivory mb-2">Discover</h3>
            <p className="text-silver text-sm">Explore recipes from the community</p>
          </div>

          <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6 hover:border-emerald/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center mb-4">
              <HeartIcon className="w-6 h-6 text-emerald" />
            </div>
            <h3 className="text-lg font-medium text-ivory mb-2">Favorites</h3>
            <p className="text-silver text-sm">Quick access to your saved recipes</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
