import { promises as fs } from "node:fs";
import path from "node:path";
import type { SchoolEvent, SiteContent } from "./types";

/**
 * Content lives in JSON files so the admin dashboard can persist edits
 * without needing a database. Pages that read this must opt out of static
 * prerendering, otherwise edits would only appear after a redeploy.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");
const SITE_FILE = path.join(CONTENT_DIR, "site.json");
const EVENTS_FILE = path.join(CONTENT_DIR, "events.json");

export async function readSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(SITE_FILE, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  await writeJson(SITE_FILE, content);
}

export async function readEvents(): Promise<SchoolEvent[]> {
  const raw = await fs.readFile(EVENTS_FILE, "utf8");
  const events = JSON.parse(raw) as SchoolEvent[];
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

export async function writeEvents(events: SchoolEvent[]): Promise<void> {
  await writeJson(EVENTS_FILE, events);
}

export function createEventId(): string {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(tmp, filePath);
}
