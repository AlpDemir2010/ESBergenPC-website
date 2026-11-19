import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/admin/dashboard";
import { isAuthenticated } from "@/lib/auth";
import { readEvents, readSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [content, events] = await Promise.all([
    readSiteContent(),
    readEvents(),
  ]);

  return <Dashboard content={content} events={events} />;
}
