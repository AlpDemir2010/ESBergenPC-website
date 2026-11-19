"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge, BadgeVariant, Card, CardContent } from "@/components/ui";
import type { SchoolEvent } from "@/lib/types";
import {
  formatLongDate,
  isSameDay,
  monthGrid,
  monthLabel,
  toISO,
  today,
  weekdayLabels,
} from "@/lib/dates";

const CATEGORY_VARIANT: Record<SchoolEvent["category"], BadgeVariant> = {
  Assembly: "blue",
  Fundraiser: "yellow",
  Social: "yellow",
  Meeting: "neutral",
  Sport: "blue",
  Trip: "neutral",
  Other: "neutral",
};

type Props = {
  events: SchoolEvent[];
  emptyDay: string;
  emptyAll: string;
};

export function EventCalendar({ events, emptyDay, emptyAll }: Props) {
  const now = today();
  const [cursor, setCursor] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth(),
  }));
  const [selected, setSelected] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, SchoolEvent[]>();
    for (const event of events) {
      const list = map.get(event.date);
      if (list) list.push(event);
      else map.set(event.date, [event]);
    }
    return map;
  }, [events]);

  const rows = useMemo(
    () => monthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  const visibleEvents = useMemo(() => {
    if (selected) return byDate.get(selected) ?? [];
    // No day picked: show everything from today onwards.
    const iso = toISO(now);
    return events.filter((event) => event.date >= iso).slice(0, 8);
  }, [selected, byDate, events, now]);

  const moveMonth = (delta: number) => {
    setSelected(null);
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const goToday = () => {
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    setSelected(null);
  };

  const selectDay = (day: Date) => {
    const iso = toISO(day);
    if (day.getMonth() !== cursor.month) {
      setCursor({ year: day.getFullYear(), month: day.getMonth() });
    }
    setSelected(iso);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
      {/* ------------------------------------------------------------ Grid */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">
              {monthLabel(cursor.year, cursor.month)}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goToday}
              className="mr-1 h-9 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </button>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </button>
          </div>
        </div>

        <div className="px-3 pb-4 pt-3">
          <div className="grid grid-cols-7 gap-1 px-1 pb-2">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                {label.slice(0, 3)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {rows.flat().map((day) => {
              const iso = toISO(day);
              const dayEvents = byDate.get(iso);
              const inMonth = day.getMonth() === cursor.month;
              const isSelected = selected === iso;
              const isToday = isSameDay(day, now);

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => selectDay(day)}
                  aria-pressed={isSelected}
                  aria-label={`${formatLongDate(iso)}${
                    dayEvents ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""
                  }`}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition-colors",
                    inMonth ? "text-slate-700" : "text-slate-300",
                    !isSelected && "hover:bg-slate-100",
                    isSelected && "bg-brand-blue-600 font-semibold text-white hover:bg-brand-blue-600",
                    isToday && !isSelected && "bg-brand-blue-50 font-semibold text-brand-blue-700",
                  )}
                >
                  <span>{day.getDate()}</span>

                  {dayEvents && (
                    <span className="flex items-center gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isSelected
                              ? "bg-brand-yellow-300"
                              : "bg-brand-blue-500",
                          )}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------------- List */}
      <Card>
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {selected ? formatLongDate(selected) : "Upcoming events"}
          </h2>
          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-sm font-medium text-brand-blue-600 transition-colors hover:text-brand-blue-800"
            >
              Show all
            </button>
          )}
        </div>

        <CardContent className="p-0">
          {visibleEvents.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Sparkles aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="max-w-xs text-sm text-slate-600">
                {selected ? emptyDay : emptyAll}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleEvents.map((event) => (
                <li
                  key={event.id}
                  className={cn(
                    "px-5 py-4 transition-colors hover:bg-slate-50",
                    selected === event.date && "bg-brand-blue-50/50",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">{event.title}</h3>
                    <Badge variant={CATEGORY_VARIANT[event.category]}>
                      {event.category}
                    </Badge>
                  </div>

                  {event.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {event.time && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                        {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    )}
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
