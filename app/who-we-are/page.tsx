import { PageHero } from "@/components/page-hero";
import { Card, CardContent, Badge } from "@/components/ui";
import { readSiteContent } from "@/lib/content";

export default async function WhoWeArePage() {
  const { whoWeAre } = await readSiteContent();

  return (
    <>
      <PageHero
        eyebrow={whoWeAre.eyebrow}
        title={whoWeAre.title}
        description={whoWeAre.description}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {whoWeAre.body}
        </p>

        <h2 className="mt-12 text-xl font-semibold tracking-tight text-slate-900">
          {whoWeAre.membersHeading}
        </h2>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whoWeAre.members.map((member) => (
            <li key={`${member.name}-${member.role}`}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue-600 text-sm font-bold text-white"
                    >
                      {initials(member.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{member.name}</p>
                      <p className="truncate text-sm text-brand-blue-600">{member.role}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{member.bio}</p>

                  {member.year && (
                    <div className="mt-5">
                      <Badge variant="neutral">{member.year}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
