import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readEvents, writeEvents } from "@/lib/content";
import { sanitizeEvent } from "@/lib/validate";

/** `RouteContext` is a globally generated helper — do not import it. */
type Ctx = RouteContext<"/api/events/[id]">;

export async function PUT(request: NextRequest, context: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updated = sanitizeEvent({ ...(body as object), id });
  if (!updated) {
    return NextResponse.json(
      { error: "An event needs a title and a valid date (YYYY-MM-DD)." },
      { status: 400 },
    );
  }

  const events = await readEvents();
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  events[index] = updated;
  events.sort((a, b) => a.date.localeCompare(b.date));
  await writeEvents(events);

  return NextResponse.json(events);
}

export async function DELETE(_request: NextRequest, context: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const events = await readEvents();
  const next = events.filter((event) => event.id !== id);

  if (next.length === events.length) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  await writeEvents(next);
  return NextResponse.json(next);
}
