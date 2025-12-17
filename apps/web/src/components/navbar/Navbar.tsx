"use client";

import { AuthButtons } from "./AuthButtons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-midnight/80 backdrop-blur-md border-b border-charcoal/50">
      <div className="h-full px-[20px] flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}

