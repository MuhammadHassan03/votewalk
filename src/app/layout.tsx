import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/public-sans";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/data/content";


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "VoteWalk: How to vote in the 2026 US midterm election, step by step", template: "%s | VoteWalk" },
  description: SITE.description,
  keywords: ["how to vote", "how to vote 2026", "midterm election 2026", "voter registration deadline", "voter ID by state", "early voting 2026", "mail in ballot deadline", "polling place", "vote.gov", "November 3 2026"],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, title: "VoteWalk: How to vote in the 2026 midterms", description: SITE.tagline, url: SITE.url, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "VoteWalk" }] },
  twitter: { card: "summary_large_image", title: "VoteWalk: How to vote in the 2026 midterms", description: SITE.tagline },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  category: "government",
};

export const viewport: Viewport = { themeColor: "#e9eef2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE.url}#website`, url: SITE.url, name: SITE.name, description: SITE.description, inLanguage: "en-US" },
      { "@type": "Organization", "@id": `${SITE.url}#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon` },
      { "@type": "Event", name: "United States general election 2026 (midterms)", startDate: SITE.electionDate, eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Country", name: "United States" }, description: "Election Day for all 435 US House seats, 35 US Senate seats and 36 governorships.", organizer: { "@type": "GovernmentOrganization", name: "State and local election officials", url: "https://www.usa.gov/election-office" } },
    ],
  };
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn">Skip to content</a>
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="display text-2xl font-bold tracking-tight" aria-label="VoteWalk home">
            Vote<span className="text-teal">Walk</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-5 text-sm font-medium">
            <Link href="/#walk" className="hover:text-teal">Walkthrough</Link>
            <Link href="/states" className="hover:text-teal">All states</Link>
            <Link href="/#faq" className="hover:text-teal">Questions</Link>
            <a href="https://vote.gov" target="_blank" rel="noopener" className="btn hidden sm:inline-flex !py-2">Check registration</a>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="mx-auto mt-20 max-w-7xl border-t border-line px-5 py-10 text-sm text-ink-2 sm:px-8">
          <p className="max-w-3xl">
            VoteWalk is a nonpartisan guide compiled from vote.gov, USA.gov, the US Election Assistance Commission, the Federal Voting Assistance Program, the National Conference of State Legislatures, the Center for Election Innovation &amp; Research and each state's election office. Rules can change close to an election; your state's official site is the final word. Last reviewed October 31, 2026.
          </p>
          <p className="mt-4">Election Day is Tuesday, November 3, 2026. Problems at the polls: DOJ 1-800-253-3931. Nonpartisan help: 866-OUR-VOTE.</p>
        </footer>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </body>
    </html>
  );
}
