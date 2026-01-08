'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import styles from './birthday.module.css';

type Rgb = { r: number; g: number; b: number };

type CreatejsDisplayObject = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  alpha: number;
};

type CreatejsGraphics = {
  clear(): CreatejsGraphics;
  beginFill(fill: string): CreatejsGraphics;
  drawCircle(x: number, y: number, radius: number): CreatejsGraphics;
  endFill(): CreatejsGraphics;
};

type CreatejsShape = CreatejsDisplayObject & {
  graphics: CreatejsGraphics;
};

type CreatejsContainer = CreatejsDisplayObject & {
  addChild(child: CreatejsDisplayObject): void;
  removeAllChildren(): void;
};

type StagePointerEvent = {
  stageX: number;
  stageY: number;
};

type CreatejsStage = CreatejsContainer & {
  enableMouseOver(frequency: number): void;
  update(): void;
  on(event: 'stagemousemove', handler: (evt: StagePointerEvent) => void): void;
  on(event: 'stagemousedown', handler: () => void): void;
  removeAllEventListeners(): void;
};

type CreatejsTicker = {
  framerate: number;
  addEventListener(event: 'tick', handler: () => void): void;
  removeEventListener(event: 'tick', handler: () => void): void;
};

type CreatejsNamespace = {
  Stage: new (canvas: HTMLCanvasElement) => CreatejsStage;
  Container: new () => CreatejsContainer;
  Shape: new () => CreatejsShape;
  Ticker: CreatejsTicker;
};

type FlowerRndInstance = {
  init(): FlowerRndInstance;
  setColor(hex: string): FlowerRndInstance;
  setPetal(petals: number): FlowerRndInstance;
  setPile(a: number, b: number): FlowerRndInstance;
  setNoise(noise: number): FlowerRndInstance;
  setAlpha(alpha: number): FlowerRndInstance;
  setSize(size: number): FlowerRndInstance;
  setPetalSize(size: number): FlowerRndInstance;
  create(x: number, y: number): FlowerRndInstance;
  flower: CreatejsDisplayObject;
};

type FlowerRndCtor = new () => FlowerRndInstance;

declare global {
  interface Window {
    createjs?: CreatejsNamespace;
    FlowerRnd?: FlowerRndCtor;
  }
}

type BloomSpot = {
  x: number;
  y: number;
  baseSize: number;
  layers: number;
  petals: number;
  noise: number;
};

type BloomContainer = CreatejsContainer & { baseX?: number };

type ConfettiOrigin = { x: number; y: number };

type ConfettiOptions = {
  colors?: readonly string[];
  disableForReducedMotion?: boolean;
  useWorker?: boolean;
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  scalar?: number;
  ticks?: number;
  origin?: ConfettiOrigin;
};

type ConfettiFn = (opts?: ConfettiOptions) => void;

const HER_NAME = 'Yeva';
const AGE = 18;

const VERSE = {
  reference: 'Song of Songs 8:6',
  text: '“Love is as strong as death… Its flashes are flashes of fire.”',
};

const PALETTE = [
  '#FFB3D9',
  '#FF6FB1',
  '#FFC3A0',
  '#FFD6E7',
  '#CDB4FF',
  '#BDE0FE',
  '#FFF1B6',
  '#FDE2FF',
  '#FF8CCB',
  '#F7F7FF',
] as const;

