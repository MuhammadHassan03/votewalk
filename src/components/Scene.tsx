"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text as DreiText } from "@react-three/drei";

const FONT = "/fonts/label.woff";
const Text = (props: React.ComponentProps<typeof DreiText>) => <DreiText font={FONT} {...props} />;
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const C = {
  floor: "#cfd8df",
  wall: "#e4ebef",
  wood: "#c9a77c",
  woodDark: "#9b7a52",
  ink: "#16212b",
  teal: "#0e5e6f",
  tealLight: "#2f8a9b",
  mustard: "#e0a526",
  paper: "#fbfcfd",
  mint: "#9fd3c7",
  skin: "#e8c4a0",
  blue: "#5b7f99",
  shadow: "#9aa7b1",
};

export const STATION_IDS = ["eligibility", "register", "id", "ways", "ballot", "access", "help", "overseas"] as const;
export type StationId = (typeof STATION_IDS)[number];

const SPACING = 6;
export const stationX = (i: number) => i * SPACING;

function Shadow({ x, z = 0, r = 1 }: { x: number; z?: number; r?: number }) {
  return (
    <mesh position={[x, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[r, 24]} />
      <meshBasicMaterial color={C.shadow} transparent opacity={0.35} />
    </mesh>
  );
}

function Box({ p, s, c, r }: { p: [number, number, number]; s: [number, number, number]; c: string; r?: [number, number, number] }) {
  return (
    <mesh position={p} rotation={r}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.85} />
    </mesh>
  );
}

function Person({ x, z, shirt, seated = false }: { x: number; z: number; shirt: string; seated?: boolean }) {
  const h = seated ? 0.55 : 0.75;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2 + 0.3, 0]}>
        <capsuleGeometry args={[0.22, h, 6, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.9} />
      </mesh>
      <mesh position={[0, h + 0.78, 0]}>
        <sphereGeometry args={[0.2, 14, 12]} />
        <meshStandardMaterial color={C.skin} roughness={0.9} />
      </mesh>
      <Shadow x={0} r={0.35} />
    </group>
  );
}

function Label({ x, text, y = 2.9 }: { x: number; text: string; y?: number }) {
  return (
    <Text position={[x, y, -2.6]} fontSize={0.34} color={C.ink} anchorX="center" anchorY="middle" maxWidth={5} letterSpacing={-0.01}>
      {text}
    </Text>
  );
}

function Room() {
  const len = SPACING * STATION_IDS.length + 6;
  const cx = stationX(STATION_IDS.length - 1) / 2;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0, 0]}>
        <planeGeometry args={[len, 14]} />
        <meshStandardMaterial color={C.floor} roughness={1} />
      </mesh>
      {/* gym floor lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.002, 1.2]}>
        <planeGeometry args={[len - 2, 0.06]} />
        <meshBasicMaterial color={C.mustard} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.002, -4.2]}>
        <planeGeometry args={[len - 2, 0.06]} />
        <meshBasicMaterial color={C.teal} />
      </mesh>
      {/* back wall */}
      <mesh position={[cx, 2.5, -3.2]}>
        <planeGeometry args={[len, 5]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      {/* wainscot */}
      <Box p={[cx, 0.6, -3.18]} s={[len, 1.2, 0.04]} c={C.wood} />
      {/* windows */}
      {STATION_IDS.map((_, i) => (
        <mesh key={i} position={[stationX(i) + 2.6, 3.6, -3.17]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshBasicMaterial color="#f4f8fa" />
        </mesh>
      ))}
    </group>
  );
}

function Entrance({ x }: { x: number }) {
  return (
    <group>
      <Box p={[x, 1.6, -3.1]} s={[2.2, 3.2, 0.25]} c={C.teal} />
      <Box p={[x - 0.5, 1.5, -2.95]} s={[0.95, 2.9, 0.08]} c={C.tealLight} />
      <Box p={[x + 0.5, 1.5, -2.95]} s={[0.95, 2.9, 0.08]} c={C.tealLight} />
      <Box p={[x, 3.5, -2.95]} s={[2.6, 0.5, 0.1]} c={C.mustard} />
      <Text position={[x, 3.5, -2.88]} fontSize={0.26} color={C.ink} anchorX="center" anchorY="middle">
        VOTE HERE
      </Text>
      <Person x={x - 1.6} z={0.6} shirt={C.blue} />
      <Person x={x - 0.7} z={1.1} shirt={C.mint} />
      <Shadow x={x} z={-2.5} r={1.1} />
    </group>
  );
}

