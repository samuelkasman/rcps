"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface SidebarItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  showLabel?: boolean;
}

export function SidebarItem({ href, label, icon, showLabel = true }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
        ${showLabel ? "" : "justify-center px-3"}
        ${
          isActive
            ? "bg-emerald/15 text-emerald border-l-2 border-emerald"
            : "text-silver hover:text-ivory hover:bg-charcoal/40"
        }
      `}
      title={!showLabel ? label : undefined}
    >
      <span className={isActive ? "text-emerald" : ""}>{icon}</span>
      {showLabel && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
    </Link>
  );
}
