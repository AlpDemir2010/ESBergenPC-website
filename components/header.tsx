import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { SiteNav } from "./site-nav";
import type { NavItem } from "@/lib/nav";

type HeaderProps = {
  siteName: string;
  tagline: string;
  items: NavItem[];
};

export function Header({ siteName, tagline, items }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden="true"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-600 text-sm font-black tracking-tight text-white transition-transform group-hover:scale-105"
          >
            PC
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-yellow-400 ring-2 ring-white" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold text-slate-900">
              {siteName}
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-brand-blue-600">
              {tagline}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <SiteNav items={items} />
          <Link
            href="/admin"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-blue-700 sm:inline-flex"
          >
            <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Admin dashboard</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
