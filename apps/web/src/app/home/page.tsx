import { Navbar } from "@/components/navbar/Navbar";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("Home");

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      
      {/* Main content area */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
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
                <svg className="w-6 h-6 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-ivory mb-2">Create Recipe</h3>
              <p className="text-silver text-sm">Add your favorite recipes to your collection</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6 hover:border-emerald/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-ivory mb-2">Discover</h3>
              <p className="text-silver text-sm">Explore recipes from the community</p>
            </div>

            <div className="rounded-xl bg-charcoal/30 border border-charcoal/50 p-6 hover:border-emerald/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-ivory mb-2">Favorites</h3>
              <p className="text-silver text-sm">Quick access to your saved recipes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


