import { Megaphone, HeartHandshake, CalendarHeart, MessagesSquare } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui";
import { readSiteContent } from "@/lib/content";

const PILLAR_ICONS = [Megaphone, HeartHandshake, CalendarHeart, MessagesSquare];

export default async function WhatWeDoPage() {
  const { whatWeDo } = await readSiteContent();

  return (
    <>
      <PageHero
        eyebrow={whatWeDo.eyebrow}
        title={whatWeDo.title}
        description={whatWeDo.description}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {whatWeDo.body}
        </p>

        <h2 className="mt-12 text-xl font-semibold tracking-tight text-slate-900">
          {whatWeDo.pillarsHeading}
        </h2>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {whatWeDo.pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index % PILLAR_ICONS.length];
            const accent = index % 2 === 0;
            return (
              <li key={pillar.title}>
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <CardContent className="flex h-full flex-col p-6 mt-3">
                    <span
                      className={
                        accent
                          ? "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue-600 text-white"
                          : "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-yellow-400 text-brand-navy"
                      }
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
