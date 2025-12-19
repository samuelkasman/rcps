export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-midnight flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-charcoal/30 via-midnight to-midnight" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-emerald/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-linear-to-tr from-charcoal/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 pt-24">
        {/* Auth form container */}
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-charcoal/50 to-transparent" />
    </div>
  );
}
