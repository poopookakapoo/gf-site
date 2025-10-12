'use client';
import { useEffect, useRef, useState, useMemo } from 'react';

/* — simple 6-digit password — */
const ACCESS_CODE = '010808';

const YEVA = 'Yeva';
const HER_TIMEZONE_RAW = 'America/Tijuana';
const YOUR_TIMEZONE_RAW = Intl.DateTimeFormat().resolvedOptions().timeZone;

const TAGLINE = "My Baby's website Website";
const QUOTE = '“Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. – Joshua 1:9”';
const LETTER = `Well usually every month I give you some flowers and snacks but I uhm this month i really cant afford it and I'm so sorry baby princess BUT i made you this website! Which i hope you like hahaha. I love you forever and more baby. MWAHHHHHH. Everyday I wake up knowing that even when I was sleeping I have an amazing gf that texted me, that showed me smth she thought it was cool, that spammed me of tiktoks, so since the moment i open my eyes I know that someone loves me at any time of the day and Yeva, I'm so grateful that that person is you. You're not simply my gf, you're the love of my life. You matter so much for me, every second of the day youre always in my mind. Idk who to thank except god for giving me such an amazing gf that im so grateful to have every single day. You're the light of my life tha guides me to be a better man. I love you so much Yeva `;


/* — Open-when letters — */
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
];

/* — helpers — */
function safeTimeZone(tz: string, fallback = 'UTC') {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return fallback;
  }
}

function useNow(frame = true) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    if (!frame) {
      const id = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(id);
    }
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

/* — Small Analog Clock — */
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

/* — Main Page — */
export default function Page() {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [openLetter, setOpenLetter] = useState<number | null>(null);
  const fillRef = useRef<SVGTextElement | null>(null);

  const HER_TIMEZONE = useMemo(() => safeTimeZone(HER_TIMEZONE_RAW), []);
  const YOUR_TIMEZONE = useMemo(() => safeTimeZone(YOUR_TIMEZONE_RAW), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ACCESS_CODE) setAuthorized(true);
    else setError('Incorrect code try again nig');
  };

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!authorized || !mounted) return;
    const el = fillRef.current;
    const show = () => setIntroDone(true);
    if (el) {
      el.addEventListener('animationend', show, { once: true });
      return () => el.removeEventListener('animationend', show);
    }
    const t = setTimeout(show, 2000);
    return () => clearTimeout(t);
  }, [authorized, mounted]);

  /* PASSWORD GATE */
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

  /* AFTER UNLOCK */
  return (
    <main className="main" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Yeva intro */}
      {!introDone && (
        <div className="introName">
          <svg
            viewBox="0 0 1000 300"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '90%', maxWidth: '1000px' }}
            className="name"
          >
            <text x="50%" y="60%" className="stroke" textAnchor="middle" style={{ fontSize: '160px' }}>
              {YEVA}
            </text>
            <text x="50%" y="60%" className="fill" textAnchor="middle" style={{ fontSize: '160px' }} ref={fillRef}>
              {YEVA}
            </text>
          </svg>
        </div>
      )}

      {/* Main content */}
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

        <button onClick={() => setOpenLetter(999)}>Open your letter</button>

        {/* open-when letters */}
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

        {/* two small clocks */}
        <div className="clockGrid" style={{ marginTop: 32 }}>
          <SmallClock tz={YOUR_TIMEZONE} label="My time" />
          <SmallClock tz={HER_TIMEZONE} label={`Your time`} />
        </div>

        <footer style={{ marginTop: 40, color: 'var(--muted)', fontSize: 13 }}>
          <p>Made with love • {new Date().getFullYear()}</p>
        </footer>
      </section>

      {/* Modals */}
      {openLetter === 999 && (
        <div className="modalBack" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ color: '#3a252a' }}>Letter</strong>
              <button onClick={() => setOpenLetter(null)}>Close</button>
            </div>
            <pre className="letter-body" style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              lineHeight: 1.7,
              fontSize: 15.5,
            }}>
{LETTER}
            </pre>
          </div>
        </div>
      )}

      {openLetter !== null && openLetter !== 999 && (
        <div className="modalBack" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ color: '#3a252a' }}>{OPEN_WHEN[openLetter].title}</strong>
              <button onClick={() => setOpenLetter(null)}>Close</button>
            </div>
            <pre className="letter-body" style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              lineHeight: 1.7,
              fontSize: 15.5,
            }}>
{OPEN_WHEN[openLetter].body}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
