import styles from "./page.module.css";
import { Dancing_Script, Quicksand } from "next/font/google";

const displayFont = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

type FlowerProps = {
  x: number;
  y: number;
  petals?: number;
  rx?: number;
  ry?: number;
  rotation?: number;
  scale?: number;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string:
  center: string;
  center2?: string;
  opacity?: number;
};

function Flower({
  x,
  y,
  petals = 10,
  rx = 14,
  ry = 22,
  rotation = 0,
  scale = 1,
  c1,
  c2,
  center,
  center2 = "#fff4c9",
  opacity = 0.98,
}: FlowerProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}>
      <circle r={Math.max(10, rx * 0.9)} fill="#ffe2f0" opacity="0.75" />
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy={-ry - 10}
          rx={rx}
          ry={ry}
          fill={i % 2 === 0 ? c1 : c2}
          transform={`rotate(${(360 / petals) * i})`}
        />
      ))}
      <circle r={Math.max(6, rx * 0.45)} fill={center} />
      <circle r={Math.max(3.5, rx * 0.25)} fill={center2} opacity="0.95" />
    </g>
  );
}

function BabyBreath({
  x,
  y,
  scale = 1,
  rotation = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
}) {
  const dots = [
    { dx: 0, dy: 0, r: 4.5 },
    { dx: -18, dy: -8, r: 3.8 },
    { dx: 18, dy: -10, r: 3.6 },
    { dx: -10, dy: 14, r: 3.3 },
    { dx: 14, dy: 12, r: 3.2 },
    { dx: 0, dy: -18, r: 3.2 },
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} opacity="0.95">
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={d.dx} cy={d.dy} r={d.r} fill="#ffffff" />
          <circle cx={d.dx} cy={d.dy} r={Math.max(1.6, d.r * 0.45)} fill="#fff4c9" opacity="0.85" />
        </g>
      ))}
    </g>
  );
}