function CheckIn({ x }: { x: number }) {
  return (
    <group>
      <Box p={[x, 0.75, -1]} s={[2.6, 0.1, 0.9]} c={C.wood} />
      <Box p={[x - 1.15, 0.37, -1]} s={[0.1, 0.74, 0.8]} c={C.woodDark} />
      <Box p={[x + 1.15, 0.37, -1]} s={[0.1, 0.74, 0.8]} c={C.woodDark} />
      <Box p={[x - 0.6, 0.9, -1.1]} s={[0.7, 0.04, 0.5]} c={C.ink} />
      <Box p={[x - 0.6, 1.12, -1.33]} s={[0.7, 0.44, 0.03]} c={C.tealLight} r={[-0.15, 0, 0]} />
      <Box p={[x + 0.6, 0.83, -0.9]} s={[0.5, 0.06, 0.7]} c={C.paper} />
      <Person x={x} z={-1.9} shirt={C.teal} seated />
      <Person x={x} z={0.3} shirt={C.mustard} />
      <Shadow x={x} z={-1} r={1.5} />
    </group>
  );
}

function IdStation({ x }: { x: number }) {
  return (
    <group>
      <Box p={[x, 1.1, -1.4]} s={[0.12, 2.2, 0.12]} c={C.ink} />
      <group position={[x, 2.1, -1.4]} rotation={[0, -0.25, 0]}>
        <Box p={[0, 0, 0]} s={[1.6, 1.0, 0.06]} c={C.paper} />
        <Box p={[-0.45, 0.05, 0.04]} s={[0.5, 0.6, 0.02]} c={C.mint} />
        <Box p={[0.3, 0.2, 0.04]} s={[0.7, 0.08, 0.02]} c={C.ink} />
        <Box p={[0.3, 0.0, 0.04]} s={[0.7, 0.08, 0.02]} c={C.shadow} />
        <Box p={[0.3, -0.2, 0.04]} s={[0.5, 0.08, 0.02]} c={C.shadow} />
        <Box p={[0, 0.42, 0.04]} s={[1.6, 0.12, 0.02]} c={C.mustard} />
      </group>
      <Person x={x + 0.9} z={0.2} shirt={C.blue} />
      <Shadow x={x} z={-1.4} r={0.8} />
    </group>
  );
}

function Ways({ x }: { x: number }) {
  return (
    <group>
      {/* signpost */}
      <Box p={[x - 1.8, 1.4, -1.2]} s={[0.1, 2.8, 0.1]} c={C.woodDark} />
      <Box p={[x - 1.35, 2.5, -1.2]} s={[1.1, 0.3, 0.05]} c={C.teal} />
      <Box p={[x - 1.35, 2.1, -1.2]} s={[1.1, 0.3, 0.05]} c={C.mustard} />
      <Box p={[x - 1.35, 1.7, -1.2]} s={[1.1, 0.3, 0.05]} c={C.tealLight} />
      <Text position={[x - 1.35, 2.5, -1.16]} fontSize={0.16} color="#fff" anchorX="center">EARLY</Text>
      <Text position={[x - 1.35, 2.1, -1.16]} fontSize={0.16} color={C.ink} anchorX="center">BY MAIL</Text>
      <Text position={[x - 1.35, 1.7, -1.16]} fontSize={0.16} color="#fff" anchorX="center">NOV 3</Text>
      {/* drop box */}
      <Box p={[x + 0.6, 0.7, -1.4]} s={[0.9, 1.4, 0.9]} c={C.teal} />
      <Box p={[x + 0.6, 1.5, -1.4]} s={[0.95, 0.2, 0.95]} c={C.tealLight} />
      <Box p={[x + 0.6, 1.05, -0.94]} s={[0.5, 0.06, 0.04]} c={C.ink} />
      <Text position={[x + 0.6, 0.5, -0.94]} fontSize={0.12} color="#fff" anchorX="center">OFFICIAL BALLOT DROP</Text>
      {/* envelope */}
      <Box p={[x + 1.9, 0.9, -0.6]} s={[0.7, 0.45, 0.04]} c={C.paper} r={[0, 0.5, 0.1]} />
      <Box p={[x + 1.9, 0.9, -0.58]} s={[0.25, 0.14, 0.02]} c={C.mustard} r={[0, 0.5, 0.1]} />
      <Shadow x={x + 0.6} z={-1.4} r={0.9} />
    </group>
  );
}

