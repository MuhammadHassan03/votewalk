import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VoteWalk: how to vote in the 2026 US midterm election";
export default function OG() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#f6f7f9", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, fontFamily: "sans-serif", color: "#16212b" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 800 }}>
        <div style={{ width: 56, height: 56, background: "#0f172a", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 26, height: 26, background: "#f5b82e", borderRadius: 4 }} />
        </div>
        VoteWalk
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1.0, letterSpacing: -2 }}>How to vote, one station at a time.</div>
        <div style={{ fontSize: 34, color: "#475569" }}>Nov 3, 2026 midterms. Your state's rules, official links, a 3D polling place.</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {["Register", "Bring ID", "Early / mail / Nov 3", "Mark ballot", "Get help"].map((t) => (
          <div key={t} style={{ background: "#c2410c", color: "#fff", padding: "12px 22px", borderRadius: 999, fontSize: 24 }}>{t}</div>
        ))}
      </div>
    </div>,
    size
  );
}
