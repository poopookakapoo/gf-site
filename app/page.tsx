'use client';
import { useEffect, useRef, useState, useMemo } from 'react';

/* =====================================
   CONFIG & CONSTANTS
===================================== */
const ACCESS_CODE = '010808';
const YEVA = 'Yeva';
const HER_TIMEZONE_RAW = 'America/Tijuana';
const YOUR_TIMEZONE_RAW = Intl.DateTimeFormat().resolvedOptions().timeZone;

const TAGLINE = "My Baby's website Website";
const QUOTE =
  '“Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. – Joshua 1:9”';

const OPEN_WHEN = [
  {
    title: 'Open when you can’t sleep',
    hint: 'Remember that sleeping is important ni ☝️',
    body: `Baby Princess! GRRR You should be always able to sleep like a gorgeous baby. Well sweetheart try to push the bad thoughts away. To close ur eyes and relax. I love you so much u bettah always be able to sleep`,
  },
  {
    title: 'Open when crying',
    hint: 'My baby princess is too pretty to cry, nuhuh not allowed to',
    body: `Awhhhhh gorgeous baby if you're reading this it means ur crying :( and that is okay baby, is good to cry it pushed all the bad thoughts away. Im always here for you baby princess and I want you to know it all the time, if im sleeping imagine that im awake, I would comfort you and protect you all the time. You always have a shoulder to cry Yeva, that is me and it always will be. When i see you cry i cant just stand there not caring, I always want to be close to you, show you love and comfort you. Thats what a bf is there for. I love you so much.`,
  },
  {
    title: 'Open when you dont feel enough',
    hint: 'Which is BAD but happens ✌️🫩',
    body: `YEVA NUHUH not good. Sweetheart you're always more than enough, you always do more than what you should do. Youre always there for me, you always show me love and you NEVER make me smile, not even for a second im sad. You ARE enough, more than that and you always will be for me. Never and ever doubt that again okay sweet princess? I love you so much.`,
  },
  {
    title: 'Open when you dont like yourself',
    hint: 'HEY 😾 who allowed u huh',
    body: `Awhhhh my sweet baby princess you CANT think of that. Baby u have a super obsessed bf, im genuinely obsessed with everything of you, your personality, your soul and your body. Even Jacob said it haha youre one in a million but in my opion baby youre one of a kind, noone can match how perfect and special you are. I love you forever and more and I cant wait to finally meet you so you have your final proof haha the proof that YES ur bf is obsessed, hes gonna love you forever and truly wants to be with you for the rest of his life. I mean it sweet princess. So much. I want you to be strong, to relax, to stop thinking "im not enough" cus sweetheart you are youre GORGEOUS, youre PERFECT, youre BEAUTIFUL, youre AMAZING, youre JAW DROPPING and SO MUCH more so YES baby youre not just good enough youre simply a super pretty model.`
  },
  {
    title: 'Open when youre tired',
    hint: 'Take a nap or make sum coffee idk babe',
    body: `AWWWWWWWW HEHE is my baby princess sleepy HEHE SOSOSOSOSOSOSOSO adorable and cute HEHEHE MWAH MWAH MWAH MWAH MWAH MWAH cmere and sleep in my arms baby princess`,
  },
  {
    title: 'Open when you need some love',
    hint: 'Cmere my gorgeous baby princess',
    body: `HEHEHEHEHEHEHEHE what am i here for if NOT to show u some love hehehehe MWAH MWAH MWAH MWAH MWAH I love you SOSOSOSOSOSO much sweet baby princess MWAHHHHHHHHHHH`,
  },
  {
    title: 'Open when youre sick',
    hint: 'GRRRRRRR NOT GOOD',
    body: `AWHHH My poor baby princess :( if youre reading sick is because youre sick and maybe is late at night and you cant sleep eiher. Well make sure youre well covered that you keep yoursel ALLLL warm and to relax. Maybe pray a little and then NO MORE PHONE OKAY?? I love you SOOOOOO much sweet baby princess be strong and you WILL feel better MWAH MWAH MWAH MWAH`,
  },
];

/* =====================================
   HOOKS
===================================== */

/** Detects if viewport ≥ 768 px (desktop). */
function useIsDesktop(query = '(min-width: 768px)') {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isDesktop;
}

