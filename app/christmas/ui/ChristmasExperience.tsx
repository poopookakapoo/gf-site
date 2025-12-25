"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import SkyOverlay from "./SkyOverlay";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

type Place = {
  id: "me" | "her";
  label: string;
  lat: number;
  lon: number;
  utcIso: string; // same instant for both
};

export default function ChristmasExperience() {
  // Lugano: 2 Nov 2024 01:30 CET => 2024-11-02T00:30:00Z
  const SKY_UTC = "2024-11-02T00:30:00.000Z";

  const places = useMemo<Place[]>(
    () => [
      { id: "me", label: "Lugano", lat: 46.0101, lon: 8.96, utcIso: SKY_UTC },
      { id: "her", label: "Sacramento", lat: 38.580657, lon: -121.494803, utcIso: SKY_UTC },
    ],
    []
  );

  const [active, setActive] = useState<Place | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Overlay UI */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "rgba(255,255,255,0.88)",
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 720 }}>Under the Same Sky</div>
          <div style={{ marginTop: 6, fontSize: 13, opacity: 0.75 }}>
            Click Lugano or Sacramento.
          </div>
        </div>

        <div style={{ position: "absolute", top: 108, left: 24, pointerEvents: "auto" }}>
          <PlacePill label="Sacramento" onClick={() => setActive(places[1])} />
        </div>

        <div style={{ position: "absolute", top: 108, right: 24, pointerEvents: "auto" }}>
          <PlacePill label="Lugano" onClick={() => setActive(places[0])} />
        </div>
      </div>

      {/* 3D */}
      <GlobeScene
        textureUrl="/textures/earth.jpg"
        places={places}
        onPlaceSelected={setActive}
      />

      {/* Sky */}
      {active && <SkyOverlay place={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function PlacePill({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "rgba(255,255,255,0.88)",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        fontSize: 16,
        fontWeight: 650,
        letterSpacing: "0.01em",
        cursor: "pointer",
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0,0,0,0.35)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0,0,0,0.25)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: "#ff9fc8",
          boxShadow: "0 0 16px rgba(255,159,200,0.55)",
          flex: "0 0 auto",
        }}
      />
      <span>{label}</span>
    </button>
  );
}

