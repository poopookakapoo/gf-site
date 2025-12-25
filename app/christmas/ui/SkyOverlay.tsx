"use client";

import VirtualSkyPanel from "./VirtualSkyPanel";

type Place = {
  id: "me" | "her";
  label: string;
  lat: number;
  lon: number;
  utcIso: string;
};

export default function SkyOverlay({
  place,
  onClose,
}: {
  place: Place;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(980px, 96vw)",
          height: "min(620px, 82vh)",
          background: "rgba(12,10,16,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.88)",
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 650 }}>
              The sky above {place.label}
            </div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 3 }}>
              Same instant for both places: {place.utcIso} (UTC)
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ height: "calc(100% - 58px)" }}>
          <VirtualSkyPanel place={place} />
        </div>
      </div>
    </div>
  );
}
