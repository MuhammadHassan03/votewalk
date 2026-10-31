"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text as DreiText, ContactShadows, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const FONT = "/fonts/label.woff";
const Text = (props: React.ComponentProps<typeof DreiText>) => <DreiText font={FONT} {...props} />;

const C = {
  floorA: "#d9dee5",
  floorB: "#cfd6de",
  wall: "#eef1f5",
  wallLow: "#1e293b",
  trim: "#f8fafc",
  wood: "#c8a37a",
  woodDark: "#8f6a45",
  navy: "#0f172a",
  navy2: "#1e293b",
  slate: "#64748b",
  gold: "#f5b82e",
  rust: "#c2410c",
  paper: "#fbfcfd",
  cream: "#f3ead6",
  sky: "#9cc9ef",
  green: "#2f9e6e",
  curtain: "#1e3a5f",
  skin1: "#e7c3a1",
  skin2: "#b9825a",
  skin3: "#7a4b2b",
  hair1: "#2b1d14",
  hair2: "#6b4a2b",
  hair3: "#d9d2c5",
  chrome: "#94a3b8",
  glass: "#dbeafe",
};

export const STATION_IDS = ["eligibility", "register", "id", "ways", "ballot", "access", "help", "overseas"] as const;
export type StationId = (typeof STATION_IDS)[number];
const SPACING = 7;
export const stationX = (i: number) => i * SPACING;
const N = STATION_IDS.length;
const ROOM_LEN = SPACING * N + 8;
const ROOM_CX = stationX(N - 1) / 2;
const WALL_Z = -4;

/* ---------- shared bits ---------- */

function Box({ p, s, c, r, round = 0, rough = 0.8, metal = 0 }: { p: [number, number, number]; s: [number, number, number]; c: string; r?: [number, number, number]; round?: number; rough?: number; metal?: number }) {
  if (round > 0)
    return (
      <RoundedBox position={p} rotation={r} args={s} radius={Math.min(round, Math.min(...s) / 2.01)} smoothness={3}>
        <meshStandardMaterial color={c} roughness={rough} metalness={metal} />
      </RoundedBox>
    );
  return (
    <mesh position={p} rotation={r}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={rough} metalness={metal} />
    </mesh>
  );
}

function Cyl({ p, r, h, c, rot, seg = 16 }: { p: [number, number, number]; r: number | [number, number]; h: number; c: string; rot?: [number, number, number]; seg?: number }) {
  const [rt, rb] = Array.isArray(r) ? r : [r, r];
  return (
    <mesh position={p} rotation={rot}>
      <cylinderGeometry args={[rt, rb, h, seg]} />
      <meshStandardMaterial color={c} roughness={0.75} />
    </mesh>
  );
}

function useTileTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const g = cv.getContext("2d")!;
    g.fillStyle = C.floorA;
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = C.floorB;
    g.fillRect(0, 0, 128, 128);
    g.fillRect(128, 128, 128, 128);
    g.strokeStyle = "rgba(15,23,42,0.12)";
    g.lineWidth = 2;
    g.strokeRect(1, 1, 254, 254);
    g.beginPath(); g.moveTo(128, 0); g.lineTo(128, 256); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke();
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(ROOM_LEN / 2, 7);
    t.anisotropy = 4;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/* ---------- people ---------- */

type PersonProps = { x: number; z: number; shirt: string; pants?: string; skin?: string; hair?: string; seated?: boolean; rotY?: number; armsUp?: boolean };
function Person({ x, z, shirt, pants = C.navy2, skin = C.skin1, hair = C.hair1, seated = false, rotY = 0, armsUp = false }: PersonProps) {
  const legH = seated ? 0.42 : 0.78;
  const torsoY = (seated ? 0.45 : 0) + legH + 0.36;
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* legs */}
      {seated ? (
        <>
          <Box p={[-0.11, 0.45 + 0.03, 0.18]} s={[0.16, 0.16, 0.4]} c={pants} round={0.05} />
          <Box p={[0.11, 0.45 + 0.03, 0.18]} s={[0.16, 0.16, 0.4]} c={pants} round={0.05} />
          <Box p={[-0.11, 0.22, 0.36]} s={[0.15, 0.44, 0.15]} c={pants} round={0.05} />
          <Box p={[0.11, 0.22, 0.36]} s={[0.15, 0.44, 0.15]} c={pants} round={0.05} />
        </>
      ) : (
        <>
          <Box p={[-0.11, legH / 2, 0]} s={[0.17, legH, 0.19]} c={pants} round={0.06} />
          <Box p={[0.11, legH / 2, 0]} s={[0.17, legH, 0.19]} c={pants} round={0.06} />
        </>
      )}
      {/* shoes */}
      <Box p={[-0.11, 0.05, seated ? 0.42 : 0.04]} s={[0.18, 0.1, 0.28]} c={C.navy} round={0.04} />
      <Box p={[0.11, 0.05, seated ? 0.42 : 0.04]} s={[0.18, 0.1, 0.28]} c={C.navy} round={0.04} />
      {/* torso */}
      <Box p={[0, torsoY, 0]} s={[0.46, 0.72, 0.26]} c={shirt} round={0.09} />
      {/* arms */}
      <Box p={[-0.31, torsoY + (armsUp ? 0.15 : -0.02), armsUp ? 0.12 : 0]} s={[0.13, 0.6, 0.13]} c={shirt} r={[armsUp ? -1.1 : 0, 0, 0.08]} round={0.05} />
      <Box p={[0.31, torsoY + (armsUp ? 0.15 : -0.02), armsUp ? 0.12 : 0]} s={[0.13, 0.6, 0.13]} c={shirt} r={[armsUp ? -1.1 : 0, 0, -0.08]} round={0.05} />
      <mesh position={[-0.31, torsoY - (armsUp ? -0.42 : 0.34), armsUp ? 0.38 : 0]}><sphereGeometry args={[0.075, 10, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.31, torsoY - (armsUp ? -0.42 : 0.34), armsUp ? 0.38 : 0]}><sphereGeometry args={[0.075, 10, 8]} /><meshStandardMaterial color={skin} /></mesh>
      {/* neck + head */}
      <Cyl p={[0, torsoY + 0.4, 0]} r={0.07} h={0.1} c={skin} seg={10} />
      <mesh position={[0, torsoY + 0.62, 0]}><sphereGeometry args={[0.22, 18, 14]} /><meshStandardMaterial color={skin} roughness={0.9} /></mesh>
      <mesh position={[0, torsoY + 0.7, -0.03]} scale={[1.02, 0.78, 1.02]}><sphereGeometry args={[0.225, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><meshStandardMaterial color={hair} roughness={1} /></mesh>
    </group>
  );
}

