# VoteWalk

Every step to the ballot, for your state.

VoteWalk is a nonpartisan guide to voting in the November 3, 2026 US midterm election. It walks a voter through a low-poly 3D polling place, station by station: eligibility, registration, ID, early / mail / Election Day voting, marking the ballot, accessibility rights, getting help, and voting from abroad. A state picker swaps in the rules for all 50 states plus DC, and every fact links to the official state or federal source.

## Stack

- Next.js 15 (App Router, fully static output: 60 pre-rendered pages)
- React Three Fiber + drei for the 3D scene (demand-rendered, capped pixel ratio, no runtime font or CDN requests)
- Tailwind CSS 4
- Self-hosted fonts: Bricolage Grotesque (display) and Public Sans (body, the US government's typeface)

## SEO / AEO

- Server-rendered text for every stop and every state, so crawlers never need WebGL
- JSON-LD: WebSite, Organization, Event, HowTo, FAQPage (home and each state page), BreadcrumbList
- Per-state pages at `/states/<slug>` with question-shaped headings
- `sitemap.xml`, `robots.txt`, OpenGraph image, canonical URLs
- Set `NEXT_PUBLIC_SITE_URL` to the production domain and `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for Search Console

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Data

`src/data/states.ts` holds the 51-row dataset (registration deadline, same-day registration, voter ID category, early voting, mail voting, mail ballot receipt deadline, official URLs). Items that could not be confirmed on an official site are flagged in each row's `unverified` array and surfaced in the UI. Sources: vote.gov, USA.gov, EAC, FVAP, NCSL, CEIR, and state election offices. Last reviewed October 31, 2026.
