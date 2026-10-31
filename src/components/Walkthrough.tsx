"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { STATES, ID_LABEL, ID_EXPLAIN, MAIL_LABEL, type StateInfo } from "@/data/states";
import { STATIONS } from "@/data/content";
import { STATION_IDS } from "./Scene";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-ink-2" role="status">
      <span className="animate-pulse">Opening the polling place…</span>
    </div>
  ),
});

function StateFacts({ s, station }: { s: StateInfo; station: string }) {
  if (station === "register")
    return (
      <dl className="mt-4 grid gap-3 text-[0.95rem]">
        <div className="rounded-xl bg-mustard-soft p-3">
          <dt className="font-semibold">Registration deadline in {s.name}</dt>
          <dd>
            {s.regDate} <span className="text-ink-2">({s.regRule})</span>
            {s.regDateNote && <span className="block text-sm text-ink-2">{s.regDateNote}.</span>}
          </dd>
        </div>
        <div className="rounded-xl bg-mint p-3">
          <dt className="font-semibold">Missed it? Same-day registration</dt>
          <dd>{s.sameDay ? s.sameDay : "Not offered. Check whether you are already registered; if not, you cannot vote in this election, but you can register for the next one."}</dd>
        </div>
      </dl>
    );
  if (station === "id")
    return (
      <div className="mt-4 rounded-xl bg-mustard-soft p-3 text-[0.95rem]">
        <p className="font-semibold">{s.name}: {ID_LABEL[s.idRule]}</p>
        <p className="mt-1">{ID_EXPLAIN[s.idRule]}</p>
        {s.idNote && <p className="mt-1 text-ink-2">{s.idNote}</p>}
      </div>
    );
  if (station === "ways")
    return (
      <dl className="mt-4 grid gap-3 text-[0.95rem] sm:grid-cols-3">
        <div className="rounded-xl bg-mint p-3"><dt className="font-semibold">Early in person</dt><dd>{s.earlyVoting}</dd></div>
        <div className="rounded-xl bg-mustard-soft p-3"><dt className="font-semibold">By mail</dt><dd>{MAIL_LABEL[s.mail]}</dd></div>
        <div className="rounded-xl bg-paper border border-line p-3"><dt className="font-semibold">Mail ballot must be</dt><dd>{s.mailDeadline}</dd></div>
      </dl>
    );
  return null;
}

export default function Walkthrough({ initialState = "california" }: { initialState?: string }) {
  const [idx, setIdx] = useState(0);
  const [slug, setSlug] = useState(initialState);
  const s = useMemo(() => STATES.find((x) => x.slug === slug) ?? STATES[0], [slug]);
  const station = STATIONS[idx];

  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("state");
      const saved = fromUrl || localStorage.getItem("votewalk-state");
      if (saved && STATES.some((x) => x.slug === saved)) setSlug(saved);
    } catch {}
  }, []);
  const pickState = useCallback((v: string) => {
    setSlug(v);
    try { localStorage.setItem("votewalk-state", v); } catch {}
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, STATION_IDS.length - 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="walk" aria-labelledby="walk-h" className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="walk-h" className="text-3xl sm:text-4xl">Walk through the polling place</h2>
        <label className="flex items-center gap-3 text-sm font-medium">
          Show rules for
          <select className="state" value={slug} onChange={(e) => pickState(e.target.value)} aria-label="Choose your state">
            {STATES.map((x) => (<option key={x.slug} value={x.slug}>{x.name}</option>))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_400px]">
        <div className="card relative h-[52vh] min-h-[340px] overflow-hidden lg:h-[600px]">
          <Scene index={idx} onPick={setIdx} />
          <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-ink-2">Drag to look around. Click a station or use the arrow keys.</p>
          <div className="absolute left-3 top-3 flex gap-2">
            <button className="btn !py-1.5 !px-3 text-sm" onClick={() => setIdx((i) => Math.max(i - 1, 0))} disabled={idx === 0} aria-label="Previous step">Back</button>
            <button className="btn !py-1.5 !px-3 text-sm" onClick={() => setIdx((i) => Math.min(i + 1, STATION_IDS.length - 1))} disabled={idx === STATION_IDS.length - 1} aria-label="Next step">Next step</button>
          </div>
        </div>

        <aside className="flex flex-col" aria-live="polite">
          <ol className="mb-4 flex flex-wrap gap-x-3 gap-y-2 text-sm" aria-label="Steps">
            {STATIONS.map((st, i) => (
              <li key={st.id}>
                <button onClick={() => setIdx(i)} aria-current={i === idx ? "step" : undefined} className={`flex items-center gap-1.5 rounded-full px-2 py-1 ${i === idx ? "bg-ink text-paper" : "hover:bg-mint"}`}>
                  <span className={`rail-dot ${i === idx ? "on" : i < idx ? "done" : ""}`} aria-hidden />
                  {st.short}
                </button>
              </li>
            ))}
          </ol>
          <article className="card flex-1 p-6">
            <p className="text-sm text-ink-2">Step {idx + 1} of {STATIONS.length}</p>
            <h3 className="mt-1 text-2xl">{station.title}</h3>
            <p className="mt-3">{station.summary}</p>
            <StateFacts s={s} station={station.id} />
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[0.95rem]">
              {station.points.map((p) => (<li key={p}>{p}</li>))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <a className="btn !py-2 text-sm" href={station.id === "ways" ? s.mailPage : s.site} target="_blank" rel="noopener">
                {s.name} official site
              </a>
              {station.sources.slice(0, 1).map((src) => (
                <a key={src.url} className="btn btn-quiet !py-2 text-sm" href={src.url} target="_blank" rel="noopener">{src.label}</a>
              ))}
            </div>
            {s.unverified && station.id !== "eligibility" && (
              <p className="mt-4 text-xs text-ink-2">Not yet confirmed on {s.name}'s official site: {s.unverified.join("; ")}. Check the link above.</p>
            )}
          </article>
        </aside>
      </div>
    </section>
  );
}
