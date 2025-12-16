"use client";

import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();

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
              {session?.user?.name || "User"}
            </h1>
            <p className="text-silver">{session?.user?.email}</p>
          </div>
        </div>

        {/* Profile sections */}
        <div className="space-y-8">
          {/* Account settings */}
          <section className="p-6 rounded-xl border border-charcoal bg-charcoal/20">
            <h2 className="text-lg font-medium text-ivory mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-charcoal/50">
                <div>
                  <p className="text-ivory">Email</p>
                  <p className="text-sm text-silver">{session?.user?.email}</p>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-charcoal/50">
                <div>
                  <p className="text-ivory">Password</p>
                  <p className="text-sm text-silver">••••••••</p>
                </div>
                <Button variant="ghost" size="sm">Change</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-ivory">Display Name</p>
                  <p className="text-sm text-silver">{session?.user?.name || "Not set"}</p>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </section>

          {/* Quick links */}
          <section className="p-6 rounded-xl border border-charcoal bg-charcoal/20">
            <h2 className="text-lg font-medium text-ivory mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/recipes"
                className="p-4 rounded-lg border border-charcoal hover:border-smoke bg-midnight/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald group-hover:bg-emerald/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-ivory font-medium">My Recipes</p>
                    <p className="text-sm text-silver">View your collection</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/recipes/new"
                className="p-4 rounded-lg border border-charcoal hover:border-smoke bg-midnight/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald group-hover:bg-emerald/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-ivory font-medium">New Recipe</p>
                    <p className="text-sm text-silver">Add a new recipe</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Danger zone */}
          <section className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
            <h2 className="text-lg font-medium text-ivory mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ivory">Delete Account</p>
                <p className="text-sm text-silver">Permanently delete your account and all data</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
                Delete
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