export function useNow(frame: boolean = true): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize once on mount
    setNow(new Date());

    if (!frame) {
      // Update every 1 second — lighter for static clocks or timestamps
      const intervalId = window.setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(intervalId);
    }

    // High-frequency updates — smoother for analog clock animation
    let rafId = 0;
    const tick = () => {
      setNow(new Date());
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [frame]);

  return now;
}

/* =====================================
   HELPERS
===================================== */
function safeTimeZone(tz: string, fallback = 'UTC') {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return fallback;
  }
}

/* =====================================
   SMALL ANALOG CLOCK COMPONENT
===================================== */
function SmallClock({ tz, label }: { tz: string; label: string }) {
  const now = useNow(true);
  const parts = useMemo(() => {
    if (!now) return null;
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).formatToParts(now);
  }, [now, tz]);

  if (!now || !parts) return null;
  const v = (t: string) => Number(parts.find(p => p.type === t)?.value ?? 0);
  const h = v('hour'), m = v('minute'), s = v('second');
  const ms = now.getMilliseconds();
  const sec = s + ms / 1000;
  const min = m + sec / 60;
  const hr = (h % 12) + min / 60;
  const secA = sec * 6, minA = min * 6, hrA = hr * 30;

  return (
    <div className="clockCard" style={{ width: 140, margin: '0 auto' }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: 'auto' }}>
        <circle cx="100" cy="100" r="95" fill="#0d1116" stroke="var(--line)" strokeWidth="1" />
        {[...Array(60)].map((_, i) => {
          const a = (i / 60) * 2 * Math.PI;
          const R1 = 90, R2 = i % 5 === 0 ? 82 : 88;
          const x1 = 100 + R1 * Math.sin(a);
          const y1 = 100 - R1 * Math.cos(a);
          const x2 = 100 + R2 * Math.sin(a);
          const y2 = 100 - R2 * Math.cos(a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 5 === 0 ? 'var(--accent-3)' : 'var(--ink)'}
              strokeOpacity={i % 5 === 0 ? 0.8 : 0.4}
              strokeWidth={i % 5 === 0 ? 1.2 : 0.4}
            />
          );
        })}
        <g transform={`rotate(${hrA} 100 100)`}>
          <line x1="100" y1="108" x2="100" y2="68" stroke="var(--accent-3)" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${minA} 100 100)`}>
          <line x1="100" y1="110" x2="100" y2="46" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${secA} 100 100)`}>
          <line x1="100" y1="112" x2="100" y2="38" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="3.5" fill="var(--ink)" />
      </svg>
      <p style={{ marginTop: 6, color: 'var(--muted)', fontSize: 12 }}>{label}</p>
    </div>
  );
}

/* =====================================
   MAIN PAGE COMPONENT
===================================== */
type VersePayload = { reference: string; text: string; translation?: string };

