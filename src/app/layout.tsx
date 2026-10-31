import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/data/content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "VoteWalk: How to vote in the 2026 US midterm election, step by step", template: "%s | VoteWalk" },
  description: SITE.description,
  keywords: ["how to vote", "how to vote 2026", "midterm election 2026", "voter registration deadline", "voter ID by state", "early voting 2026", "mail in ballot deadline", "polling place", "vote.gov", "November 3 2026"],
  applicationName: SITE.name,
  authors: [{ name: "Muhammad Hassan", url: "https://github.com/MuhammadHassan03" }],
  creator: "Muhammad Hassan",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, title: "VoteWalk: How to vote in the 2026 midterms", description: SITE.tagline, url: SITE.url, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "VoteWalk" }] },
  twitter: { card: "summary_large_image", title: "VoteWalk: How to vote in the 2026 midterms", description: SITE.tagline, creator: "@mirza_hassan07" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  category: "government",
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f6f7f9" }, { media: "(prefers-color-scheme: dark)", color: "#0b1220" }], width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE.url}#website`, url: SITE.url, name: SITE.name, description: SITE.description, inLanguage: "en-US", publisher: { "@id": `${SITE.url}#org` } },
      { "@type": "Organization", "@id": `${SITE.url}#org`, name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/icon` }, founder: { "@type": "Person", name: "Muhammad Hassan", url: "https://github.com/MuhammadHassan03", sameAs: ["https://x.com/mirza_hassan07"] } },
      {
        "@type": "Event",
        name: "United States general election 2026 (midterms)",
        description: "Election Day for all 435 US House seats, 35 US Senate seats and 36 governorships. Polls generally open between 6 and 8 a.m. and close between 6 and 9 p.m. local time.",
        startDate: "2026-11-03T06:00:00-05:00",
        endDate: "2026-11-03T21:00:00-10:00",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: [`${SITE.url}/opengraph-image`],
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://vote.gov", validFrom: "2026-09-18" },
        location: { "@type": "Place", name: "Your assigned polling place", address: { "@type": "PostalAddress", addressCountry: "US" } },
        performer: { "@type": "Organization", name: "Registered voters of the United States" },
        organizer: { "@type": "GovernmentOrganization", name: "State and local election officials", url: "https://www.usa.gov/election-office" },
      },
    ],
  };
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn btn-dark">Skip to content</a>
        <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="display flex items-center gap-2 text-xl font-bold tracking-tight" aria-label="VoteWalk home">
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden><rect width="28" height="28" rx="7" fill="var(--navy)" /><path d="M8 14.5l4 4 8-9" fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              VoteWalk
            </Link>
            <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2 text-sm font-semibold">
              <Link href="/#walk" className="hidden rounded-lg px-3 py-2 hover:bg-surface-2 sm:inline-block">Walkthrough</Link>
              <Link href="/states" className="rounded-lg px-3 py-2 hover:bg-surface-2">States</Link>
              <Link href="/#faq" className="hidden rounded-lg px-3 py-2 hover:bg-surface-2 md:inline-block">Questions</Link>
              <a href="https://vote.gov" target="_blank" rel="noopener" className="btn btn-primary btn-sm ml-1">Check registration</a>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="mt-24 border-t border-line bg-surface">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="display text-lg font-bold">VoteWalk</p>
              <p className="mt-2 max-w-md text-sm text-ink-2">A nonpartisan guide compiled from vote.gov, USA.gov, the US Election Assistance Commission, the Federal Voting Assistance Program, the National Conference of State Legislatures, the Center for Election Innovation &amp; Research and each state's election office. Rules can change close to an election; your state's official site is the final word. Last reviewed October 31, 2026.</p>
            </div>
            <div className="text-sm">
              <p className="font-bold">Need help right now</p>
              <ul className="mt-2 space-y-1 text-ink-2">
                <li>DOJ voting rights: <a className="font-semibold text-ink" href="tel:18002533931">1-800-253-3931</a></li>
                <li>Election Protection: <a className="font-semibold text-ink" href="tel:18666878683">866-OUR-VOTE</a></li>
                <li>ADA information: <a className="font-semibold text-ink" href="tel:18005140301">800-514-0301</a></li>
                <li>Emergency: call 911</li>
              </ul>
            </div>
            <div className="text-sm">
              <p className="font-bold">Credits</p>
              <p className="mt-2 text-ink-2">Designed and built by <a className="font-semibold text-ink underline underline-offset-4" href="https://github.com/MuhammadHassan03" target="_blank" rel="noopener">Muhammad Hassan</a>, full stack and accessibility engineer.</p>
              <ul className="mt-2 space-y-1 text-ink-2">
                <li><a className="underline underline-offset-4 hover:text-ink" href="https://x.com/mirza_hassan07" target="_blank" rel="noopener">@mirza_hassan07 on X</a></li>
                <li><a className="underline underline-offset-4 hover:text-ink" href="https://github.com/MuhammadHassan03/votewalk" target="_blank" rel="noopener">Source code on GitHub</a></li>
              </ul>
              <p className="mt-3 text-xs text-ink-3">Built with Next.js and React Three Fiber. Not affiliated with any government agency, party or campaign.</p>
            </div>
          </div>
        </footer>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </body>
    </html>
  );
}
