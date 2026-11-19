"use client";

import { useState } from "react";
import { CalendarPlus, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  Badge,
  BadgeVariant,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";
import { formatShortDate } from "@/lib/dates";
import type { EventCategory, SchoolEvent } from "@/lib/types";
import { EVENT_CATEGORIES } from "@/lib/types";

const CATEGORY_VARIANT: Record<EventCategory, BadgeVariant> = {
  Assembly: "blue",
  Fundraiser: "yellow",
  Social: "yellow",
  Meeting: "neutral",
  Sport: "blue",
  Trip: "neutral",
  Other: "neutral",
};

const BLANK: SchoolEvent = {
  id: "",
  title: "",
  date: "",
  time: "",
  location: "",
  category: "Other",
  description: "",
};

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "error"; message: string };

export function EventsManager({ initialEvents }: { initialEvents: SchoolEvent[] }) {
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [draft, setDraft] = useState<SchoolEvent | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setDraft({ ...BLANK, date: new Date().toISOString().slice(0, 10) });
    setStatus({ kind: "idle" });
  };

  const openEdit = (event: SchoolEvent) => {
    setDraft(event);
    setStatus({ kind: "idle" });
  };

  const cancel = () => {
    setDraft(null);
    setStatus({ kind: "idle" });
  };

  const updateDraft = (value: Partial<SchoolEvent>) => {
    setDraft((current) => (current ? { ...current, ...value } : current));
  };

  const submit = async () => {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "busy" });

    try {
      const creating = !draft.id;
      const response = await fetch(
        creating ? "/api/events" : `/api/events/${draft.id}`,
        {
          method: creating ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );

      const body = (await response.json().catch(() => null)) as
        | SchoolEvent[]
        | { error?: string }
        | null;

      if (!response.ok || !Array.isArray(body)) {
        throw new Error(
          (body && "error" in body && body.error) || `Request failed (${response.status})`,
        );
      }

      setEvents(body);
      setDraft(null);
      setStatus({ kind: "idle" });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (event: SchoolEvent) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;

    setStatus({ kind: "busy" });
    try {
      const response = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      const body = (await response.json().catch(() => null)) as
        | SchoolEvent[]
        | { error?: string }
        | null;

      if (!response.ok || !Array.isArray(body)) {
        throw new Error(
          (body && "error" in body && body.error) || `Request failed (${response.status})`,
        );
      }

      setEvents(body);
      setStatus({ kind: "idle" });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {status.kind === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {status.message}
        </div>
      )}

      {draft ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{draft.id ? "Edit event" : "New event"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={cancel}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ev-title">Title</Label>
              <Input
                id="ev-title"
                value={draft.title}
                placeholder="Bake sale"
                onChange={(event) => updateDraft({ title: event.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="ev-date">Date</Label>
                <Input
                  id="ev-date"
                  type="date"
                  value={draft.date}
                  onChange={(event) => updateDraft({ date: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ev-time">Time</Label>
                <Input
                  id="ev-time"
                  value={draft.time}
                  placeholder="16:00 – 19:00"
                  onChange={(event) => updateDraft({ time: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ev-location">Location</Label>
                <Input
                  id="ev-location"
                  value={draft.location}
                  placeholder="Aula"
                  onChange={(event) => updateDraft({ location: event.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ev-category">Category</Label>
              <Select
                id="ev-category"
                value={draft.category}
                onChange={(event) =>
                  updateDraft({ category: event.target.value as EventCategory })
                }
              >
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="ev-description">Description</Label>
              <Textarea
                id="ev-description"
                rows={3}
                value={draft.description}
                onChange={(event) => updateDraft({ description: event.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button onClick={submit} disabled={saving || !draft.title || !draft.date}>
                {saving && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                {draft.id ? "Save event" : "Create event"}
              </Button>
              <Button variant="ghost" onClick={cancel} disabled={saving}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {events.length} event{events.length === 1 ? "" : "s"} published.
          </p>
          <Button onClick={openNew}>
            <CalendarPlus aria-hidden="true" className="h-4 w-4" />
            New event
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-500">
              No events yet. Use “New event” to add the first one.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-slate-900">{event.title}</p>
                      <Badge variant={CATEGORY_VARIANT[event.category]}>
                        {event.category}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatShortDate(event.date)}
                      {event.time && ` · ${event.time}`}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(event)}>
                      <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => remove(event)}>
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
