"use client";

import { ChevronLeftIcon, ChevronRightIcon, DashboardIcon, HomeIcon } from "@/components/svg";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SidebarItem } from "./SidebarItem";

interface SidebarLayoutProps {
  userRole?: string;
  children: ReactNode;
  initialCollapsed?: boolean;
}

const SIDEBAR_COOKIE_NAME = "sidebar-collapsed";

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function SidebarLayout({
  userRole,
  children,
  initialCollapsed = false,
}: SidebarLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const isAdmin = userRole === "ADMIN";

  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persist collapsed state to cookie when it changes
  const handleToggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    setCookie(SIDEBAR_COOKIE_NAME, String(newValue));
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navItems = [
    {
      href: "/home",
      label: t("home"),
      icon: <HomeIcon className="w-5 h-5 shrink-0" />,
      visible: true,
    },
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: <DashboardIcon className="w-5 h-5 shrink-0" />,
      visible: isAdmin,
    },
  ];

  return (
    <div className="min-h-screen bg-midnight">
      {/* Mobile toggle button - positioned below navbar, moves with sidebar */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`
            fixed top-[86px] z-50 w-6 h-6 rounded-r-full bg-charcoal border border-l-0 border-charcoal/80 
            text-silver hover:text-ivory hover:bg-smoke transition-all duration-300 ease-out
            flex items-center justify-center shadow-lg md:hidden cursor-pointer
            ${isMobileOpen ? "left-64" : "left-0"}
          `}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        <ChevronRightIcon
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Mobile overlay - below navbar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 top-20 bg-midnight/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar - positioned below navbar */}
      <aside
        className={`
            fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-obsidian border-r border-charcoal/50 z-40
            transform transition-transform duration-300 ease-out md:hidden
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
      >
        {/* Mobile nav */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems
            .filter((item) => item.visible)
            .map((item) => (
              <SidebarItem key={item.href} {...item} />
            ))}
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
            hidden md:block fixed left-0 top-20 h-[calc(100vh-5rem)] bg-obsidian border-r border-charcoal/50 z-40
            transition-all duration-300 ease-out
            ${isCollapsed ? "w-[72px]" : "w-64"}
          `}
      >
        {/* Toggle button */}
        <button
          onClick={handleToggleCollapse}
          className="absolute cursor-pointer -right-3 top-6 w-6 h-6 rounded-full bg-charcoal border border-charcoal/80 text-silver hover:text-ivory hover:bg-smoke transition-colors flex items-center justify-center shadow-lg"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeftIcon
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Desktop nav */}
        <nav className={`flex flex-col gap-1 p-3 ${isCollapsed ? "px-3" : ""}`}>
          {navItems
            .filter((item) => item.visible)
            .map((item) => (
              <SidebarItem key={item.href} {...item} showLabel={!isCollapsed} />
            ))}
        </nav>
      </aside>

      {/* Main content area */}
      <main
        className={`
            pt-20 px-4 md:px-6 transition-all duration-300
            ${isCollapsed ? "md:pl-[96px]" : "md:pl-[280px]"}
          `}
      >
        {children}
      </main>
    </div>
  );
}
