"use client";

export function AuthButtonsSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-4 w-16 bg-charcoal rounded animate-pulse" />
      <div className="h-9 w-20 bg-charcoal rounded animate-pulse" />
    </div>
  );
}
