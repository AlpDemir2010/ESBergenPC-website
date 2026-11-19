import Link from "next/link";
import { CalendarDays, Megaphone, Newspaper, Users } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { readSiteContent } from "@/lib/content";
import { NAV_HREFS, SECTION_HREFS } from "@/lib/nav";

const CARD_ICONS = [Users, Megaphone, CalendarDays, Newspaper];

export default async function HomePage() {
  const content = await readSiteContent();
  const { home } = content;

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue-50 via-white to-brand-yellow-100/40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-blue-100/50 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-yellow-300">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-yellow-400" />
              {home.eyebrow}
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              {home.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              {home.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={NAV_HREFS.events} className={buttonClass("primary", "lg")}>
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                See upcoming events
              </Link>
              <Link href={NAV_HREFS.whoWeAre} className={buttonClass("outline", "lg")}>
                Meet the Committee
              </Link>
            </div>
          </div>

          {/* Decorative stack of cards standing in for the sections */}
          <div aria-hidden="true" className="relative hidden h-72 lg:block">
            <div className="absolute right-8 top-4 w-56 rotate-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card-hover">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-yellow-400 text-brand-navy">
                <CalendarDays className="h-4 w-4" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-900">Some event</p>
              <p className="mt-1 text-xs text-slate-500">Or something else idrk</p>
            </div>
            <div className="absolute bottom-2 left-0 w-56 -rotate-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-card-hover">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-600 text-white">
                <Users className="h-4 w-4" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-900">16 members</p>
              <p className="mt-1 text-xs text-slate-500">From nearly all years and sections</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {home.intro}
        </p>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTION_HREFS.map((href, index) => {
            const card = home.cards[index] ?? { label: href, note: "" };
            const Icon = CARD_ICONS[index] ?? Newspaper;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full flex-col justify-between gap-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:border-brand-blue-200 hover:shadow-card-hover"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-50 text-brand-blue-600 transition-colors group-hover:bg-brand-blue-600 group-hover:text-white">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-slate-900">
                      {card.label}
                    </span>
                    <span className="mt-1.5 block text-sm text-slate-500">{card.note}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow-300 via-brand-yellow-400 to-brand-yellow-500 px-8 py-14 shadow-card sm:px-14 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-white/30 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-8 h-72 w-72 rounded-full bg-brand-navy/10 blur-2xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <h2 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              {home.highlightTitle}
            </h2>
            <div>
              <p className="text-base leading-relaxed text-brand-navy/80">
                {home.highlightBody}
              </p>
              <Link
                href={NAV_HREFS.whatWeDo}
                className={buttonClass("navy", "md", "mt-7")}
              >
                How we work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