export default function Page() {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const isDesktop = useIsDesktop();
  const [introDone, setIntroDone] = useState<boolean>(() => !isDesktop);
  const fillRef = useRef<SVGTextElement | null>(null);
  const [openLetter, setOpenLetter] = useState<number | null>(null);

  const [verse, setVerse] = useState<VersePayload | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(false);
  const [verseError, setVerseError] = useState('');

  const HER_TIMEZONE = useMemo(() => safeTimeZone(HER_TIMEZONE_RAW), []);
  const YOUR_TIMEZONE = useMemo(() => safeTimeZone(YOUR_TIMEZONE_RAW), []);

  // ensure fonts loaded before starting animation
  useEffect(() => {
    const ready = (document as any).fonts?.ready;
    if (ready) ready.then(() => document.documentElement.classList.add('fonts-ready'));
    else document.documentElement.classList.add('fonts-ready');
  }, []);

  // automatically mark intro done after animation duration (desktop only)
  useEffect(() => {
    if (!authorized || !isDesktop || introDone) return;
    const id = window.setTimeout(() => setIntroDone(true), 2800);
    return () => clearTimeout(id);
  }, [authorized, isDesktop, introDone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ACCESS_CODE) setAuthorized(true);
    else setError('Incorrect code. Please try again.');
  };

  async function fetchRandomVerse() {
    try {
      setLoadingVerse(true);
      setVerseError('');
      const res = await fetch('/api/verses', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch verse (${res.status})`);
      const data = (await res.json()) as VersePayload;
      setVerse({ reference: data.reference, text: data.text, translation: data.translation });
    } catch (e: unknown) {
      setVerse(null);
      const msg = e instanceof Error ? e.message : 'Failed to load verse.';
      setVerseError(msg);
    } finally {
      setLoadingVerse(false);
    }
  }

  /* ========== PASSWORD GATE ========== */
  if (!authorized) {
    return (
      <div className="passwordGate">
        <form className="passwordBox" onSubmit={handleSubmit}>
          <h1 style={{ color: 'var(--accent)', marginBottom: 20 }}>Enter the 6-digit code</h1>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
          />
          <br />
          <button type="submit">Unlock</button>
          {error && <p className="passwordError">{error}</p>}
        </form>
      </div>
    );
  }

  /* ========== MAIN CONTENT (with conditional intro) ========== */
  return (
    <main className="main" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Desktop-only YEVA intro */}
      {isDesktop && !introDone && (
        <div className="introName" aria-hidden="true">
          <svg
            viewBox="0 0 1000 300"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '90%', maxWidth: '1000px' }}
            className="name"
          >
            <text x="50%" y="60%" className="stroke" textAnchor="middle" style={{ fontSize: '160px' }}>
              {YEVA}
            </text>
            <text
              x="50%"
              y="60%"
              className="fill"
              textAnchor="middle"
              style={{ fontSize: '160px' }}
              ref={fillRef}
              onAnimationEnd={() => setIntroDone(true)}
            >
              {YEVA}
            </text>
          </svg>
        </div>
      )}

      {/* MAIN CARD */}
      <section
        className="card"
        style={{
          opacity: introDone ? 1 : 0,
          transform: introDone ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'var(--accent-3)', marginBottom: 8 }}>{TAGLINE}</h1>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: 20 }}>{QUOTE}</p>

        <button
          onClick={() => {
            setOpenLetter(999);
            fetchRandomVerse();
          }}
        >
          Get a verse I found for you
        </button>

        {/* OPEN-WHEN GRID */}
        <div style={{ margin: '30px auto 8px', maxWidth: 760, textAlign: 'left' }}>
          <h2 style={{ fontSize: 18, color: 'var(--accent)', marginBottom: 10 }}>Open when…</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {OPEN_WHEN.map((item, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <strong style={{ color: 'var(--ink)' }}>{item.title}</strong>
                {item.hint && <p style={{ color: 'var(--muted)', fontSize: 13 }}>{item.hint}</p>}
                <button
                  onClick={() => setOpenLetter(i)}
                  style={{
                    marginTop: 8,
                    border: 'none',
                    background: 'var(--accent)',
                    color: '#3a1f25',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CLOCKS */}
        <div className="clockGrid" style={{ marginTop: 32 }}>
          <SmallClock tz={YOUR_TIMEZONE} label="My time" />
          <SmallClock tz={HER_TIMEZONE} label="Your time" />
        </div>

        <footer style={{ marginTop: 40, color: 'var(--muted)', fontSize: 13 }}>
          <p>Made with love • {new Date().getFullYear()}</p>
        </footer>
      </section>

      {/* VERSE MODAL */}
      {openLetter === 999 && (
        <div className="modalBack" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ color: '#3a252a' }}>A verse for you</strong>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={fetchRandomVerse} disabled={loadingVerse}>
                  {loadingVerse ? 'Loading…' : 'Another verse'}
                </button>
                <button onClick={() => setOpenLetter(null)}>Close</button>
              </div>
            </div>
            {loadingVerse && !verse && <p>Loading verse…</p>}
            {verseError && !verse && <p style={{ color: 'crimson' }}>{verseError}</p>}
            <pre
              className="letter-body"
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                lineHeight: 1.7,
                fontSize: 15.5,
              }}
            >
{verse
  ? `“${verse.text}”\n— ${verse.reference}${verse.translation ? ` (${verse.translation})` : ''}`
  : 'No verse yet. Click “Another verse”.'}
            </pre>
          </div>
        </div>
      )}

      {/* LETTER MODALS */}
      {openLetter !== null && openLetter !== 999 && (
        <div className="modalBack" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ color: '#3a252a' }}>{OPEN_WHEN[openLetter].title}</strong>
              <button onClick={() => setOpenLetter(null)}>Close</button>
            </div>
            <pre
              className="letter-body"
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                lineHeight: 1.7,
                fontSize: 15.5,
              }}
            >
{OPEN_WHEN[openLetter].body}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
