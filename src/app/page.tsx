import Link from "next/link";
import Walkthrough from "@/components/Walkthrough";
import { STATIONS, HOTLINES, KEY_DATES, SITE } from "@/data/content";
import { STATES, stateStats } from "@/data/states";

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
    totalTime: "PT20M",
    step: STATIONS.slice(0, 7).map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.summary, url: `${SITE.url}/#${s.id}` })),
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-6 sm:px-8 sm:pt-12">
        <p className="text-sm font-medium text-teal">Midterm Election Day is Tuesday, November 3, 2026</p>
        <h1 className="mt-3 max-w-4xl text-5xl sm:text-7xl">How to vote, one station at a time.</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2">
          Walk through a polling place and see exactly what happens at each stop, with the rules for your state and a link to the official page for every fact. Nonpartisan, built from government sources.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#walk" className="btn">Start the walk</a>
          <Link href="/states" className="btn btn-quiet">Find my state's rules</Link>
        </div>
        <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4">
          {[
            [`${st.sameDay}`, "states plus DC let you register and vote the same day"],
            [`${st.noId - 1}+DC`, "states need no ID from most voters"],
            [`${st.allMail - 1}+DC`, "states mail every voter a ballot"],
            [`${st.receivedByED}`, "states need your mail ballot in hand by Nov 3"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="display text-4xl font-bold text-teal">{n}</dd>
              <dd className="mt-1 text-sm text-ink-2">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Walkthrough />

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8" aria-labelledby="steps-h">
        <h2 id="steps-h" className="text-3xl sm:text-4xl">The whole walk, in writing</h2>
        <p className="mt-2 max-w-2xl text-ink-2">The same eight stops, with sources. Each heading is the question people actually type into a search box.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {STATIONS.map((s, i) => (
            <article key={s.id} id={s.id} className="card p-6 prose-walk">
              <p className="text-sm text-ink-2">Stop {i + 1}</p>
              <h3 className="mt-1 text-xl">{s.question}</h3>
              <p className="mt-3">{s.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[0.95rem]">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <p className="mt-3 text-sm">Sources: {s.sources.map((src, j) => (<span key={src.url}>{j > 0 && ", "}<a href={src.url} target="_blank" rel="noopener">{src.label}</a></span>))}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8" aria-labelledby="dates-h">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="dates-h" className="text-3xl">Key 2026 dates</h2>
            <ol className="mt-5 divide-y divide-line">
              {KEY_DATES.map((d) => (
                <li key={d.what} className="flex gap-5 py-3"><time className="display w-24 shrink-0 font-semibold text-teal">{d.date}</time><span>{d.what}</span></li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-3xl">Who to call</h2>
            <ul className="mt-5 divide-y divide-line">
              {HOTLINES.map((h) => (
                <li key={h.name} className="flex items-baseline justify-between gap-4 py-3">
                  <span>{h.name}</span>
                  <a href={`tel:${h.number.replace(/[^0-9]/g, "")}`} className="display whitespace-nowrap font-semibold text-teal">{h.number}</a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-2">Threats or violence at a polling place: call 911 first.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto mt-20 max-w-7xl px-5 sm:px-8" aria-labelledby="states-h">
        <h2 id="states-h" className="text-3xl">Rules by state</h2>
        <p className="mt-2 max-w-2xl text-ink-2">Pick your state for deadlines, ID rules, early voting, mail ballot deadlines and the official link.</p>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
          {STATES.map((s) => (
            <li key={s.slug}><Link href={`/states/${s.slug}`} className="hover:text-teal hover:underline underline-offset-4">{s.name}</Link></li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
    </>
  );
}