function Chair({ x, z, rotY = 0 }: { x: number; z: number; rotY?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <Box p={[0, 0.44, 0]} s={[0.5, 0.06, 0.5]} c={C.navy2} round={0.03} />
      <Box p={[0, 0.78, -0.23]} s={[0.5, 0.62, 0.06]} c={C.navy2} round={0.03} />
      {[-0.2, 0.2].map((dx) => [-0.2, 0.2].map((dz) => <Cyl key={`${dx}${dz}`} p={[dx, 0.21, dz]} r={0.02} h={0.42} c={C.chrome} seg={8} />))}
    </group>
  );
}

function Table({ x, z, w = 2.4, d = 0.8 }: { x: number; z: number; w?: number; d?: number }) {
  return (
    <group position={[x, 0, z]}>
      <Box p={[0, 0.76, 0]} s={[w, 0.07, d]} c={C.wood} round={0.02} />
      <Box p={[0, 0.5, 0]} s={[w, 0.5, d]} c={C.trim} />
      <Box p={[0, 0.5, d / 2 + 0.01]} s={[w, 0.5, 0.02]} c={C.navy} />
      <Text position={[0, 0.5, d / 2 + 0.03]} fontSize={0.16} color={C.gold} anchorX="center" anchorY="middle">VOTE</Text>
    </group>
  );
}

/* ---------- room ---------- */

