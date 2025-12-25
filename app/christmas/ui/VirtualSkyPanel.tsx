"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type VirtualSkyProjection = "stereo" | "polar" | "gnomic" | "ortho" | "planechart";

interface VirtualSkyOptions {
  id: string;
  latitude: number;
  longitude: number;
  clock?: Date;
  live?: boolean;

  projection?: VirtualSkyProjection;
  gradient?: boolean;
  ground?: boolean;

  showstars?: boolean;
  magnitude?: number;
  scalestars?: number;

  constellations?: boolean;
  constellationboundaries?: boolean;
  constellationlabels?: boolean;

  gridlines_az?: boolean;
  gridlines_eq?: boolean;
  ecliptic?: boolean;

  showgalaxy?: boolean;

  showplanets?: boolean;
  showplanetlabels?: boolean;

  mouse?: boolean;
  keyboard?: boolean;
  showdate?: boolean;
  showposition?: boolean;

  az?: number;

  // Permit additional options without 'any'
  [key: string]: unknown;
}

type VirtualSkyFn = (opts: VirtualSkyOptions) => unknown;

declare global {
  interface Window {
    S?: { virtualsky: VirtualSkyFn };
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
    const existing = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(`Failed to load ${src}`)),
      );
      // If it already loaded earlier:
      if (existing.dataset.loaded === "true") resolve();
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = false; // preserve order
    s.onload = () => {
      s.dataset.loaded = "true";
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
      console.error(
        "VirtualSky did not expose window.S.virtualsky. Check script paths and files.",
      );
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
      magnitude: 5.8, // fewer faint stars than 6.5
      scalestars: 1.35, // slightly bigger stars (easier to read)

      // Constellations: reduce clutter
      constellations: true,
      constellationboundaries: false,
      constellationlabels: true,

      // Remove extra reference lines
      gridlines_az: false,
      gridlines_eq: false,
      ecliptic: false,

      // Galaxy: turn down or off
      showgalaxy: false,

      // Planets
      showplanets: true,
      showplanetlabels: true,

      // Make it feel like “a view”, not a chart
      mouse: true,
      keyboard: false,
      showdate: false,
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