export default function BirthdayPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [ready, setReady] = useState(false);
  const [confettiOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const confettiRef = useRef<ConfettiFn | null>(null);
  const didIntro = useRef(false);

  const bloomSpots = useMemo<BloomSpot[]>(
    () => [
      { x: 0, y: -170, baseSize: 70, layers: 14, petals: 13, noise: 1.1 },
      { x: -95, y: -135, baseSize: 60, layers: 13, petals: 12, noise: 1.12 },
      { x: 95, y: -135, baseSize: 60, layers: 13, petals: 12, noise: 1.12 },

      { x: -165, y: -85, baseSize: 54, layers: 12, petals: 11, noise: 1.14 },
      { x: 165, y: -85, baseSize: 54, layers: 12, petals: 11, noise: 1.14 },

      { x: -60, y: -82, baseSize: 50, layers: 12, petals: 10, noise: 1.14 },
      { x: 60, y: -82, baseSize: 50, layers: 12, petals: 10, noise: 1.14 },

      { x: -25, y: -118, baseSize: 38, layers: 10, petals: 10, noise: 1.1 },
      { x: 25, y: -118, baseSize: 38, layers: 10, petals: 10, noise: 1.1 },
    ],
    []
  );

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;

    const apply = () => setReducedMotion(Boolean(mq.matches));
    apply();

    if (mq.addEventListener) {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }

    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  // Load canvas-confetti if installed
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const modUnknown: unknown = await import('canvas-confetti');
        const mod = modUnknown as { default?: unknown };

        const candidate = mod?.default ?? modUnknown;
        const fn = typeof candidate === 'function' ? (candidate as ConfettiFn) : null;

        if (!cancelled) confettiRef.current = fn;
      } catch {
        if (!cancelled) confettiRef.current = null;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const fireConfetti = useCallback(
    (kind: 'intro' | 'celebrate') => {
      if (reducedMotion) return;
      if (!confettiOn) return;

      const confetti = confettiRef.current;
      if (!confetti) return;

      const base: ConfettiOptions = {
        colors: [...PALETTE],
        disableForReducedMotion: true,
        useWorker: true,
      };

      if (kind === 'intro') {
        confetti({
          ...base,
          particleCount: 120,
          spread: 85,
          startVelocity: 26,
          scalar: 0.95,
          ticks: 240,
          origin: { x: 0.5, y: 0.22 },
        });
        confetti({
          ...base,
          particleCount: 80,
          spread: 110,
          startVelocity: 20,
          scalar: 0.85,
          ticks: 220,
          origin: { x: 0.5, y: 0.28 },
        });
        return;
      }

      confetti({
        ...base,
        particleCount: 220,
        spread: 100,
        startVelocity: 42,
        scalar: 1.0,
        ticks: 320,
        origin: { x: 0.5, y: 0.18 },
      });
      confetti({
        ...base,
        particleCount: 160,
        spread: 120,
        startVelocity: 34,
        scalar: 0.95,
        ticks: 300,
        origin: { x: 0.18, y: 0.22 },
      });
      confetti({
        ...base,
        particleCount: 160,
        spread: 120,
        startVelocity: 34,
        scalar: 0.95,
        ticks: 300,
        origin: { x: 0.82, y: 0.22 },
      });

      confetti({
        ...base,
        particleCount: 140,
        spread: 160,
        startVelocity: 28,
        scalar: 0.75,
        ticks: 260,
        origin: { x: 0.5, y: 0.22 },
      });
    },
    [confettiOn, reducedMotion]
  );

  // ---- Flower canvas (EaselJS/FlowerJS) ----
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const cjMaybe = window.createjs;
    const frMaybe = window.FlowerRnd;
    if (!cjMaybe || !frMaybe) return;

    // Assert stable, non-optional references for TypeScript (and for closures).
    const createjs: CreatejsNamespace = cjMaybe;
    const FlowerRnd: FlowerRndCtor = frMaybe;

    const stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);

    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      cssW = rect.width;
      cssH = rect.height;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      stage.scaleX = dpr;
      stage.scaleY = dpr;

      stage.update();
    };

    const bouquet = new createjs.Container();
    stage.addChild(bouquet);

    const W = () => cssW;
    const H = () => cssH;

    const anchorX = () => W() / 2;

    // If the bouquet feels too high/low, adjust only this multiplier.
    // 0.56 (higher), 0.66 (lower).
    const anchorY = () => H() * 0.66;

    bouquet.x = anchorX();
    bouquet.y = anchorY();

    const blooms = new createjs.Container();
    bouquet.addChild(blooms);

    const bloomContainers: BloomContainer[] = [];

    const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

    const hexToRgb = (hex: string): Rgb => {
      const h = hex.replace('#', '').trim();
      const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
      const n = parseInt(full, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    };

    const rgbToHex = (rgb: Rgb) => {
      const to2 = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
      return `#${to2(rgb.r)}${to2(rgb.g)}${to2(rgb.b)}`;
    };

    const mix = (a: Rgb, b: Rgb, t: number): Rgb => ({
      r: a.r * (1 - t) + b.r * t,
      g: a.g * (1 - t) + b.g * t,
      b: a.b * (1 - t) + b.b * t,
    });

    const shade = (rgb: Rgb, factor: number): Rgb => ({
      r: rgb.r * factor,
      g: rgb.g * factor,
      b: rgb.b * factor,
    });

    const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

    const colourForLayer = (baseHex: string, t: number) => {
      const base = hexToRgb(baseHex);
      const outer = mix(base, { r: 255, g: 255, b: 255 }, 0.14);
      const inner = shade(base, 0.8);
      const blended = mix(outer, inner, t);
      return rgbToHex(blended);
    };

    const glitter = new createjs.Shape();
    blooms.addChild(glitter);

    const drawGlitter = () => {
      glitter.graphics.clear();
      const g = glitter.graphics;
      for (let i = 0; i < 26; i++) {
        const x = (Math.random() * 520 - 260) * 0.75;
        const y = (Math.random() * 360 - 220) * 0.75;
        const r = 2 + Math.random() * 6;
        const col = pick(PALETTE);
        g.beginFill(col).drawCircle(x, y, r).endFill();
      }
      glitter.alpha = 0.08;
    };

    function makeLayeredBloom(spot: BloomSpot) {
      const container: BloomContainer = new createjs.Container();
      container.x = spot.x;
      container.y = spot.y;
      container.baseX = spot.x;

      const halo = new createjs.Shape();
      halo.graphics.beginFill('rgba(255,255,255,0.012)').drawCircle(0, 0, spot.baseSize * 0.92).endFill();
      halo.x = spot.x;
      halo.y = spot.y;
      blooms.addChild(halo);

      let size = spot.baseSize;
      const baseHex = pick(PALETTE);

      for (let j = 0; j < spot.layers; j++) {
        const tt = spot.layers <= 1 ? 1 : j / (spot.layers - 1);
        const colorHex = colourForLayer(baseHex, tt);

        const f = new FlowerRnd();
        f.init()
          .setColor(colorHex)
          .setPetal(spot.petals)
          .setPile(1, 1.0)
          .setNoise(spot.noise)
          .setAlpha(1)
          .setSize(size)
          .setPetalSize(size + 6)
          .create(0, 0);

        container.addChild(f.flower);

        size -= 2.05;
        if (size < 18) break;
      }

      const centre = new createjs.Shape();
      centre.graphics.beginFill('#3A2A2A').drawCircle(0, 0, Math.max(5, spot.baseSize * 0.095)).endFill();
      centre.alpha = 0.18;
      container.addChild(centre);

      blooms.addChild(container);
      bloomContainers.push(container);
    }

    const rebuild = () => {
    // Scale bouquet down on smaller canvases so it does not clip on mobile.
    const s = clamp(Math.min(W() / 560, H() / 620), 0.78, 1);

    bouquet.scaleX = s;
    bouquet.scaleY = s;

    bouquet.x = anchorX();
    // Slightly push down when scaled smaller, so it still sits nicely in-frame.
    bouquet.y = anchorY() + (1 - s) * 36;

    blooms.removeAllChildren();
    bloomContainers.length = 0;

    drawGlitter();

    const sorted = [...bloomSpots].sort((a, b) => a.y - b.y);
    for (const spot of sorted) makeLayeredBloom(spot);

    stage.update();
    };


    resize();
    rebuild();

    if (!didIntro.current) {
      didIntro.current = true;
      window.setTimeout(() => fireConfetti('intro'), 220);
    }

    let targetLean = 0;
    let currentLean = 0;
    let clickPulse = 0;
    let sparkle = 0;

    stage.on('stagemousemove', (evt) => {
      if (reducedMotion) return;
      const nx = W() > 0 ? evt.stageX / W() : 0.5;
      targetLean = (nx - 0.5) * 170;
    });

    stage.on('stagemousedown', () => {
      clickPulse = 1;
      sparkle = 1;
      fireConfetti('celebrate');
    });

    const tick = () => {
      if (reducedMotion) {
        stage.update();
        return;
      }

      currentLean += (targetLean - currentLean) * 0.085;

      bouquet.x = anchorX() + currentLean * 0.08;
      bouquet.rotation = (currentLean / 180) * 2.1;

      const pulse = 1 + clickPulse * 0.11;
      for (const c of bloomContainers) {
        const baseX = c.baseX ?? c.x;
        c.x = baseX + currentLean * 0.15;
        c.scaleX = pulse;
        c.scaleY = pulse;
      }

      glitter.scaleX = 1 + sparkle * 0.06;
      glitter.scaleY = 1 + sparkle * 0.06;
      sparkle = Math.max(0, sparkle - 0.04);

      clickPulse = Math.max(0, clickPulse - 0.05);
      stage.update();
    };

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener('tick', tick);

    const onResize = () => {
      resize();
      rebuild();
    };
    window.addEventListener('resize', onResize);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickPulse = 1;
        sparkle = 1;
        fireConfetti('celebrate');
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      createjs.Ticker.removeEventListener('tick', tick);
      stage.removeAllEventListeners();
      stage.removeAllChildren();
      stage.update();
    };
  }, [ready, bloomSpots, reducedMotion, fireConfetti]);

  return (
    <main className={styles.page}>
      <div className={styles.girlyGlow} aria-hidden="true" />
      <div className={styles.heartsDust} aria-hidden="true" />
      <div className={styles.glitterVeil} aria-hidden="true" />

      <div className={styles.container}>
        {/* FlowerJS dependencies */}
        <Script src="/flowerjs/easeljs.js" strategy="afterInteractive" />
        <Script src="/flowerjs/tweenjs_ex.js" strategy="afterInteractive" />
        <Script src="/flowerjs/flowerjs.js" strategy="afterInteractive" onLoad={() => setReady(true)} />

        <header className={styles.header} aria-label="Page header">
          <div className={styles.stamp} aria-label={`${AGE} years old`}>
            <span className={styles.stampNumber}>{AGE}</span>
            <span className={styles.stampLabel}>years</span>
          </div>

          <div className={styles.headerMeta}>
            <div className={styles.kicker}>A small digital bouquet</div>
            <h1 className={styles.title}>{HER_NAME}</h1>
            <p className={styles.subtitle}>A little website page for my baby&apos;s birthday.</p>
          </div>
        </header>

        <section className={styles.grid} aria-label="Main content">
          <article className={styles.letter} aria-label="Message">
            <p className={styles.lede}>
              I wish you a fantastic birthday my super amazing baby princess. You make me the proudest man in the world
              with all the love you constantly show me. Today you became an adult and I&apos;m so grateful to be the man
              that is with you. Keep being the amazing girl you are I&apos;m really proud of who you are sweetheart. I
              love you forever and more, always remember that.
            </p>

            <div className={styles.rule} aria-hidden="true" />

            <h2 className={styles.sectionTitle}>A note</h2>
            <p className={styles.bodyText}>
              The bouquet follows the mouse a little and it does the confetti too if u click on them :)
            </p>

            <blockquote className={styles.quote} aria-label="Verse">
              <p className={styles.quoteText}>{VERSE.text}</p>
              <footer className={styles.quoteCite}>{VERSE.reference}</footer>
            </blockquote>

            <div className={styles.toolbar} aria-label="Controls">
              <button
                type="button"
                className={styles.primary}
                onClick={() => fireConfetti('celebrate')}
                disabled={reducedMotion}
                title={reducedMotion ? 'Disabled due to reduced motion preference' : 'Celebrate'}
              >
                Celebrate
              </button>

              <button
                type="button"
                className={styles.secondary}
                onClick={() => fireConfetti('intro')}
                disabled={reducedMotion}
              >
                Gentle sparkle
              </button>
            </div>
          </article>

          <figure className={styles.frame} aria-label="Bouquet">
            <div className={styles.canvasFrame}>
              <div className={styles.canvasClip}>
                <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive bouquet" />
                <div className={styles.hint} aria-hidden="true">
                  Move · Click · Enter/Space
                </div>
              </div>
            </div>
            <figcaption className={styles.caption}>Interactive bouquet</figcaption>
          </figure>
        </section>

        <footer className={styles.footer}>Made with care.</footer>
      </div>
    </main>
  );
}
