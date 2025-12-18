"use client";

import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthButtonsSkeleton } from "./AuthButtonsSkeleton";
import { UserAvatar } from "./UserAvatar";

export function AuthButtons() {
  const { data: session, status } = useSession();
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  if (status === "loading") {
    return <AuthButtonsSkeleton />;
  }

  if (status === "authenticated") {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex cursor-pointer items-center gap-2 p-1 rounded-full hover:bg-charcoal/50 transition-colors duration-200"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <UserAvatar name={session?.user?.name} email={session?.user?.email} />
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-56 py-1 bg-charcoal border border-smoke/50 rounded-lg shadow-xl shadow-black/30 z-50 overflow-hidden"
            role="menu"
          >
            {/* User info header */}
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-ivory truncate">
                {session?.user?.name || t("user")}
              </p>
              <p className="text-xs text-silver truncate">
                {session?.user?.email}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-silver hover:text-ivory hover:bg-smoke/50 transition-colors duration-150"
                role="menuitem"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t("profile")}
              </Link>
            </div>

            {/* Logout */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-silver hover:text-ivory hover:bg-smoke/50 transition-colors duration-150"
                role="menuitem"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t("signOut")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/signin"
        className="text-sm text-silver hover:text-ivory transition-colors duration-200"
      >
        {t("signIn")}
      </Link>
      <Link
        href="/auth/signup"
        className="text-sm px-5 py-2.5 bg-emerald hover:bg-emerald-hover text-white-forced font-medium rounded-lg transition-colors duration-200"
      >
        {t("signUp")}
      </Link>
    </div>
  );
}
