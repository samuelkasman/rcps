"use client";

import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function SignOutPage() {
  return (
    <div className="space-y-8 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-charcoal/50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-silver"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div>
        <h1 className="text-2xl font-medium text-ivory mb-2">Sign out</h1>
        <p className="text-silver">Are you sure you want to sign out?</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full"
          size="lg"
        >
          Sign out
        </Button>
        <Link href="/">
          <Button variant="ghost" className="w-full" size="lg">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}

