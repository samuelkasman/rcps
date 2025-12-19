"use client";

import { LogoutIcon, UserIcon } from "@/components/svg";
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
              <p className="text-xs text-silver truncate">{session?.user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-silver hover:text-ivory hover:bg-smoke/50 transition-colors duration-150"
                role="menuitem"
              >
                <UserIcon className="w-4 h-4" />
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
                <LogoutIcon className="w-4 h-4" />
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
