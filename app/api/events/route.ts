import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createEventId, readEvents, writeEvents } from "@/lib/content";
import { sanitizeEvent } from "@/lib/validate";

export async function GET() {
  return NextResponse.json(await readEvents());
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const event = sanitizeEvent(body);
  if (!event) {
    return NextResponse.json(
      { error: "An event needs a title and a valid date (YYYY-MM-DD)." },
      { status: 400 },
    );
  }

  const events = await readEvents();
  events.push({ ...event, id: createEventId() });
  events.sort((a, b) => a.date.localeCompare(b.date));
  await writeEvents(events);

  return NextResponse.json(events, { status: 201 });
}