function Room() {
  const tex = useTileTexture();
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROOM_CX, 0, -0.5]} receiveShadow>
        <planeGeometry args={[ROOM_LEN, 14]} />
        {tex ? <meshStandardMaterial map={tex} roughness={0.9} /> : <meshStandardMaterial color={C.floorA} />}
      </mesh>
      {/* guide line on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROOM_CX, 0.003, 1.6]}>
        <planeGeometry args={[ROOM_LEN - 4, 0.08]} />
        <meshBasicMaterial color={C.gold} />
      </mesh>
      {/* back wall */}
      <mesh position={[ROOM_CX, 2.75, WALL_Z]}>
        <planeGeometry args={[ROOM_LEN, 5.5]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      <Box p={[ROOM_CX, 0.55, WALL_Z + 0.03]} s={[ROOM_LEN, 1.1, 0.06]} c={C.wallLow} />
      <Box p={[ROOM_CX, 1.12, WALL_Z + 0.05]} s={[ROOM_LEN, 0.06, 0.1]} c={C.trim} />
      <Box p={[ROOM_CX, 5.45, WALL_Z + 0.06]} s={[ROOM_LEN, 0.12, 0.12]} c={C.trim} />
      {/* windows */}
      {Array.from({ length: N }).map((_, i) => (
        <group key={i} position={[stationX(i) + 3.2, 3.9, WALL_Z + 0.02]}>
          <Box p={[0, 0, 0]} s={[1.6, 1.1, 0.06]} c={C.trim} />
          <mesh position={[0, 0, 0.04]}><planeGeometry args={[1.45, 0.95]} /><meshBasicMaterial color={C.glass} /></mesh>
          <Box p={[0, 0, 0.05]} s={[0.04, 0.95, 0.02]} c={C.trim} />
          <Box p={[0, 0, 0.05]} s={[1.45, 0.04, 0.02]} c={C.trim} />
        </group>
      ))}
      {/* bunting */}
      {Array.from({ length: Math.floor(ROOM_LEN / 0.55) }).map((_, i) => {
        const x = -3 + i * 0.55;
        const sag = Math.sin((i / (ROOM_LEN / 0.55)) * Math.PI * 8) * 0.12;
        const col = [C.navy, C.gold, C.trim, C.rust][i % 4];
        return (
          <mesh key={i} position={[x, 4.95 + sag, WALL_Z + 0.08]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.16, 0.36, 3]} />
            <meshStandardMaterial color={col} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* pendant lights */}
      {Array.from({ length: N }).map((_, i) => (
        <group key={i} position={[stationX(i), 4.6, -1]}>
          <Cyl p={[0, 0.8, 0]} r={0.015} h={1.6} c={C.navy} seg={6} />
          <mesh position={[0, 0, 0]}><coneGeometry args={[0.45, 0.35, 24, 1, true]} /><meshStandardMaterial color={C.navy} side={THREE.DoubleSide} roughness={0.6} /></mesh>
          <mesh position={[0, -0.12, 0]}><sphereGeometry args={[0.14, 12, 10]} /><meshStandardMaterial color="#fff7df" emissive="#ffe9a8" emissiveIntensity={1.4} /></mesh>
        </group>
      ))}
    </group>
  );
}

function Poster({ x, title, lines, color = C.navy, y = 2.6, w = 1.5 }: { x: number; title: string; lines: string[]; color?: string; y?: number; w?: number }) {
  const h = 0.55 + lines.length * 0.22;
  return (
    <group position={[x, y, WALL_Z + 0.04]}>
      <Box p={[0, 0, 0]} s={[w, h, 0.03]} c={C.paper} />
      <Box p={[0, h / 2 - 0.16, 0.02]} s={[w, 0.32, 0.01]} c={color} />
      <Text position={[0, h / 2 - 0.16, 0.03]} fontSize={0.15} color="#fff" anchorX="center" anchorY="middle" maxWidth={w - 0.1}>{title}</Text>
      {lines.map((l, i) => (
        <Text key={i} position={[-w / 2 + 0.1, h / 2 - 0.48 - i * 0.22, 0.03]} fontSize={0.11} color={C.navy2} anchorX="left" anchorY="middle" maxWidth={w - 0.2}>{l}</Text>
      ))}
    </group>
  );
}

/* ---------- stations ---------- */

function Entrance({ x }: { x: number }) {
  return (
    <group>
      <Box p={[x, 1.8, WALL_Z + 0.15]} s={[2.6, 3.6, 0.3]} c={C.navy} />
      <Box p={[x - 0.55, 1.65, WALL_Z + 0.32]} s={[1.0, 3.2, 0.06]} c={C.navy2} />
      <Box p={[x + 0.55, 1.65, WALL_Z + 0.32]} s={[1.0, 3.2, 0.06]} c={C.navy2} />
      <mesh position={[x - 0.55, 2.2, WALL_Z + 0.36]}><planeGeometry args={[0.6, 1.1]} /><meshBasicMaterial color={C.glass} /></mesh>
      <mesh position={[x + 0.55, 2.2, WALL_Z + 0.36]}><planeGeometry args={[0.6, 1.1]} /><meshBasicMaterial color={C.glass} /></mesh>
      <Cyl p={[x - 0.15, 1.5, WALL_Z + 0.4]} r={0.03} h={0.5} c={C.chrome} seg={8} />
      <Cyl p={[x + 0.15, 1.5, WALL_Z + 0.4]} r={0.03} h={0.5} c={C.chrome} seg={8} />
      <Box p={[x, 3.95, WALL_Z + 0.4]} s={[3.2, 0.6, 0.14]} c={C.gold} round={0.05} />
      <Text position={[x, 3.95, WALL_Z + 0.48]} fontSize={0.3} color={C.navy} anchorX="center" anchorY="middle">VOTE HERE</Text>
      {/* flag */}
      <Cyl p={[x + 2.6, 1.8, WALL_Z + 0.6]} r={0.035} h={3.6} c={C.chrome} seg={8} />
      <Box p={[x + 3.05, 3.15, WALL_Z + 0.6]} s={[0.85, 0.55, 0.02]} c={C.navy} r={[0, 0, -0.05]} />
      <Box p={[x + 3.05, 3.4, WALL_Z + 0.61]} s={[0.85, 0.08, 0.02]} c={C.gold} r={[0, 0, -0.05]} />
      {/* door mat + stanchions */}
      <Box p={[x, 0.01, -2.4]} s={[2.4, 0.02, 1.2]} c={C.navy2} />
      {[-1.6, 1.6].map((dx) => (
        <group key={dx} position={[x + dx, 0, -1.2]}>
          <Cyl p={[0, 0.03, 0]} r={0.18} h={0.06} c={C.chrome} />
          <Cyl p={[0, 0.5, 0]} r={0.025} h={0.95} c={C.chrome} seg={10} />
          <mesh position={[0, 0.95, 0]}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color={C.chrome} metalness={0.6} roughness={0.3} /></mesh>
        </group>
      ))}
      <Box p={[x, 0.9, -1.2]} s={[3.2, 0.04, 0.04]} c={C.rust} />
      <Poster x={x - 2.5} title="Who can vote" lines={["US citizen", "18 by Election Day", "State resident", "Registered (except ND)"]} />
      <Person x={x - 1.5} z={-0.6} shirt={C.rust} skin={C.skin2} hair={C.hair1} rotY={0.4} />
      <Person x={x + 0.9} z={-0.2} shirt={C.green} skin={C.skin3} hair={C.hair3} pants={C.slate} rotY={-0.3} />
    </group>
  );
}

function CheckIn({ x }: { x: number }) {
  return (
    <group>
      <Table x={x} z={-1.6} />
      {/* laptop */}
      <Box p={[x - 0.7, 0.81, -1.6]} s={[0.62, 0.03, 0.42]} c={C.navy} round={0.01} />
      <Box p={[x - 0.7, 1.02, -1.82]} s={[0.62, 0.42, 0.02]} c={C.navy} r={[-0.2, 0, 0]} />
      <mesh position={[x - 0.7, 1.02, -1.805]} rotation={[-0.2, 0, 0]}><planeGeometry args={[0.56, 0.36]} /><meshBasicMaterial color={C.sky} /></mesh>
      {/* poll book + pen */}
      <Box p={[x + 0.4, 0.82, -1.55]} s={[0.7, 0.05, 0.5]} c={C.cream} round={0.01} />
      <Box p={[x + 0.4, 0.86, -1.5]} s={[0.55, 0.01, 0.35]} c={C.paper} />
      <Cyl p={[x + 0.85, 0.84, -1.45]} r={0.012} h={0.28} c={C.navy} rot={[0, 0, Math.PI / 2]} seg={6} />
      {/* sticker roll */}
      <Cyl p={[x + 0.95, 0.88, -1.8]} r={0.14} h={0.1} c={C.paper} rot={[Math.PI / 2, 0, 0]} />
      <Cyl p={[x + 0.95, 0.88, -1.745]} r={0.1} h={0.01} c={C.rust} rot={[Math.PI / 2, 0, 0]} />
      <Text position={[x + 0.95, 0.88, -1.735]} fontSize={0.045} color="#fff" anchorX="center" anchorY="middle">I VOTED</Text>
      {/* poll workers */}
      <Chair x={x - 0.7} z={-2.35} rotY={Math.PI} />
      <Chair x={x + 0.6} z={-2.35} rotY={Math.PI} />
      <Person x={x - 0.7} z={-2.45} shirt={C.navy2} skin={C.skin1} hair={C.hair3} seated rotY={Math.PI} />
      <Person x={x + 0.6} z={-2.45} shirt={C.gold} skin={C.skin3} hair={C.hair1} seated rotY={Math.PI} />
      {/* voter at desk */}
      <Person x={x - 0.1} z={-0.75} shirt={C.sky} skin={C.skin2} hair={C.hair2} pants={C.navy} rotY={Math.PI} />
      <Poster x={x + 2.6} title="Check in" lines={["Say your name", "Confirm address", "Sign the poll book"]} color={C.rust} />
    </group>
  );
}

function IdStation({ x }: { x: number }) {
  return (
    <group>
      {/* podium */}
      <Box p={[x, 0.6, -1.6]} s={[0.9, 1.2, 0.7]} c={C.navy2} round={0.03} />
      <Box p={[x, 1.24, -1.55]} s={[1.0, 0.08, 0.8]} c={C.wood} r={[-0.25, 0, 0]} round={0.02} />
      {/* big ID card */}
      <group position={[x, 2.45, -1.7]} rotation={[0, 0, -0.06]}>
        <Box p={[0, 0, 0]} s={[1.9, 1.2, 0.08]} c={C.paper} round={0.06} />
        <Box p={[0, 0.49, 0.045]} s={[1.9, 0.22, 0.01]} c={C.navy} />
        <Text position={[-0.85, 0.49, 0.06]} fontSize={0.11} color="#fff" anchorX="left" anchorY="middle">STATE ID</Text>
        <Box p={[-0.58, -0.08, 0.045]} s={[0.56, 0.7, 0.01]} c={C.sky} />
        <mesh position={[-0.58, 0.02, 0.06]}><sphereGeometry args={[0.13, 14, 10]} /><meshStandardMaterial color={C.skin1} /></mesh>
        <Box p={[-0.58, -0.25, 0.06]} s={[0.34, 0.22, 0.01]} c={C.rust} round={0.04} />
        <Box p={[0.3, 0.12, 0.045]} s={[0.9, 0.1, 0.01]} c={C.navy2} />
        <Box p={[0.3, -0.08, 0.045]} s={[0.75, 0.08, 0.01]} c={C.slate} />
        <Box p={[0.3, -0.26, 0.045]} s={[0.6, 0.08, 0.01]} c={C.slate} />
        <Box p={[0.55, -0.45, 0.045]} s={[0.4, 0.06, 0.01]} c={C.gold} />
      </group>
      <Person x={x + 1.1} z={-0.4} shirt={C.rust} skin={C.skin1} hair={C.hair2} rotY={-2.4} armsUp />
      <Person x={x - 0.1} z={-2.5} shirt={C.navy2} skin={C.skin2} hair={C.hair1} rotY={Math.PI} />
      <Poster x={x - 2.3} title="Bring ID" lines={["Driver's license", "State ID", "Passport", "Rules vary by state"]} color={C.navy2} />
    </group>
  );
}

function Ways({ x }: { x: number }) {
  return (
    <group>
      {/* signpost */}
      <Cyl p={[x - 2.2, 1.5, -1.6]} r={0.05} h={3.0} c={C.woodDark} seg={10} />
      {[[2.75, C.navy, "EARLY VOTING", 0.25], [2.3, C.gold, "BY MAIL", -0.2], [1.85, C.rust, "NOV 3", 0.3]].map(([y, col, t, rot], i) => (
        <group key={i} position={[x - 2.2, y as number, -1.6]} rotation={[0, rot as number, 0]}>
          <Box p={[0.55, 0, 0]} s={[1.3, 0.34, 0.06]} c={col as string} round={0.03} />
          <Text position={[0.55, 0, 0.04]} fontSize={0.14} color={col === C.gold ? C.navy : "#fff"} anchorX="center" anchorY="middle">{t as string}</Text>
        </group>
      ))}
      {/* drop box */}
      <group position={[x + 0.3, 0, -1.8]}>
        <Box p={[0, 0.8, 0]} s={[1.0, 1.6, 1.0]} c={C.navy} round={0.06} />
        <Box p={[0, 1.68, 0]} s={[1.08, 0.16, 1.08]} c={C.navy2} round={0.04} />
        <Box p={[0, 1.25, 0.51]} s={[0.6, 0.07, 0.04]} c={C.gold} />
        <Box p={[0, 0.72, 0.51]} s={[0.8, 0.5, 0.02]} c={C.paper} />
        <Text position={[0, 0.84, 0.53]} fontSize={0.085} color={C.navy} anchorX="center" anchorY="middle">OFFICIAL BALLOT</Text>
        <Text position={[0, 0.66, 0.53]} fontSize={0.085} color={C.navy} anchorX="center" anchorY="middle">DROP BOX</Text>
        <Box p={[0, 0.02, 0]} s={[1.2, 0.04, 1.2]} c={C.slate} />
      </group>
      {/* calendar board */}
      <group position={[x + 2.5, 2.2, WALL_Z + 0.05]}>
        <Box p={[0, 0, 0]} s={[1.5, 1.6, 0.04]} c={C.paper} round={0.03} />
        <Box p={[0, 0.65, 0.02]} s={[1.5, 0.3, 0.01]} c={C.rust} />
        <Text position={[0, 0.65, 0.04]} fontSize={0.14} color="#fff" anchorX="center" anchorY="middle">NOVEMBER 2026</Text>
        {Array.from({ length: 28 }).map((_, i) => {
          const col = i % 7, row = Math.floor(i / 7);
          const is3 = i === 2;
          return <Box key={i} p={[-0.6 + col * 0.2, 0.3 - row * 0.2, 0.02]} s={[0.16, 0.16, 0.01]} c={is3 ? C.gold : C.floorB} />;
        })}
        <Text position={[-0.2, 0.3, 0.04]} fontSize={0.1} color={C.navy} anchorX="center" anchorY="middle">3</Text>
      </group>
      {/* voter holding envelope */}
      <Person x={x + 1.5} z={-0.6} shirt={C.green} skin={C.skin3} hair={C.hair1} rotY={2.3} armsUp />
      <Box p={[x + 1.5, 1.55, -0.95]} s={[0.5, 0.32, 0.03]} c={C.paper} r={[-0.3, 2.3, 0]} />
    </group>
  );
}

function Booths({ x }: { x: number }) {
  return (
    <group>
      {[-1.6, 0, 1.6].map((dx, i) => (
        <group key={i} position={[x + dx, 0, -1.9]}>
          <Box p={[-0.65, 1.1, 0]} s={[0.05, 2.2, 1.2]} c={C.navy} />
          <Box p={[0.65, 1.1, 0]} s={[0.05, 2.2, 1.2]} c={C.navy} />
          <Box p={[0, 1.1, -0.6]} s={[1.3, 2.2, 0.05]} c={C.navy2} />
          <Box p={[0, 2.22, 0]} s={[1.36, 0.08, 1.26]} c={C.gold} round={0.02} />
          <Box p={[0, 1.0, -0.2]} s={[1.1, 0.06, 0.6]} c={C.wood} round={0.02} />
          <Box p={[0, 1.04, -0.15]} s={[0.6, 0.01, 0.8]} c={C.paper} />
          {Array.from({ length: 6 }).map((_, k) => <Box key={k} p={[-0.2 + (k % 2) * 0.3, 1.045, 0.1 - Math.floor(k / 2) * 0.2]} s={[0.1, 0.01, 0.08]} c={k === 2 ? C.navy : C.slate} />)}
          <Cyl p={[0.36, 1.08, 0.05]} r={0.012} h={0.26} c={C.navy} rot={[0.3, 0, 0.5]} seg={6} />
          {/* curtain */}
          {i !== 1 && (
            <mesh position={[0, 1.5, 0.6]}>
              <planeGeometry args={[1.26, 1.45, 10, 1]} onUpdate={(g: THREE.BufferGeometry) => { const p = g.attributes.position; for (let j = 0; j < p.count; j++) p.setZ(j, Math.sin(p.getX(j) * 9) * 0.05); p.needsUpdate = true; g.computeVertexNormals(); }} />
              <meshStandardMaterial color={C.curtain} side={THREE.DoubleSide} roughness={1} />
            </mesh>
          )}
          <Cyl p={[0, 2.18, 0.6]} r={0.02} h={1.3} c={C.chrome} rot={[0, 0, Math.PI / 2]} seg={8} />
          {i === 1 && <Person x={0} z={0.35} shirt={C.rust} skin={C.skin2} hair={C.hair2} rotY={Math.PI} armsUp />}
        </group>
      ))}
      {/* ballot scanner */}
      <group position={[x + 3.4, 0, -1.5]}>
        <Box p={[0, 0.5, 0]} s={[0.8, 1.0, 0.7]} c={C.navy2} round={0.04} />
        <Box p={[0, 1.08, 0]} s={[0.9, 0.16, 0.8]} c={C.slate} round={0.04} />
        <Box p={[0, 1.17, 0.1]} s={[0.5, 0.03, 0.08]} c={C.navy} />
        <Box p={[0, 1.3, -0.25]} s={[0.55, 0.35, 0.03]} c={C.navy} r={[-0.4, 0, 0]} />
        <mesh position={[0, 1.3, -0.235]} rotation={[-0.4, 0, 0]}><planeGeometry args={[0.48, 0.28]} /><meshBasicMaterial color={C.green} /></mesh>
        <Text position={[0, 1.3, -0.22]} rotation={[-0.4, 0, 0]} fontSize={0.09} color="#fff" anchorX="center" anchorY="middle">BALLOT COUNTED</Text>
        <Box p={[0, 1.25, 0.12]} s={[0.4, 0.01, 0.3]} c={C.paper} r={[0.4, 0, 0]} />
      </group>
      <Poster x={x - 3.0} title="Mark your ballot" lines={["Fill ovals fully", "You may skip races", "Ask for a new one if you err"]} color={C.navy} />
    </group>
  );
}

function Access({ x }: { x: number }) {
  return (
    <group>
      {/* accessible machine */}
      <group position={[x - 1.0, 0, -1.7]}>
        <Box p={[0, 0.4, 0]} s={[1.2, 0.8, 0.9]} c={C.wood} round={0.03} />
        <Box p={[0, 0.88, -0.1]} s={[1.1, 0.16, 0.7]} c={C.navy2} round={0.03} />
        <Box p={[0, 1.3, -0.35]} s={[1.0, 0.7, 0.05]} c={C.navy} r={[-0.3, 0, 0]} round={0.02} />
        <mesh position={[0, 1.3, -0.32]} rotation={[-0.3, 0, 0]}><planeGeometry args={[0.9, 0.6]} /><meshBasicMaterial color={C.sky} /></mesh>
        <Text position={[0, 1.42, -0.29]} rotation={[-0.3, 0, 0]} fontSize={0.08} color={C.navy} anchorX="center">AUDIO  LARGE TEXT  CONTRAST</Text>
        {/* keypad */}
        {[-0.2, 0, 0.2].map((dx) => [0.1, -0.08].map((dz) => <Box key={`${dx}${dz}`} p={[dx + 0.25, 0.98, dz + 0.1]} s={[0.12, 0.05, 0.12]} c={dx === 0 ? C.gold : C.trim} round={0.02} />))}
        {/* headphones */}
        <mesh position={[-0.42, 1.0, 0.25]} rotation={[0.2, 0, Math.PI]}><torusGeometry args={[0.16, 0.03, 8, 18, Math.PI]} /><meshStandardMaterial color={C.navy} /></mesh>
        <mesh position={[-0.58, 0.98, 0.25]}><sphereGeometry args={[0.06, 10, 8]} /><meshStandardMaterial color={C.navy} /></mesh>
        <mesh position={[-0.26, 0.98, 0.25]}><sphereGeometry args={[0.06, 10, 8]} /><meshStandardMaterial color={C.navy} /></mesh>
      </group>
      {/* wheelchair user */}
      <group position={[x - 1.0, 0, -0.5]} rotation={[0, Math.PI, 0]}>
        {[-0.32, 0.32].map((dx) => (
          <group key={dx} position={[dx, 0.32, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <mesh><torusGeometry args={[0.32, 0.04, 8, 24]} /><meshStandardMaterial color={C.navy} /></mesh>
            {[0, 1, 2, 3].map((k) => <Cyl key={k} p={[0, 0, 0]} r={0.01} h={0.62} c={C.chrome} rot={[0, (k * Math.PI) / 4, 0]} seg={6} />)}
          </group>
        ))}
        {[-0.22, 0.22].map((dx) => <mesh key={dx} position={[dx, 0.1, -0.4]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.1, 0.03, 8, 16]} /><meshStandardMaterial color={C.navy} /></mesh>)}
        <Box p={[0, 0.5, 0]} s={[0.56, 0.08, 0.5]} c={C.rust} round={0.03} />
        <Box p={[0, 0.9, 0.25]} s={[0.56, 0.7, 0.07]} c={C.rust} round={0.03} />
        <Box p={[0, 0.12, -0.45]} s={[0.5, 0.04, 0.2]} c={C.slate} />
        <Person x={0} z={-0.05} shirt={C.sky} skin={C.skin3} hair={C.hair1} seated pants={C.navy} />
      </group>
      {/* curbside sign */}
      <group position={[x + 1.6, 0, -1.4]}>
        <Cyl p={[0, 1.0, 0]} r={0.04} h={2.0} c={C.chrome} seg={10} />
        <Cyl p={[0, 0.03, 0]} r={0.25} h={0.06} c={C.navy2} />
        <Box p={[0, 2.25, 0]} s={[1.3, 0.6, 0.05]} c={C.gold} round={0.04} />
        <Text position={[0, 2.33, 0.03]} fontSize={0.14} color={C.navy} anchorX="center" anchorY="middle">CURBSIDE</Text>
        <Text position={[0, 2.15, 0.03]} fontSize={0.14} color={C.navy} anchorX="center" anchorY="middle">VOTING</Text>
      </group>
      {/* ramp */}
      <Box p={[x + 1.6, 0.12, -2.8]} s={[1.4, 0.24, 1.2]} c={C.slate} r={[0.2, 0, 0]} />
      <Poster x={x - 3.0} title="Your rights" lines={["Accessible machine", "Help from anyone you pick", "Curbside if needed", "ADA line 800-514-0301"]} color={C.green} />
    </group>
  );
}

function HelpDesk({ x }: { x: number }) {
  return (
    <group>
      <Table x={x} z={-1.7} w={2.6} />
      <Box p={[x, 1.55, -1.7]} s={[2.6, 0.36, 0.06]} c={C.gold} round={0.03} />
      <Text position={[x, 1.55, -1.66]} fontSize={0.17} color={C.navy} anchorX="center" anchorY="middle">QUESTIONS? ASK HERE</Text>
      <Cyl p={[x - 1.2, 1.1, -1.7]} r={0.02} h={0.7} c={C.chrome} seg={8} />
      <Cyl p={[x + 1.2, 1.1, -1.7]} r={0.02} h={0.7} c={C.chrome} seg={8} />
      {/* phone */}
      <Box p={[x + 0.7, 0.85, -1.6]} s={[0.4, 0.12, 0.3]} c={C.navy} round={0.02} />
      <Box p={[x + 0.7, 0.97, -1.72]} s={[0.42, 0.08, 0.1]} c={C.navy2} r={[0, 0, 0.08]} round={0.03} />
      {/* leaflets */}
      {[-0.9, -0.6, -0.3].map((dx, i) => <Box key={i} p={[x + dx, 0.82 + i * 0.01, -1.55]} s={[0.26, 0.02, 0.36]} c={[C.rust, C.navy, C.green][i]} />)}
      <Chair x={x} z={-2.45} rotY={Math.PI} />
      <Person x={x} z={-2.55} shirt={C.navy2} skin={C.skin2} hair={C.hair3} seated rotY={Math.PI} />
      <Person x={x - 0.3} z={-0.8} shirt={C.gold} skin={C.skin1} hair={C.hair1} pants={C.slate} rotY={Math.PI} />
      <Poster x={x - 2.6} title="If something goes wrong" lines={["In line at closing? Stay.", "Not on the list? Provisional ballot.", "DOJ 1-800-253-3931", "866-OUR-VOTE"]} color={C.rust} />
    </group>
  );
}

function Overseas({ x }: { x: number }) {
  return (
    <group>
      {/* mailbox */}
      <group position={[x - 1.2, 0, -1.6]}>
        <Cyl p={[0, 0.55, 0]} r={0.05} h={1.1} c={C.navy} seg={10} />
        <Box p={[0, 1.3, 0]} s={[0.9, 0.5, 0.6]} c={C.navy} round={0.1} />
        <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.9, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color={C.navy} /></mesh>
        <Box p={[0.46, 1.3, 0]} s={[0.04, 0.5, 0.6]} c={C.navy2} />
        <Box p={[0, 1.22, 0.31]} s={[0.5, 0.06, 0.03]} c={C.gold} />
        <Text position={[0, 1.4, 0.31]} fontSize={0.08} color="#fff" anchorX="center">US MAIL</Text>
      </group>
      {/* globe */}
      <group position={[x + 1.2, 0, -1.6]}>
        <Cyl p={[0, 0.5, 0]} r={[0.18, 0.35]} h={1.0} c={C.woodDark} />
        <mesh position={[0, 1.65, 0]} rotation={[0, 0.6, 0.4]}>
          <sphereGeometry args={[0.55, 28, 20]} />
          <meshStandardMaterial color={C.sky} roughness={0.55} />
        </mesh>
        {[[0.1, 0.2, 0.35, 0.2], [-0.3, 0.1, 0.25, 0.3], [0.2, -0.3, 0.3, 0.25], [-0.15, -0.2, 0.2, 0.15]].map(([lon, lat, w, h], i) => {
          const r = 0.56; const phi = lat as number, th = lon as number;
          return <Box key={i} p={[r * Math.cos(phi) * Math.sin(th + 1), r * Math.sin(phi) + 1.65, r * Math.cos(phi) * Math.cos(th + 1)]} s={[w as number, h as number, 0.02]} c={C.green} r={[-phi, th + 1, 0]} round={0.03} />;
        })}
        <mesh position={[0, 1.65, 0]} rotation={[0.4, 0, 0.3]}><torusGeometry args={[0.62, 0.025, 6, 40, Math.PI * 1.2]} /><meshStandardMaterial color={C.navy} /></mesh>
      </group>
      {/* envelope with stamp */}
      <Box p={[x, 1.0, -0.8]} s={[0.9, 0.56, 0.04]} c={C.paper} r={[-0.5, 0.3, 0]} round={0.02} />
      <Box p={[x + 0.3, 1.14, -0.76]} s={[0.2, 0.2, 0.02]} c={C.rust} r={[-0.5, 0.3, 0]} />
      <Box p={[x - 0.2, 0.95, -0.76]} s={[0.4, 0.05, 0.02]} c={C.slate} r={[-0.5, 0.3, 0]} />
      <Person x={x - 0.1} z={0.2} shirt={C.navy2} skin={C.skin1} hair={C.hair2} rotY={Math.PI} armsUp />
      <Poster x={x + 2.8} title="Abroad or military" lines={["fvap.gov", "FPCA to register + request", "FWAB backup ballot"]} color={C.navy} />
    </group>
  );
}

/* ---------- animated walker ---------- */

function Walker({ active }: { active: boolean }) {
  const g = useRef<THREE.Group>(null);
  const ll = useRef<THREE.Mesh>(null);
  const rl = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const end = stationX(N - 1) + 2;
  useFrame((_, dt) => {
    if (!g.current || !active) return;
    t.current += dt;
    const speed = 1.1;
    const x = -3 + ((t.current * speed) % (end + 3));
    g.current.position.x = x;
    g.current.position.y = Math.abs(Math.sin(t.current * 6)) * 0.03;
    const sw = Math.sin(t.current * 6) * 0.5;
    if (ll.current) ll.current.rotation.x = sw;
    if (rl.current) rl.current.rotation.x = -sw;
  });
  return (
    <group ref={g} position={[-3, 0, 1.6]} rotation={[0, Math.PI / 2, 0]}>
      <mesh ref={ll} position={[-0.11, 0.78, 0]}><boxGeometry args={[0.17, 0.78, 0.19]} /><meshStandardMaterial color={C.slate} /></mesh>
      <mesh ref={rl} position={[0.11, 0.78, 0]}><boxGeometry args={[0.17, 0.78, 0.19]} /><meshStandardMaterial color={C.slate} /></mesh>
      <Box p={[0, 1.14, 0]} s={[0.46, 0.72, 0.26]} c={C.gold} round={0.09} />
      <Box p={[-0.31, 1.1, 0]} s={[0.13, 0.6, 0.13]} c={C.gold} round={0.05} />
      <Box p={[0.31, 1.1, 0]} s={[0.13, 0.6, 0.13]} c={C.gold} round={0.05} />
      <mesh position={[0, 1.76, 0]}><sphereGeometry args={[0.22, 18, 14]} /><meshStandardMaterial color={C.skin2} /></mesh>
      <mesh position={[0, 1.84, -0.03]} scale={[1.02, 0.78, 1.02]}><sphereGeometry args={[0.225, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><meshStandardMaterial color={C.hair1} /></mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.35, 20]} /><meshBasicMaterial color="#0f172a" transparent opacity={0.22} /></mesh>
    </group>
  );
}

/* ---------- camera ---------- */

const LABELS: Record<StationId, string> = {
  eligibility: "1  Who can vote",
  register: "2  Check in",
  id: "3  Show ID",
  ways: "4  Choose how to vote",
  ballot: "5  Mark your ballot",
  access: "6  Accessible voting",
  help: "7  Get help",
  overseas: "8  Abroad or military",
};

function Rig({ index, controls, reduce }: { index: number; controls: React.RefObject<OrbitControlsImpl | null>; reduce: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(stationX(index), 1.5, -1.6), []); // eslint-disable-line react-hooks/exhaustive-deps
  const camGoal = useMemo(() => new THREE.Vector3(stationX(index) + 0.9, 3.0, 7.6), []); // eslint-disable-line react-hooks/exhaustive-deps
  const clock = useRef(0);
  useEffect(() => {
    const x = stationX(index);
    target.set(x, 1.5, -1.6);
    camGoal.set(x + 0.9, 3.0, 7.6);
    if (reduce) {
      camera.position.copy(camGoal);
      controls.current?.target.copy(target);
      controls.current?.update();
    }
  }, [index, camera, controls, target, camGoal, reduce]);
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    clock.current += dt;
    const k = 1 - Math.pow(0.0015, dt);
    const breathe = reduce ? 0 : Math.sin(clock.current * 0.5) * 0.06;
    const goal = camGoal.clone();
    goal.y += breathe;
    goal.x += Math.cos(clock.current * 0.35) * 0.08 * (reduce ? 0 : 1);
    camera.position.lerp(goal, k * 0.9);
    c.target.lerp(target, k);
    c.update();
  });
  return null;
}

