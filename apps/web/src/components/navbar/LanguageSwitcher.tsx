"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const locales = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sk", label: "Slovenčina", flag: "🇸🇰" },
  { code: "cz", label: "Čeština", flag: "🇨🇿" },
] as const;

type Locale = (typeof locales)[number]["code"];

function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale) ?? locales[0];

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

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setLocaleCookie(newLocale);
    setIsOpen(false);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center justify-items-start gap-2 px-3 py-2 text-sm font-medium rounded-lg
          bg-charcoal/50 border border-charcoal/80 
          text-silver hover:text-ivory hover:border-smoke
          transition-all duration-200
          ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base">{currentLocale.flag}</span>
        {/* <span>{currentLocale.code.toUpperCase()}</span> */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 py-1 bg-charcoal border border-smoke/50 rounded-lg shadow-xl shadow-black/30 z-50 overflow-hidden"
          role="listbox"
        >
          {locales.map(({ code, label, flag }) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={locale === code}
              onClick={() => handleLocaleChange(code)}
              className={`
                cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150
                ${
                  locale === code
                    ? "bg-emerald/20 text-emerald-light"
                    : "text-silver hover:text-ivory hover:bg-smoke/50"
                }
              `}
            >
              <span className="text-lg">{flag}</span>
              <span className="flex-1 text-left">{label}</span>
              {locale === code && (
                <svg className="w-4 h-4 text-emerald-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
