export type NavLabels = {
  home: string;
  whoWeAre: string;
  whatWeDo: string;
  events: string;
  news: string;
};

export type HomeContent = {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  cards: { label: string; note: string }[];
  highlightTitle: string;
  highlightBody: string;
};

export type Member = {
  name: string;
  role: string;
  year: string;
  bio: string;
};

export type WhoWeAreContent = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  membersHeading: string;
  members: Member[];
};

export type Pillar = {
  title: string;
  description: string;
};

export type WhatWeDoContent = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  pillarsHeading: string;
  pillars: Pillar[];
};

export type Article = {
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

export type NewsContent = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  emptyState: string;
  articles: Article[];
};

export type EventsContent = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  emptyDay: string;
  emptyAll: string;
};

export type FooterContent = {
  about: string;
  exploreHeading: string;
  contactHeading: string;
  contact: string[];
  copyright: string;
  tagline: string;
};

export type SiteIdentity = {
  name: string;
  tagline: string;
};

export type SiteContent = {
  site: SiteIdentity;
  nav: NavLabels;
  home: HomeContent;
  whoWeAre: WhoWeAreContent;
  whatWeDo: WhatWeDoContent;
  news: NewsContent;
  events: EventsContent;
  footer: FooterContent;
};

export const EVENT_CATEGORIES = [
  "Assembly",
  "Fundraiser",
  "Social",
  "Meeting",
  "Sport",
  "Trip",
  "Other",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type SchoolEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: EventCategory;
  description: string;
};