function BouquetIllustration() {
  return (
    <div className={styles.bouquetWrap} aria-hidden="true">
      <svg className={styles.bouquet} viewBox="0 0 640 640" role="img" aria-label="Bouquet illustration">
        <defs>
          <linearGradient id="halo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd6e8" stopOpacity="0.88" />
            <stop offset="1" stopColor="#e7ddff" stopOpacity="0.86" />
          </linearGradient>

          <linearGradient id="wrapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff9fd" />
            <stop offset="1" stopColor="#f6eaff" />
          </linearGradient>

          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7ce0b0" />
            <stop offset="1" stopColor="#2fa46f" />
          </linearGradient>

          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9ffe7" />
            <stop offset="1" stopColor="#74e3bb" />
          </linearGradient>

          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000" floodOpacity="0.18" />
          </filter>

          <filter id="bloom" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Halo */}
        <circle cx="320" cy="250" r="230" fill="url(#halo)" />

        {/* Tiny hearts in the halo (subtle) */}
        <g opacity="0.25">
          {[
            { x: 165, y: 185, s: 0.9, r: -10 },
            { x: 465, y: 175, s: 0.8, r: 12 },
            { x: 505, y: 290, s: 0.75, r: 22 },
            { x: 140, y: 305, s: 0.75, r: -18 },
          ].map((h, i) => (
            <g key={i} transform={`translate(${h.x} ${h.y}) rotate(${h.r}) scale(${h.s})`}>
              <path
                d="M0 12 C0 -4, 22 -4, 22 12 C22 26, 0 38, 0 48 C0 38, -22 26, -22 12 C-22 -4, 0 -4, 0 12 Z"
                fill="#ffffff"
              />
            </g>
          ))}
        </g>

        {/* Stems + leaves */}
        <g filter="url(#softShadow)">
          <path d="M260 520 C265 425, 285 385, 310 330" fill="none" stroke="url(#stemGrad)" strokeWidth="11" strokeLinecap="round" />
          <path d="M320 530 C325 430, 335 392, 340 325" fill="none" stroke="url(#stemGrad)" strokeWidth="11" strokeLinecap="round" />
          <path d="M385 520 C372 430, 370 390, 350 335" fill="none" stroke="url(#stemGrad)" strokeWidth="11" strokeLinecap="round" />
          <path d="M295 522 C298 445, 304 410, 325 355" fill="none" stroke="url(#stemGrad)" strokeWidth="9" strokeLinecap="round" opacity="0.92" />
          <path d="M355 524 C355 450, 354 412, 338 355" fill="none" stroke="url(#stemGrad)" strokeWidth="9" strokeLinecap="round" opacity="0.92" />

          {/* Leaves (more + nicer shading) */}
          <path d="M255 440 C215 440, 205 405, 235 386 C270 362, 295 402, 255 440 Z" fill="url(#leafGrad)" opacity="0.95" />
          <path d="M395 440 C435 440, 445 405, 415 386 C380 362, 355 402, 395 440 Z" fill="url(#leafGrad)" opacity="0.95" />
          <path d="M300 410 C265 405, 255 378, 280 362 C305 345, 320 378, 300 410 Z" fill="#a9f4d6" opacity="0.95" />
          <path d="M340 410 C375 405, 385 378, 360 362 C335 345, 320 378, 340 410 Z" fill="#a9f4d6" opacity="0.95" />
          <path d="M290 360 C262 350, 265 323, 290 320 C315 317, 320 350, 290 360 Z" fill="#89e6bd" opacity="0.9" />
          <path d="M350 360 C378 350, 375 323, 350 320 C325 317, 320 350, 350 360 Z" fill="#89e6bd" opacity="0.9" />
        </g>

        {/* Flowers */}
        <g filter="url(#bloom)">
          {/* Main bouquet blossoms (more of them) */}
          <Flower x={320} y={185} petals={12} rx={18} ry={28} c1="#ff5fa0" c2="#ff8cbd" center="#ffe078" rotation={-6} scale={1.15} />
          <Flower x={260} y={220} petals={11} rx={16} ry={24} c1="#ff4a98" c2="#ff80b6" center="#ffe078" rotation={-14} scale={1.0} />
          <Flower x={390} y={225} petals={11} rx={16} ry={24} c1="#ff4a98" c2="#ff80b6" center="#ffe078" rotation={12} scale={1.0} />

          {/* Lavender accents */}
          <Flower x={295} y={265} petals={10} rx={14} ry={20} c1="#b99cff" c2="#d9ccff" center="#fff4c9" rotation={-10} scale={0.95} />
          <Flower x={350} y={270} petals={10} rx={14} ry={20} c1="#b99cff" c2="#d9ccff" center="#fff4c9" rotation={14} scale={0.95} />
          <Flower x={235} y={260} petals={9} rx={12} ry={18} c1="#c8b6ff" c2="#eee6ff" center="#fff4c9" rotation={-22} scale={0.9} opacity={0.97} />
          <Flower x={410} y={260} petals={9} rx={12} ry={18} c1="#c8b6ff" c2="#eee6ff" center="#fff4c9" rotation={22} scale={0.9} opacity={0.97} />

          {/* Extra pink blooms around the top */}
          <Flower x={235} y={190} petals={10} rx={13} ry={20} c1="#ff6aa8" c2="#ff9cc6" center="#ffe078" rotation={-24} scale={0.95} />
          <Flower x={405} y={190} petals={10} rx={13} ry={20} c1="#ff6aa8" c2="#ff9cc6" center="#ffe078" rotation={22} scale={0.95} />
          <Flower x={320} y={240} petals={10} rx={12} ry={18} c1="#ff7fb3" c2="#ffd1e6" center="#ffe078" rotation={0} scale={0.9} />

          {/* Baby’s breath clusters */}
          <BabyBreath x={210} y={240} scale={1.0} rotation={-10} />
          <BabyBreath x={440} y={245} scale={1.0} rotation={14} />
          <BabyBreath x={275} y={205} scale={0.9} rotation={-18} />
          <BabyBreath x={365} y={205} scale={0.9} rotation={18} />
          <BabyBreath x={320} y={300} scale={0.85} rotation={0} />

          {/* Sparkles (a few more) */}
          {[
            { x: 150, y: 155, s: 1.0 },
            { x: 492, y: 152, s: 0.9 },
            { x: 520, y: 290, s: 0.85 },
            { x: 120, y: 290, s: 0.8 },
            { x: 455, y: 330, s: 0.75 },
            { x: 185, y: 330, s: 0.75 },
          ].map((p, idx) => (
            <g key={idx} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} opacity="0.9">
              <path d="M0 -11 L2 -2 L11 0 L2 2 L0 11 L-2 2 L-11 0 L-2 -2 Z" fill="#ffffff" />
              <circle cx="0" cy="0" r="2.2" fill="#fff4c9" opacity="0.9" />
            </g>
          ))}
        </g>

        {/* Wrap + ribbon */}
        <g filter="url(#softShadow)">
          {/* Paper wrap */}
          <path
            d="M190 320
               C225 288, 265 275, 320 275
               C375 275, 415 288, 450 320
               L405 565
               C385 595, 360 615, 320 622
               C280 615, 255 595, 235 565
               Z"
            fill="url(#wrapGrad)"
            stroke="#f2d6ff"
            strokeWidth="3"
          />

          {/* Inner fold + highlight */}
          <path
            d="M235 338
               C258 318, 286 308, 320 308
               C354 308, 382 318, 405 338
               L382 560
               C365 585, 348 598, 320 603
               C292 598, 275 585, 258 560
               Z"
            fill="#fff1f9"
            opacity="0.86"
          />
          <path
            d="M410 340
               C388 318, 356 304, 320 304
               C286 304, 254 318, 230 340"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Ribbon (larger + nicer tails) */}
          <g transform="translate(320 465)">
            <path
              d="M-92 0
                 C-54 -34, -26 -34, -8 -10
                 C-30 12, -56 28, -92 18
                 Z"
              fill="#ff6aa8"
              opacity="0.97"
            />
            <path
              d="M92 0
                 C54 -34, 26 -34, 8 -10
                 C30 12, 56 28, 92 18
                 Z"
              fill="#ff6aa8"
              opacity="0.97"
            />
            <circle r="18" fill="#ff3f8f" />
            <path d="M-6 16 L-32 88 L-8 78 L-2 98 L18 78 L42 88 L10 16 Z" fill="#ff4e97" opacity="0.95" />
            <path d="M0 16 L-18 92 L0 82 L18 92 Z" fill="#ff2f86" opacity="0.78" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Page() {
  return (
    <main className={`${styles.page} ${displayFont.variable} ${bodyFont.variable}`}>
      <section className={styles.card}>
        <div className={styles.sparkles} aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={styles.sparkle} />
          ))}
        </div>

        <BouquetIllustration />

        {/* Replace with your own text */}
        <h1 className={styles.title}>I LOVE YOU</h1>
        <p className={styles.message}>
          I love you for eternity my sweet baby princess. You mean the entire world to me. I wanna be your husband my sweet baby princess. I wanna protect this amazing girl and love you forever. You mean the entire world to me baby. I can't wait to marry you and be happy forever.
        </p>  
      </section>
    </main>
  );
}
