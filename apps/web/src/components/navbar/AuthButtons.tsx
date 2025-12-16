"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AuthButtonsSkeleton } from "./AuthButtonsSkeleton";
import { UserAvatar } from "./UserAvatar";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <AuthButtonsSkeleton />;
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-sm text-silver hover:text-ivory transition-colors duration-200"
        >
          <UserAvatar name={session?.user?.name} email={session?.user?.email} />
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="text-sm px-4 py-2 text-silver hover:text-ivory border border-charcoal hover:border-smoke rounded-lg transition-all duration-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/signin"
        className="text-sm text-silver hover:text-ivory transition-colors duration-200"
      >
        Sign in
      </Link>
      <Link
        href="/auth/signup"
        className="text-sm px-5 py-2.5 bg-emerald hover:bg-emerald-hover text-ivory font-medium rounded-lg transition-colors duration-200"
      >
        Sign up
      </Link>
    </div>
  );
}
