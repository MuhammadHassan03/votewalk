import Link from "next/link";
import Walkthrough from "@/components/Walkthrough";
import { STATIONS, HOTLINES, KEY_DATES, SITE } from "@/data/content";
import { STATES, stateStats } from "@/data/states";

const Check = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0 text-accent"><path d="M20 6L9 17l-5-5" /></svg>
);

export default function Home() {
  const st = stateStats();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STATIONS.map((s) => ({ "@type": "Question", name: s.question, acceptedAnswer: { "@type": "Answer", text: s.summary } })),
  };
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to vote in the November 3, 2026 US midterm election",
    description: SITE.description,
    image: `${SITE.url}/opengraph-image`,
    totalTime: "PT20M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    step: STATIONS.slice(0, 7).map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.summary, url: `${SITE.url}/#${s.id}` })),
  };

  return (
    <>
      <section className="hero-grid border-b border-line">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-5 pb-12 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-3 py-1.5 text-sm font-bold text-ink">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />Election Day is Tuesday, November 3, 2026
            </p>
            <h1 className="mt-5 max-w-3xl text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">How to vote, one station at a time.</h1>
            <p className="mt-5 max-w-xl text-lg text-ink-2">Walk through a polling place and see exactly what happens at each stop, with the rules for your state and a link to the official page for every fact. Nonpartisan, built from government sources.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#walk" className="btn btn-primary">Start the walk</a>
              <Link href="/states" className="btn btn-ghost">Find my state's rules</Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              [`${st.sameDay - 1}`, "states plus DC let you register and vote the same day"],
              [`${st.noId - 1}`, "states plus DC need no ID from most voters"],
              [`${st.allMail - 1}`, "states plus DC mail every voter a ballot"],
              [`${st.receivedByED}`, "states need your mail ballot in hand by Nov 3"],
            ].map(([n, l]) => (
              <div key={l} className="card p-5">
                <dt className="sr-only">{l}</dt>
                <dd className="display text-4xl font-bold">{n}</dd>
                <dd className="mt-1 text-sm text-ink-2">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="pt-12">
        <Walkthrough />
      </div>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8" aria-labelledby="steps-h">
        <div className="max-w-2xl">
          <h2 id="steps-h" className="text-3xl sm:text-4xl">The whole walk, in writing</h2>
          <p className="mt-2 text-ink-2">Same eight stops, with sources. Each heading is the question people actually type into a search box.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {STATIONS.map((s, i) => (
            <article key={s.id} id={s.id} className="card prose-walk p-6 scroll-mt-24">
              <p className="text-sm font-bold text-accent">Stop {i + 1}</p>
              <h3 className="mt-1 text-xl">{s.question}</h3>
              <p className="mt-3">{s.summary}</p>
              <ul className="mt-4 space-y-2 text-[0.95rem]">{s.points.map((p) => <li key={p} className="flex gap-2"><Check />{p}</li>)}</ul>
              <p className="mt-4 text-sm text-ink-2">Sources: {s.sources.map((src, j) => (<span key={src.url}>{j > 0 && ", "}<a href={src.url} target="_blank" rel="noopener">{src.label}</a></span>))}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8" aria-labelledby="dates-h">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 id="dates-h" className="text-2xl">Key 2026 dates</h2>
            <ol className="mt-4 divide-y divide-line">
              {KEY_DATES.map((d) => (
                <li key={d.what} className="flex gap-5 py-3"><time className="display w-24 shrink-0 font-bold">{d.date}</time><span className="text-ink-2">{d.what}</span></li>
              ))}
            </ol>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl">Who to call</h2>
            <ul className="mt-4 divide-y divide-line">
              {HOTLINES.map((h) => (
                <li key={h.name} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="text-ink-2">{h.name}</span>
                  <a href={`tel:${h.number.replace(/[^0-9]/g, "")}`} className="display whitespace-nowrap font-bold text-accent">{h.number}</a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-3">Threats or violence at a polling place: call 911 first.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto mt-24 max-w-7xl px-5 sm:px-8 scroll-mt-24" aria-labelledby="states-h">
        <h2 id="states-h" className="text-3xl">Rules by state</h2>
        <p className="mt-2 max-w-2xl text-ink-2">Deadlines, ID rules, early voting, mail ballot deadlines and the official link for every state and DC.</p>
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {STATES.map((s) => (
            <li key={s.slug}><Link href={`/states/${s.slug}`} className="block rounded-lg px-3 py-2 font-semibold hover:bg-surface-2">{s.name}</Link></li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
    </>
  );
}
