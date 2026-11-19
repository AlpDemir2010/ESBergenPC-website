import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { isAuthenticated } from "@/lib/auth";
import { readSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  const { site } = await readSiteContent();

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue-50 via-white to-brand-yellow-100/40"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-600 text-base font-black text-white"
          >
            PC
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-brand-yellow-400 ring-2 ring-white" />
          </span>
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
            {site.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to edit the website</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="text-slate-500 transition-colors hover:text-brand-blue-600"
          >
            ← Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
