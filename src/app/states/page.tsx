import type { Metadata } from "next";
import Link from "next/link";
import { STATES, ID_LABEL, MAIL_LABEL } from "@/data/states";

export const metadata: Metadata = {
  title: "Voting rules for all 50 states and DC, 2026 midterms",
  description: "Registration deadlines, same-day registration, voter ID rules, early voting and mail ballot deadlines for every US state and DC in the November 3, 2026 election, with official links.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8">
      <h1 className="mt-6 text-4xl sm:text-6xl">Voting rules by state</h1>
      <p className="mt-4 max-w-2xl text-ink-2">Every state plus DC for the November 3, 2026 midterm. Click a state for the full page with official links.</p>
      <div className="card mt-8 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-ink-2">
            <tr className="border-b border-line">
              <th className="p-3 font-medium">State</th>
              <th className="p-3 font-medium">Registration deadline</th>
              <th className="p-3 font-medium">Same-day</th>
              <th className="p-3 font-medium">ID at the polls</th>
              <th className="p-3 font-medium">Mail voting</th>
              <th className="p-3 font-medium">Mail ballot must be</th>
            </tr>
          </thead>
          <tbody>
            {STATES.map((s) => (
              <tr key={s.slug} className="border-b border-line last:border-0 hover:bg-surface-2">
                <th scope="row" className="p-3 text-left font-semibold"><Link href={`/states/${s.slug}`} className="font-semibold text-accent hover:underline">{s.name}</Link></th>
                <td className="p-3">{s.regDate}</td>
                <td className="p-3">{s.sameDay ? "Yes" : "No"}</td>
                <td className="p-3">{ID_LABEL[s.idRule]}</td>
                <td className="p-3">{MAIL_LABEL[s.mail]}</td>
                <td className="p-3">{s.mailDeadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
