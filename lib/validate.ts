import type {
  EventCategory,
  EventsContent,
  FooterContent,
  HomeContent,
  NewsContent,
  SchoolEvent,
  SiteContent,
  WhatWeDoContent,
  WhoWeAreContent,
} from "./types";
import { EVENT_CATEGORIES } from "./types";

/** Maximum accepted size for the whole site payload. */
export const MAX_CONTENT_BYTES = 400_000;

const MAX_FIELD = 4_000;
const MAX_TITLE = 200;
const MAX_LIST = 200;

function str(value: unknown, max = MAX_FIELD): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function strRequired(value: unknown, max = MAX_FIELD): string | null {
  const result = str(value, max);
  return result.length > 0 ? result : null;
}

function list<T>(value: unknown, limit: number, map: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, limit).map(map);
}

function plainObject(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizeContent(input: unknown): SiteContent | null {
  const root = plainObject(input);
  const site = plainObject(root.site);
  const nav = plainObject(root.nav);
  const home = plainObject(root.home);
  const whoWeAre = plainObject(root.whoWeAre);
  const whatWeDo = plainObject(root.whatWeDo);
  const news = plainObject(root.news);
  const events = plainObject(root.events);
  const footer = plainObject(root.footer);

  const content: SiteContent = {
    site: {
      name: str(site.name, MAX_TITLE) || "Pupils Committee",
      tagline: str(site.tagline, MAX_TITLE) || "Student Government",
    },
    nav: {
      home: str(nav.home, MAX_TITLE) || "Home",
      whoWeAre: str(nav.whoWeAre, MAX_TITLE) || "Who We Are",
      whatWeDo: str(nav.whatWeDo, MAX_TITLE) || "What We Do",
      events: str(nav.events, MAX_TITLE) || "Events",
      news: str(nav.news, MAX_TITLE) || "News",
    },
    home: sanitizeHome(home),
    whoWeAre: sanitizeWhoWeAre(whoWeAre),
    whatWeDo: sanitizeWhatWeDo(whatWeDo),
    news: sanitizeNews(news),
    events: sanitizeEventsContent(events),
    footer: sanitizeFooter(footer),
  };

  return content;
}

export function sanitizeEvents(input: unknown): SchoolEvent[] | null {
  if (!Array.isArray(input)) return null;

  const events: SchoolEvent[] = [];
  for (const raw of input.slice(0, MAX_LIST)) {
    const event = sanitizeEvent(raw);
    if (!event) return null;
    events.push(event);
  }
  return events;
}

export function sanitizeEvent(input: unknown): SchoolEvent | null {
  const raw = plainObject(input);

  const id = str(raw.id, 80) || `evt-${Date.now().toString(36)}`;
  const title = strRequired(raw.title, MAX_TITLE);
  const date = str(raw.date, 10);

  if (!title || !ISO_DATE.test(date)) return null;

  const category = str(raw.category, 40);
  const validCategory = EVENT_CATEGORIES.includes(category as EventCategory)
    ? (category as EventCategory)
    : "Other";

  return {
    id,
    title,
    date,
    time: str(raw.time, 60),
    location: str(raw.location, MAX_TITLE),
    category: validCategory,
    description: str(raw.description),
  };
}

function sanitizeHome(raw: Record<string, unknown>): HomeContent {
  return {
    eyebrow: str(raw.eyebrow, MAX_TITLE),
    title: str(raw.title, MAX_TITLE),
    description: str(raw.description),
    intro: str(raw.intro),
    cards: list(raw.cards, 12, (item) => {
      const card = plainObject(item);
      return { label: str(card.label, MAX_TITLE), note: str(card.note) };
    }),
    highlightTitle: str(raw.highlightTitle, MAX_TITLE),
    highlightBody: str(raw.highlightBody),
  };
}

function sanitizeWhoWeAre(raw: Record<string, unknown>): WhoWeAreContent {
  return {
    eyebrow: str(raw.eyebrow, MAX_TITLE),
    title: str(raw.title, MAX_TITLE),
    description: str(raw.description),
    body: str(raw.body),
    membersHeading: str(raw.membersHeading, MAX_TITLE),
    members: list(raw.members, MAX_LIST, (item) => {
      const member = plainObject(item);
      return {
        name: str(member.name, MAX_TITLE),
        role: str(member.role, MAX_TITLE),
        year: str(member.year, MAX_TITLE),
        bio: str(member.bio),
      };
    }),
  };
}

function sanitizeWhatWeDo(raw: Record<string, unknown>): WhatWeDoContent {
  return {
    eyebrow: str(raw.eyebrow, MAX_TITLE),
    title: str(raw.title, MAX_TITLE),
    description: str(raw.description),
    body: str(raw.body),
    pillarsHeading: str(raw.pillarsHeading, MAX_TITLE),
    pillars: list(raw.pillars, MAX_LIST, (item) => {
      const pillar = plainObject(item);
      return {
        title: str(pillar.title, MAX_TITLE),
        description: str(pillar.description),
      };
    }),
  };
}

function sanitizeNews(raw: Record<string, unknown>): NewsContent {
  return {
    eyebrow: str(raw.eyebrow, MAX_TITLE),
    title: str(raw.title, MAX_TITLE),
    description: str(raw.description),
    body: str(raw.body),
    emptyState: str(raw.emptyState),
    articles: list(raw.articles, MAX_LIST, (item) => {
      const article = plainObject(item);
      const date = str(article.date, 10);
      return {
        title: str(article.title, MAX_TITLE),
        date: ISO_DATE.test(date) ? date : "",
        excerpt: str(article.excerpt),
        body: str(article.body),
      };
    }),
  };
}

function sanitizeEventsContent(raw: Record<string, unknown>): EventsContent {
  return {
    eyebrow: str(raw.eyebrow, MAX_TITLE),
    title: str(raw.title, MAX_TITLE),
    description: str(raw.description),
    body: str(raw.body),
    emptyDay: str(raw.emptyDay),
    emptyAll: str(raw.emptyAll),
  };
}

function sanitizeFooter(raw: Record<string, unknown>): FooterContent {
  return {
    about: str(raw.about),
    exploreHeading: str(raw.exploreHeading, MAX_TITLE),
    contactHeading: str(raw.contactHeading, MAX_TITLE),
    contact: list(raw.contact, 20, (item) => str(item)),
    copyright: str(raw.copyright, MAX_TITLE),
    tagline: str(raw.tagline, MAX_TITLE),
  };
}
