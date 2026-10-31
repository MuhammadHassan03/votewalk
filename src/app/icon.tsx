import { ImageResponse } from "next/og";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: 64, height: 64, background: "#0e5e6f", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 30, height: 30, background: "#e0a526", borderRadius: 4, display: "flex" }}><div style={{ width: 14, height: 14, margin: "auto", background: "#16212b", borderRadius: 2 }} /></div>
    </div>,
    size
  );
}
