"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui";
import type { SchoolEvent, SiteContent } from "@/lib/types";
import { ContentEditor } from "./content-editor";
import { EventsManager } from "./events-manager";

type Tab = "content" | "events";

export function Dashboard({
  content,
  events,
}: {
  content: SiteContent;
  events: SchoolEvent[];
}) {
  const [tab, setTab] = useState<Tab>("content");
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Editing the live site as {content.site.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            View site
          </Link>
          <Button variant="outline" onClick={logout} disabled={loggingOut}>
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Dashboard sections"
        className="mt-8 inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-card"
      >
        <TabButton
          active={tab === "content"}
          onClick={() => setTab("content")}
          label="Site text"
        />
        <TabButton
          active={tab === "events"}
          onClick={() => setTab("events")}
          label="Events"
        />
      </div>

      <div className="mt-6">
        {tab === "content" ? (
          <ContentEditor content={content} />
        ) : (
          <EventsManager initialEvents={events} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-blue-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100",
      )}
    >
      {label}
    </button>
  );
}
