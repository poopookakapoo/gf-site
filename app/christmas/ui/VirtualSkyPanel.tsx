"use client";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    S?: { virtualsky: (opts: Record<string, any>) => any };
  }
}

type Place = {
  id: "me" | "her";
  label: string;
  lat: number;
  lon: number;
  utcIso: string;
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
      // If it already loaded earlier:
      if ((existing as any).dataset.loaded === "true") resolve();
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = false; // preserve order
    s.onload = () => {
      (s as any).dataset.loaded = "true";
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

export default function VirtualSkyPanel({ place }: { place: Place }) {
  const containerId = useMemo(() => `starmap-${place.id}`, [place.id]);
  const [ready, setReady] = useState(false);
  const initialised = useRef(false);

  const clock = useMemo(() => new Date(place.utcIso), [place.utcIso]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        // These must exist under /public/virtualsky/
        await loadScript("/virtualsky/stuquery.min.js");
        await loadScript("/virtualsky/virtualsky.min.js");
        // Only if you actually have this file; otherwise remove the line
        // Some VirtualSky builds include planets in the main bundle.
        // If you have it, keep it:
        // await loadScript("/virtualsky/virtualsky-planets.js");

        if (!cancelled) setReady(true);
      } catch (e) {
        console.error(e);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (initialised.current) return;

    if (!window.S?.virtualsky) {
      console.error("VirtualSky did not expose window.S.virtualsky. Check script paths and files.");
      return;
    }

    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";

    window.S.virtualsky({
  id: containerId,
  latitude: place.lat,
  longitude: place.lon,
  clock,
  live: false,

  projection: "stereo",
  gradient: true,
  ground: true,

  // Stars: keep, but not too dense
  showstars: true,
  magnitude: 5.8,       // fewer faint stars than 6.5
  scalestars: 1.35,     // slightly bigger stars (easier to read)

  // Constellations: turn OFF the boundary clutter, keep only simple stick figures OR none
  constellations: true,
  constellationboundaries: false, // IMPORTANT if supported by your build
  constellationlabels: true,       // show names like “Orion” (helpful)
  // If labels feel too busy, set to false and use our own overlay text

  // Remove extra reference lines that confuse people (if supported)
  gridlines_az: false,
  gridlines_eq: false,
  ecliptic: false,

  // Galaxy: turn down or off (can look like “noise”)
  showgalaxy: false,

  // Planets: keep + label (these are the most intuitive anchors)
  showplanets: true,
  showplanetlabels: true,

  // Moon/Sun are intuitive; keep them visible and labelled
  // (VirtualSky includes them with planets in many builds)

  // Make it feel like “a view”, not a chart
  mouse: true,
  keyboard: false,
  showdate: false,      // you already show the time in your modal header
  showposition: false,

  // Orient roughly “south” by default
  az: 180,
});


    initialised.current = true;
  }, [ready, containerId, place.lat, place.lon, clock]);

  return (
    <div
      id={containerId}
      style={{ width: "100%", height: "100%", background: "rgb(6,6,10)" }}
    />
  );
}
