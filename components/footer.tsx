import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import type { FooterContent } from "@/lib/types";
import type { NavItem } from "@/lib/nav";

type FooterProps = {
  content: FooterContent;
  items: NavItem[];
  siteName: string;
};

export function Footer({ content, items, siteName }: FooterProps) {
  return (
    <footer className="mt-auto bg-brand-navy text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-yellow-400 text-sm font-black text-brand-navy"
            >
              PC
            </span>
            <span className="text-base font-semibold">{siteName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-blue-100/75">
            Whats up
          </p>
        </div>

        <nav aria-label={content.exploreHeading}>
          <h2 className="text-sm font-semibold text-brand-yellow-300">
            {content.exploreHeading}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-blue-100/80 transition-colors hover:text-brand-yellow-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-brand-yellow-300">
            {content.contactHeading}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-blue-100/80">
            {content.contact.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-brand-blue-100/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {siteName}. {content.copyright}
          </p>
          <div className="flex items-center gap-4">
            <span>{content.tagline}</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-brand-blue-100/45 transition-colors hover:text-brand-yellow-300"
            >
              <LockKeyhole aria-hidden="true" className="h-3 w-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