export default function Scene({ index, onPick }: { index: number; onPick?: (i: number) => void }) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const xs = STATION_IDS.map((_, i) => stationX(i));
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(wrap.current);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={visible ? "always" : "demand"}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        camera={{ position: [0.9, 3.0, 7.6], fov: 36, near: 0.1, far: 80 }}
        style={{ touchAction: "pan-y" }}
        aria-hidden
      >
        <color attach="background" args={["#e9eef4"]} />
        <hemisphereLight args={["#ffffff", "#aab6c3", 0.75]} />
        <directionalLight position={[8, 12, 7]} intensity={1.25} color="#fff4e0" />
        <directionalLight position={[-6, 6, -4]} intensity={0.35} color="#dbe7ff" />
        <fog attach="fog" args={["#e9eef4", 16, 34]} />
        <Room />
        <Entrance x={xs[0]} />
        <CheckIn x={xs[1]} />
        <IdStation x={xs[2]} />
        <Ways x={xs[3]} />
        <Booths x={xs[4]} />
        <Access x={xs[5]} />
        <HelpDesk x={xs[6]} />
        <Overseas x={xs[7]} />
        <Walker active={visible && !reduce} />
        <ContactShadows position={[ROOM_CX, 0.002, -1]} width={ROOM_LEN} height={12} far={3} blur={2.2} opacity={0.45} frames={1} resolution={1024} />
        {STATION_IDS.map((id, i) => (
          <group key={id} onClick={() => onPick?.(i)} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
            <group position={[xs[i], 3.3, WALL_Z + 0.5]}>
              <Box p={[0, 0, -0.03]} s={[3.1, 0.5, 0.04]} c={i === index ? C.gold : C.trim} round={0.05} />
              <Text position={[0, 0, 0]} fontSize={0.22} color={C.navy} anchorX="center" anchorY="middle">{LABELS[id]}</Text>
            </group>
            <mesh position={[xs[i], 1.3, -1.2]} visible={false}><boxGeometry args={[5.5, 4.5, 5]} /></mesh>
          </group>
        ))}
        <OrbitControls ref={controls} enablePan={false} enableZoom={false} minPolarAngle={0.95} maxPolarAngle={1.45} minAzimuthAngle={-0.5} maxAzimuthAngle={0.5} enableDamping dampingFactor={0.1} />
        <Rig index={index} controls={controls} reduce={!!reduce} />
      </Canvas>
    </div>
  );
}
