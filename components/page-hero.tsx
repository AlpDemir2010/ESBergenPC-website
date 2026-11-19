import { cn } from "@/lib/cn";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHero({ eyebrow, title, description, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-slate-200 bg-white",
        className,
      )}
    >
      {/* Soft wash of brand colour behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue-50 via-white to-brand-yellow-100/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-blue-100/60 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-yellow-300">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-yellow-400" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
