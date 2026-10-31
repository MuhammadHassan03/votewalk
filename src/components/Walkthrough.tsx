"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { STATES, ID_LABEL, ID_EXPLAIN, MAIL_LABEL, type StateInfo } from "@/data/states";
import { STATIONS } from "@/data/content";
import { STATION_IDS } from "./Scene";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-ink-2" role="status">
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden className="animate-spin"><circle cx="20" cy="20" r="16" stroke="var(--line)" strokeWidth="4" fill="none" /><path d="M36 20a16 16 0 0 0-16-16" stroke="var(--accent)" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
      <span className="text-sm font-semibold">Opening the polling place</span>
    </div>
  ),
});

const Icon = ({ d, className = "" }: { d: string; className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}><path d={d} /></svg>
);
const I = { back: "M15 18l-6-6 6-6", next: "M9 6l6 6-6 6", ext: "M14 3h7v7M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5", pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", warn: "M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" };

function Fact({ label, value, sub, tone = "" }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className={`tile p-3.5 ${tone}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-ink-3">{label}</p>
      <p className="mt-1 font-bold leading-snug">{value}</p>
      {sub && <p className="mt-1 text-sm text-ink-2">{sub}</p>}
    </div>
  );
}

function StateFacts({ s, station }: { s: StateInfo; station: string }) {
  if (station === "register")
    return (
      <div className="mt-4 grid gap-3">
        <Fact label={`Deadline in ${s.abbr}`} value={s.regDate} sub={`${s.regRule}${s.regDateNote ? `. ${s.regDateNote}` : ""}`} tone="bg-gold-soft" />
        <Fact label="Same-day registration" value={s.sameDay ? "Available" : "Not offered"} sub={s.sameDay ?? "You must already be registered to vote in this election."} tone={s.sameDay ? "bg-green-soft" : ""} />
      </div>
    );
  if (station === "id")
    return (
      <div className="mt-4 grid gap-3">
        <Fact label={`${s.name} rule`} value={ID_LABEL[s.idRule]} sub={`${ID_EXPLAIN[s.idRule]}${s.idNote ? ` ${s.idNote}` : ""}`} tone="bg-gold-soft" />
      </div>
    );
  if (station === "ways")
    return (
      <div className="mt-4 grid gap-3">
        <Fact label="Early in person" value={/^Yes|Oct|In person|Available/.test(s.earlyVoting) ? "Available" : "Excuse needed"} sub={s.earlyVoting} tone="bg-green-soft" />
        <Fact label="By mail" value={MAIL_LABEL[s.mail]} tone="bg-sky-soft" />
        <Fact label="Mail ballot must be" value={s.mailDeadline} tone="bg-gold-soft" />
      </div>
    );
  return null;
}

function useCountdown() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date("2026-11-03T00:00:00-05:00").getTime();
    const tick = () => setDays(Math.max(0, Math.ceil((target - Date.now()) / 86400000)));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  return days;
}

export default function Walkthrough({ initialState = "california" }: { initialState?: string }) {
  const [idx, setIdx] = useState(0);
  const [slug, setSlug] = useState(initialState);
  const s = useMemo(() => STATES.find((x) => x.slug === slug) ?? STATES[0], [slug]);
  const station = STATIONS[idx];
  const days = useCountdown();

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
      if ((e.target as HTMLElement)?.tagName === "SELECT") return;
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, STATION_IDS.length - 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const last = idx === STATION_IDS.length - 1;

  return (
    <section id="walk" aria-labelledby="walk-h" className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="walk-h" className="text-3xl sm:text-4xl">Walk through the polling place</h2>
          <p className="mt-1 text-ink-2">Eight stops. Rules update for the state you pick.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {days !== null && (
            <span className="pill cursor-default" aria-live="off"><span className="n">{days}</span>{days === 1 ? "day" : "days"} to Election Day</span>
          )}
          <label className="flex items-center gap-2 text-sm font-semibold">
            <Icon d={I.pin} className="text-ink-3" />
            <span className="sr-only">Choose your state</span>
            <select className="state" value={slug} onChange={(e) => pickState(e.target.value)}>
              {STATES.map((x) => (<option key={x.slug} value={x.slug}>{x.name}</option>))}
            </select>
          </label>
        </div>
      </div>

      <ol className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" aria-label="Steps">
        {STATIONS.map((st, i) => (
          <li key={st.id} className="shrink-0">
            <button onClick={() => setIdx(i)} aria-current={i === idx ? "step" : undefined} className={`pill ${i < idx ? "done" : ""}`}>
              <span className="n">{i < idx ? "✓" : i + 1}</span>{st.short}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="card relative h-[54vh] min-h-[360px] overflow-hidden lg:h-[640px]">
          <Scene index={idx} onPick={setIdx} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/35 to-transparent p-4">
            <p className="text-xs font-semibold text-white/90">Drag to look around. Click any station or use arrow keys.</p>
            <div className="pointer-events-auto flex gap-2">
              <button className="btn btn-ghost btn-sm !bg-white !text-ink" onClick={() => setIdx((i) => Math.max(i - 1, 0))} disabled={idx === 0} aria-label="Previous step"><Icon d={I.back} /> Back</button>
              <button className="btn btn-primary btn-sm" onClick={() => setIdx((i) => Math.min(i + 1, STATION_IDS.length - 1))} disabled={last} aria-label="Next step">Next <Icon d={I.next} /></button>
            </div>
          </div>
        </div>

        <aside aria-live="polite" className="flex">
          <article key={station.id} className="card panel-enter flex w-full flex-col p-6">
            <p className="text-sm font-bold text-accent">Stop {idx + 1} of {STATIONS.length}</p>
            <h3 className="mt-1 text-2xl leading-tight">{station.title}</h3>
            <p className="mt-3 text-[1.02rem]">{station.summary}</p>
            <StateFacts s={s} station={station.id} />
            <ul className="mt-4 space-y-2 text-[0.95rem]">
              {station.points.map((p) => (
                <li key={p} className="flex gap-2.5"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{p}</li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <a className="btn btn-dark btn-sm" href={station.id === "ways" ? s.mailPage : s.site} target="_blank" rel="noopener">{s.name} official site <Icon d={I.ext} /></a>
              {station.sources.slice(0, 1).map((src) => (
                <a key={src.url} className="btn btn-ghost btn-sm" href={src.url} target="_blank" rel="noopener">{src.label}</a>
              ))}
            </div>
            {s.unverified && ["register", "id", "ways"].includes(station.id) && (
              <p className="mt-4 flex gap-2 rounded-lg bg-gold-soft p-3 text-xs text-ink-2"><Icon d={I.warn} className="mt-0.5 shrink-0 text-accent" /><span>Not yet confirmed on {s.name}'s official site: {s.unverified.join("; ")}. Check the link above.</span></p>
            )}
          </article>
        </aside>
      </div>
    </section>
  );
}