function Booths({ x }: { x: number }) {
  return (
    <group>
      {[-1.4, 0, 1.4].map((dx, i) => (
        <group key={i} position={[x + dx, 0, -1.2]}>
          <Box p={[0, 1.05, 0]} s={[0.06, 2.1, 1.1]} c={C.teal} />
          <Box p={[1.2, 1.05, 0]} s={[0.06, 2.1, 1.1]} c={C.teal} />
          <Box p={[0.6, 1.05, -0.55]} s={[1.2, 2.1, 0.06]} c={C.tealLight} />
          <Box p={[0.6, 2.05, 0]} s={[1.26, 0.1, 1.16]} c={C.ink} />
          <Box p={[0.6, 0.95, -0.15]} s={[1.0, 0.05, 0.6]} c={C.wood} />
          <Box p={[0.6, 0.98, -0.1]} s={[0.55, 0.01, 0.75]} c={C.paper} />
          {i === 1 && <Person x={0.6} z={0.5} shirt={C.mustard} />}
          <Shadow x={0.6} z={0} r={0.9} />
        </group>
      ))}
    </group>
  );
}

function Access({ x }: { x: number }) {
  return (
    <group>
      {/* accessible machine */}
      <Box p={[x - 0.9, 0.5, -1.3]} s={[1.1, 1.0, 0.8]} c={C.wood} />
      <Box p={[x - 0.9, 1.25, -1.55]} s={[1.0, 0.6, 0.06]} c={C.ink} r={[-0.35, 0, 0]} />
      <Box p={[x - 0.9, 1.25, -1.53]} s={[0.9, 0.5, 0.02]} c={C.tealLight} r={[-0.35, 0, 0]} />
      <Box p={[x - 0.5, 1.02, -1.05]} s={[0.4, 0.06, 0.25]} c={C.mustard} />
      {/* headphones */}
      <mesh position={[x - 1.35, 1.15, -1.0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.16, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color={C.ink} />
      </mesh>
      {/* wheelchair user */}
      <group position={[x - 0.9, 0, -0.1]}>
        <mesh position={[-0.3, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.3, 0.05, 8, 20]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
        <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.3, 0.05, 8, 20]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
        <Box p={[0, 0.55, 0]} s={[0.55, 0.08, 0.5]} c={C.teal} />
        <Box p={[0, 0.9, 0.22]} s={[0.55, 0.6, 0.08]} c={C.teal} />
        <Person x={0} z={0} shirt={C.blue} seated />
      </group>
      {/* curbside sign */}
      <Box p={[x + 1.4, 1.0, -1.4]} s={[0.08, 2.0, 0.08]} c={C.ink} />
      <Box p={[x + 1.4, 2.1, -1.4]} s={[1.2, 0.5, 0.05]} c={C.mustard} />
      <Text position={[x + 1.4, 2.1, -1.36]} fontSize={0.14} color={C.ink} anchorX="center" maxWidth={1.1} textAlign="center">
        CURBSIDE VOTING
      </Text>
      <Shadow x={x - 0.9} z={-1.3} r={1} />
    </group>
  );
}

function HelpDesk({ x }: { x: number }) {
  return (
    <group>
      <Box p={[x, 0.75, -1.2]} s={[2.2, 0.1, 0.8]} c={C.wood} />
      <Box p={[x, 0.37, -1.2]} s={[2.1, 0.74, 0.7]} c={C.woodDark} />
      <Box p={[x, 1.0, -1.55]} s={[2.2, 0.3, 0.05]} c={C.mustard} />
      <Text position={[x, 1.0, -1.52]} fontSize={0.16} color={C.ink} anchorX="center">NEED HELP? ASK HERE</Text>
      {/* phone */}
      <Box p={[x + 0.6, 0.85, -1.2]} s={[0.35, 0.1, 0.25]} c={C.ink} />
      <Box p={[x + 0.6, 0.95, -1.2]} s={[0.4, 0.08, 0.1]} c={C.ink} r={[0, 0, 0.1]} />
      <Person x={x} z={-2.0} shirt={C.teal} seated />
      <Person x={x - 0.4} z={0.2} shirt={C.mint} />
      <Shadow x={x} z={-1.2} r={1.3} />
    </group>
  );
}

function Overseas({ x }: { x: number }) {
  return (
    <group>
      {/* mailbox */}
      <Box p={[x - 0.8, 0.5, -1.3]} s={[0.08, 1.0, 0.08]} c={C.ink} />
      <mesh position={[x - 0.8, 1.25, -1.3]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 0.6, 4, 12]} />
        <meshStandardMaterial color={C.teal} roughness={0.8} />
      </mesh>
      <Box p={[x - 0.8, 1.35, -0.98]} s={[0.4, 0.06, 0.05]} c={C.mustard} />
      {/* globe */}
      <Box p={[x + 1.0, 0.45, -1.3]} s={[0.5, 0.9, 0.5]} c={C.woodDark} />
      <mesh position={[x + 1.0, 1.45, -1.3]}>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color={C.tealLight} roughness={0.6} />
      </mesh>
      <mesh position={[x + 1.0, 1.45, -1.3]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.56, 0.02, 6, 32]} />
        <meshStandardMaterial color={C.ink} />
      </mesh>
      {/* envelope with stamp */}
      <Box p={[x + 0.2, 0.95, -0.4]} s={[0.8, 0.5, 0.04]} c={C.paper} r={[-0.3, 0.4, 0]} />
      <Box p={[x + 0.45, 1.1, -0.36]} s={[0.18, 0.18, 0.02]} c={C.mustard} r={[-0.3, 0.4, 0]} />
      <Shadow x={x} z={-1.2} r={1.2} />
    </group>
  );
}

