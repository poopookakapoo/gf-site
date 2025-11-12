"use client";

import React, { useState } from "react";
import styles from "./dont-cry.module.css";

const reasons: string[] = [
  "Because God is close to you when your heart feels broken, even when you cannot feel it yet (Psalm 34:18).",
  "Because every tear you cry is seen, noticed, and counted by God – none of this is invisible to Him (Psalm 56:8).",
  "Because you are wonderfully made, even on the days when you cannot see any beauty in yourself (Psalm 139:14).",
  "Because God has loved you with an everlasting love, and that love does not disappear on hard days (Jeremiah 31:3).",
  "Because His plans for you are for hope and a future, not for your story to end in sadness (Jeremiah 29:11).",
  "Because Jesus invites you to bring your heavy heart to Him, and He promises rest for your soul (Matthew 11:28–29).",
  "Because nothing – not fear, not sadness, not mistakes – can separate you from the love of God (Romans 8:38–39).",
  "Because when you feel weak, His strength can hold you together more than you realise (2 Corinthians 12:9–10).",
  "Because even the smallest spark of faith in you matters deeply to God, and He does not crush a hurting heart (Isaiah 42:3).",
  "Because you are deeply loved – by God and by me – and your life is far more precious than this moment of pain (1 John 3:1).",
  "Because I care for you more deeply than you know, and seeing you in pain is something I will never ignore.",
  "Because your presence in my life brings me a sense of peace and purpose that I would not trade for anything.",
  "Because you deserve to feel supported, safe, and understood — and I will always stand beside you in that.",
  "Because your smile genuinely changes the atmosphere of my days, and I want to protect the heart behind it.",
  "Because I love you, and I am committed to walking with you through every high, every low, and every moment in between."
];


export default function DontCryPage() {
  const [index, setIndex] = useState(0);

  const goNext = () => {
    setIndex((prev) => (prev + 1) % reasons.length);
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  return (
    <main className="main">
      <section className={`card ${styles.reasonCard}`}>
        <header className={styles.header}>
          <h1 className={styles.title}>Don&apos;t cry, why?</h1>
          <p className={styles.subtitle}>
            Let me remind you, one reason at a time.
          </p>
        </header>

        <div key={index} className={styles.reasonBox}>
          <p className={styles.reasonText}>{reasons[index]}</p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            onClick={goPrev}
            className={styles.secondaryButton}
          >
            Back
          </button>

          <div className={styles.progress}>
            <span className={styles.counter}>
              {index + 1} / {reasons.length}
            </span>
            <div className={styles.dots}>
              {reasons.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${
                    i === index ? styles.dotActive : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            className={styles.primaryButton}
          >
            Next
          </button>
        </div>

        <p className={styles.footerNote}>
          if you forget again, come back here and I will remind you.
        </p>
      </section>
    </main>
  );
}
