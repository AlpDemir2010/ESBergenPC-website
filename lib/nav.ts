import type { NavLabels } from "./types";

export type NavItem = {
  href: string;
  label: string;
};

/**
 * Route order is fixed in code; only the labels come from the CMS so the
 * Committee can rename the sections without touching the source.
 */
export const NAV_HREFS = {
  home: "/",
  whoWeAre: "/who-we-are",
  whatWeDo: "/what-we-do",
  events: "/events",
  news: "/news",
} as const;

export function buildNavItems(labels: NavLabels): NavItem[] {
  return [
    { href: NAV_HREFS.home, label: labels.home },
    { href: NAV_HREFS.whoWeAre, label: labels.whoWeAre },
    { href: NAV_HREFS.whatWeDo, label: labels.whatWeDo },
    { href: NAV_HREFS.events, label: labels.events },
    { href: NAV_HREFS.news, label: labels.news },
  ];
}

/** Cards on the home page link to these same routes. */
export const SECTION_HREFS = [
  NAV_HREFS.whoWeAre,
  NAV_HREFS.whatWeDo,
  NAV_HREFS.events,
  NAV_HREFS.news,
];