const LABELS: Record<StationId, string> = {
  eligibility: "Who can vote",
  register: "Check in / register",
  id: "Show ID (if your state asks)",
  ways: "Early, by mail or Nov 3",
  ballot: "Mark your ballot",
  access: "Accessible voting",
  help: "Get help",
  overseas: "Abroad or military",
};

function Marker({ x, running }: { x: number; running: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = 3.55 + Math.sin(clock.elapsedTime * 2.2) * (running ? 0.08 : 0);
  });
  return (
    <mesh ref={ref} position={[x, 3.55, -2.6]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.18, 0.4, 4]} />
      <meshStandardMaterial color={C.mustard} roughness={0.5} />
    </mesh>
  );
}

function Rig({ index, controls }: { index: number; controls: React.RefObject<OrbitControlsImpl | null> }) {
  const { camera, invalidate } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const camGoal = useMemo(() => new THREE.Vector3(), []);
  const active = useRef(true);
  const timer = useRef(0);
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const x = stationX(index);
    target.set(x, 1.2, -1.2);
    camGoal.set(x + 0.6, 2.4, 5.2);
    active.current = true;
    timer.current = 0;
    if (reduce) {
      camera.position.copy(camGoal);
      controls.current?.target.copy(target);
      controls.current?.update();
    }
    invalidate();
  }, [index, camera, controls, target, camGoal, invalidate, reduce]);

  useFrame((_, dt) => {
    if (!active.current) return;
    timer.current += dt;
    const c = controls.current;
    if (!c) return;
    const k = 1 - Math.pow(0.001, dt);
    camera.position.lerp(camGoal, k * 0.9);
    c.target.lerp(target, k);
    c.update();
    if (camera.position.distanceTo(camGoal) < 0.01 && timer.current > 2.2) active.current = false;
    else invalidate();
  });
  return null;
}

export default function Scene({ index, onPick }: { index: number; onPick?: (i: number) => void }) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const xs = STATION_IDS.map((_, i) => stationX(i));
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0.6, 2.4, 5.2], fov: 42, near: 0.1, far: 80 }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <hemisphereLight args={["#ffffff", "#b9c6cf", 0.95]} />
      <directionalLight position={[6, 9, 6]} intensity={1.1} color="#fff6e3" />
      <fog attach="fog" args={["#e9eef2", 14, 30]} />
      <Room />
      <Entrance x={xs[0]} />
      <CheckIn x={xs[1]} />
      <IdStation x={xs[2]} />
      <Ways x={xs[3]} />
      <Booths x={xs[4]} />
      <Access x={xs[5]} />
      <HelpDesk x={xs[6]} />
      <Overseas x={xs[7]} />
      {STATION_IDS.map((id, i) => (
        <group key={id} onClick={() => onPick?.(i)} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
          <Label x={xs[i]} text={LABELS[id]} />
          <mesh position={[xs[i], 1.2, -1]} visible={false}>
            <boxGeometry args={[4.5, 3.5, 4]} />
          </mesh>
        </group>
      ))}
      <Marker x={xs[index]} running />
      <OrbitControls ref={controls} enablePan={false} enableZoom={false} minPolarAngle={0.9} maxPolarAngle={1.45} minAzimuthAngle={-0.6} maxAzimuthAngle={0.6} enableDamping dampingFactor={0.12} />
      <Rig index={index} controls={controls} />
    </Canvas>
  );
}
