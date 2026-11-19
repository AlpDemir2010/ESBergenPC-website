import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { readSiteContent } from "@/lib/content";
import { buildNavItems } from "@/lib/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The shell is dynamic so edits made in the admin dashboard appear
 * immediately rather than waiting for a rebuild.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await readSiteContent();
  return {
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: `The official website of the ${site.name} — the elected PC representing every pupil in ESB.`,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await readSiteContent();
  const items = buildNavItems(content.nav);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header
          siteName={content.site.name}
          tagline={content.site.tagline}
          items={items}
        />
        <main className="flex-1">{children}</main>
        <Footer
          content={content.footer}
          items={items}
          siteName={content.site.name}
        />
      </body>
    </html>
  );
}
