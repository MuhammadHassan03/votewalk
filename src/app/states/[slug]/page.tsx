import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATES, getState, ID_LABEL, ID_EXPLAIN, MAIL_LABEL } from "@/data/states";
import { SITE } from "@/data/content";

export const dynamicParams = false;
export function generateStaticParams() { return STATES.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) return {};
  const title = `How to vote in ${s.name} in the 2026 midterm election`;
  const description = `${s.name} voting guide for November 3, 2026: registration deadline ${s.regDate}, ${s.sameDay ? "same-day registration available" : "no same-day registration"}, ${ID_LABEL[s.idRule].toLowerCase()}, mail ballot ${s.mailDeadline.toLowerCase()}. Official links included.`;
  return { title, description, alternates: { canonical: `/states/${s.slug}` }, openGraph: { title, description, url: `${SITE.url}/states/${s.slug}` } };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) notFound();

  const faqs = [
    { q: `When is the voter registration deadline in ${s.name} for the 2026 election?`, a: `${s.regDate} (${s.regRule}).${s.regDateNote ? ` ${s.regDateNote}.` : ""} ${s.sameDay ? `Same-day registration: ${s.sameDay}.` : "There is no same-day registration, so you must already be registered to vote on November 3."}` },
    { q: `Do I need ID to vote in ${s.name}?`, a: `${ID_LABEL[s.idRule]}. ${ID_EXPLAIN[s.idRule]}${s.idNote ? ` ${s.idNote}` : ""}` },
    { q: `Can I vote early in ${s.name}?`, a: `Early in-person voting: ${s.earlyVoting}.` },
    { q: `Can I vote by mail in ${s.name}, and when must my ballot arrive?`, a: `${MAIL_LABEL[s.mail]}. Your mail ballot must be ${s.mailDeadline.toLowerCase()}. If you still hold a ballot on Election Day, return it in person or at an official drop box.` },
  ];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "VoteWalk", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "States", item: `${SITE.url}/states` },
        { "@type": "ListItem", position: 3, name: s.name, item: `${SITE.url}/states/${s.slug}` },
      ] },
    ],
  };

  const i = STATES.findIndex((x) => x.slug === s.slug);
  const prev = STATES[(i - 1 + STATES.length) % STATES.length];
  const next = STATES[(i + 1) % STATES.length];

  return (
    <article className="mx-auto max-w-4xl px-5 sm:px-8">
      <nav aria-label="Breadcrumb" className="mt-4 text-sm text-ink-2"><Link href="/" className="hover:text-teal">VoteWalk</Link> / <Link href="/states" className="hover:text-teal">States</Link> / {s.name}</nav>
      <h1 className="mt-3 text-4xl sm:text-6xl">How to vote in {s.name}</h1>
      <p className="mt-3 text-lg text-ink-2">November 3, 2026 midterm election. Every fact below links to {s.name}'s official election office.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={s.site} target="_blank" rel="noopener" className="btn">{s.name} election office</a>
        <a href="https://vote.gov" target="_blank" rel="noopener" className="btn btn-quiet">Check my registration</a>
        <Link href={`/?state=${s.slug}`} className="btn btn-quiet">Walk the 3D polling place</Link>
      </div>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="card p-5"><dt className="text-sm text-ink-2">Registration deadline</dt><dd className="display mt-1 text-2xl font-semibold">{s.regDate}</dd><dd className="mt-1 text-sm text-ink-2">{s.regRule}{s.regDateNote ? `. ${s.regDateNote}` : ""}</dd></div>
        <div className="card p-5"><dt className="text-sm text-ink-2">Same-day registration</dt><dd className="display mt-1 text-2xl font-semibold">{s.sameDay ? "Yes" : "No"}</dd><dd className="mt-1 text-sm text-ink-2">{s.sameDay ?? "You must already be registered."}</dd></div>
        <div className="card p-5"><dt className="text-sm text-ink-2">ID at the polls</dt><dd className="display mt-1 text-2xl font-semibold">{ID_LABEL[s.idRule]}</dd><dd className="mt-1 text-sm text-ink-2">{ID_EXPLAIN[s.idRule]} {s.idNote}</dd></div>
        <div className="card p-5"><dt className="text-sm text-ink-2">Early in-person voting</dt><dd className="display mt-1 text-2xl font-semibold">{/^Yes/.test(s.earlyVoting) || /Oct|In person/.test(s.earlyVoting) ? "Available" : "Excuse required"}</dd><dd className="mt-1 text-sm text-ink-2">{s.earlyVoting}</dd></div>
        <div className="card p-5"><dt className="text-sm text-ink-2">Mail voting</dt><dd className="display mt-1 text-2xl font-semibold">{MAIL_LABEL[s.mail]}</dd><dd className="mt-1 text-sm"><a href={s.mailPage} target="_blank" rel="noopener" className="text-teal underline underline-offset-4">Official mail voting page</a></dd></div>
        <div className="card p-5 bg-mustard-soft"><dt className="text-sm text-ink-2">Mail ballot must be</dt><dd className="display mt-1 text-2xl font-semibold">{s.mailDeadline}</dd><dd className="mt-1 text-sm text-ink-2">Still holding a ballot? Use a drop box or return it in person.</dd></div>
      </dl>

      {s.unverified && (
        <p className="mt-6 rounded-xl border border-line bg-paper p-4 text-sm text-ink-2">Not yet confirmed against {s.name}'s official site: {s.unverified.join("; ")}. Treat these as a prompt to check the official page, not as settled fact.</p>
      )}

      <section className="mt-12" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-3xl">Common questions about voting in {s.name}</h2>
        <div className="mt-5 divide-y divide-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none text-lg font-semibold marker:content-none">{f.q}</summary>
              <p className="mt-2 text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 card p-6">
        <h2 className="text-2xl">Rules that are the same everywhere</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>If you are in line when polls close, stay in line. You can still vote.</li>
          <li>If your name is not on the list, you can cast a provisional ballot. That is a federal right under the Help America Vote Act.</li>
          <li>Every polling place must have an accessible voting machine, and you may bring a helper of your choice (not your employer or union agent).</li>
          <li>Problems or intimidation: Department of Justice 1-800-253-3931. Nonpartisan legal help: 866-OUR-VOTE.</li>
        </ul>
      </section>

      <nav className="mt-10 flex justify-between text-sm" aria-label="Other states">
        <Link href={`/states/${prev.slug}`} className="text-teal hover:underline">{prev.name}</Link>
        <Link href={`/states/${next.slug}`} className="text-teal hover:underline">{next.name}</Link>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </article>
  );
}
