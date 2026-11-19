import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { readSiteContent, writeSiteContent } from "@/lib/content";
import { MAX_CONTENT_BYTES, sanitizeContent } from "@/lib/validate";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(await readSiteContent());
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const text = await request.text();
  if (text.length > MAX_CONTENT_BYTES) {
    return NextResponse.json({ error: "Content is too large." }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Content is not valid JSON." }, { status: 400 });
  }

  const content = sanitizeContent(parsed);
  if (!content) {
    return NextResponse.json({ error: "Content could not be read." }, { status: 400 });
  }

  await writeSiteContent(content);
  refreshPages();

  return NextResponse.json({ ok: true });
}

/** Clear the prerender cache so edits show up immediately on the public site. */
function refreshPages() {
  for (const path of ["/", "/who-we-are", "/what-we-do", "/events", "/news"]) {
    revalidatePath(path, "page");
  }
}
