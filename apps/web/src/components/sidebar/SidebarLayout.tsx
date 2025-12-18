"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface SidebarLayoutProps {
  userRole?: string;
  children: ReactNode;
  initialCollapsed?: boolean;
}

// Context for sidebar state
const SidebarContext = createContext<{ isCollapsed: boolean }>({ isCollapsed: false });

export function useSidebarState() {
  return useContext(SidebarContext);
}

const SIDEBAR_COOKIE_NAME = "sidebar-collapsed";

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function SidebarLayout({ userRole, children, initialCollapsed = false }: SidebarLayoutProps) {
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
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      visible: true,
    },
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
      ),
      visible: isAdmin,
    },
  ];

  const NavLink = ({ item, showLabel = true }: { item: typeof navItems[0]; showLabel?: boolean }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
          ${showLabel ? "" : "justify-center px-3"}
          ${
            isActive
              ? "bg-emerald/15 text-emerald border-l-2 border-emerald"
              : "text-silver hover:text-ivory hover:bg-charcoal/40"
          }
        `}
        title={!showLabel ? item.label : undefined}
      >
        <span className={isActive ? "text-emerald" : ""}>
          {item.icon}
        </span>
        {showLabel && (
          <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
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
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
                <NavLink key={item.href} item={item} showLabel={true} />
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
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className={`flex flex-col gap-1 p-4 ${isCollapsed ? "px-3" : ""}`}>
            {navItems
              .filter((item) => item.visible)
              .map((item) => (
                <NavLink key={item.href} item={item} showLabel={!isCollapsed} />
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
    </SidebarContext.Provider>
  );
}
