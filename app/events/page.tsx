import { PageHero } from "@/components/page-hero";
import { EventCalendar } from "@/components/event-calendar";
import { readEvents, readSiteContent } from "@/lib/content";

export default async function EventsPage() {
  const [eventsPage, events] = await Promise.all([
    readSiteContent(),
    readEvents(),
  ]);
  const { events: eventsContent } = eventsPage;

  return (
    <>
      <PageHero
        eyebrow={eventsContent.eyebrow}
        title={eventsContent.title}
        description={eventsContent.description}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {eventsContent.body}
        </p>

        <div className="mt-10">
          <EventCalendar
            events={events}
            emptyDay={eventsContent.emptyDay}
            emptyAll={eventsContent.emptyAll}
          />
        </div>
      </section>
    </>
  );
}
