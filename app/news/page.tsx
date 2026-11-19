import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent, Badge } from "@/components/ui";
import { readSiteContent } from "@/lib/content";
import { formatShortDate } from "@/lib/dates";

export default async function NewsPage() {
  const { news } = await readSiteContent();
  const articles = [...news.articles].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        eyebrow={news.eyebrow}
        title={news.title}
        description={news.description}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {news.body}
        </p>

        {articles.length === 0 ? (
          <EmptyState message={news.emptyState} />
        ) : (
          <ul className="mt-10 grid gap-4 lg:grid-cols-2">
            {articles.map((article, index) => (
              <li key={`${article.title}-${index}`}>
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "yellow" : "blue"}>
                        {article.date ? formatShortDate(article.date) : "Update"}
                      </Badge>
                    </div>

                    <h2 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-slate-900">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {article.excerpt}
                    </p>

                    {article.body && (
                      <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-500">
                        {article.body}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="mt-10">
      <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Newspaper aria-hidden="true" className="h-6 w-6" />
        </span>
        <p className="max-w-sm text-sm text-slate-600">{message}</p>
      </CardContent>
    </Card>
  );
}
