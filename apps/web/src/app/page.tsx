import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Landing');

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-charcoal/20 via-midnight to-midnight" />
      
      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-charcoal/30 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-linear-to-r from-transparent via-charcoal/30 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-heading text-[clamp(4rem,15vw,12rem)] leading-none tracking-tight text-ivory">
          {t('title')}
        </h1>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-midnight to-transparent" />
    </div>
  );
}
