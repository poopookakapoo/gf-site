'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { Bangers, Space_Grotesk } from 'next/font/google';
import styles from './page.module.css';

type Option = {
  label: string;
  points: number;
  insight: string;
};

type Question = {
  id: string;
  prompt: string;
  options: Option[];
};

type AnswerIndex = number | null;

const display = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
});

const QUESTIONS: Question[] = [
  {
    id: 'gay',
    prompt: 'Did I act gay today?',
    options: [
      {
        label: 'Nahhh',
        points: 0,
        insight: 'Still gay but didnt show it (for now)',
      },
      {
        label: 'Sometimes',
        points: 1,
        insight: 'Some pretty gay replies but overall good',
      },
      {
        label: 'Often',
        points: 3,
        insight: 'Pretty gay u twink',
      },
      {
        label: 'All the time',
        points: 4,
        insight: 'Nigga kept saying gay shit.',
      },
    ],
  },
  {
    id: 'annoying',
    prompt: 'How annoying was I?',
    options: [
      {
        label: 'No u were cute',
        points: 0,
        insight: 'U were cute not annoying',
      },
      {
        label: 'a nerd nigga',
        points: 1,
        insight: 'Stop yapping',
      },
      {
        label: 'Pretty annoying',
        points: 3,
        insight: 'a little annoying',
      },
      {
        label: 'Annoying nigga',
        points: 4,
        insight: 'Wouldnt shut the fuck up',
      },
    ],
  },
  {
    id: 'ragebait',
    prompt: 'How many times did i ragebait u?',
    options: [
      {
        label: 'Not yet',
        points: 0,
        insight: 'U didnt ragebait me yet',
      },
      {
        label: 'a little bit but not much was kinda funny',
        points: 1,
        insight: 'U did ragebait a little but ur safe',
      },
      {
        label: 'a small and rational feeling of beating u',
        points: 3,
        insight: 'bitchass',
      },
      {
        label: 'ALL THE TIME',
        points: 4,
        insight: 'count ur days lil bro',
      },
    ],
  },
  {
    id: 'laugh',
    prompt: 'Did I make u laugh today?',
    options: [
      {
        label: 'A lot',
        points: 0,
        insight: 'good boy',
      },
      {
        label: 'a little',
        points: 1,
        insight: 'Lame jokes anyways',
      },
      {
        label: 'A dam smirk',
        points: 3,
        insight: 'gay',
      },
      {
        label: 'honestly, kys',
        points: 4,
        insight: 'kys',
      },
    ],
  },
  {
    id: 'absent',
    prompt: 'Was i away a lot?',
    options: [
      {
        label: 'No always in the way',
        points: 0,
        insight: 'glue aaaah bf',
      },
      {
        label: 'A little',
        points: 2,
        insight: 'poopookaka',
      },
      {
        label: 'Yea :(',
        points: 3,
        insight: ':(',
      },
      {
        label: 'Fuck u',
        points: 5,
        insight: 'Die',
      },
    ],
  },
  {
    id: 'intheway',
    prompt: 'Was I mean?',
    options: [
      {
        label: 'Nuhuh',
        points: 0,
        insight: 'yayyy',
      },
      {
        label: 'A tiiiiny bit',
        points: 1,
        insight: 'Sybau',
      },
      {
        label: 'YEA :(',
        points: 3,
        insight: 'Im sorry I didnt mean to be mean :(',
      },
      {
        label: 'Yea go die and kys',
        points: 4,
        insight: 'Fuck u lil boi',
      },
    ],
  },
];

const MAX_POINTS = QUESTIONS.reduce((total, question) => {
  const highest = Math.max(...question.options.map((option) => option.points));
  return total + highest;
}, 0);

function buildEmptyAnswers(): AnswerIndex[] {
  return Array.from({ length: QUESTIONS.length }, () => null);
}

function normalizeScore(points: number): number {
  const scaled = Math.round((points / MAX_POINTS) * 9 + 1);
  return Math.max(1, Math.min(10, scaled));
}

function getVerdict(score: number): string {
  if (score <= 3) return 'Im safe (for now).';
  if (score <= 6) return 'A tiny and cute knuckle sandwitch';
  if (score <= 8) return 'A full whipping (im into that tho)';
  return 'Sudden death.';
}

function getScoreColor(score: number): string {
  if (score <= 3) return '#30b478';
  if (score <= 6) return '#f6a23d';
  if (score <= 8) return '#ff7e45';
  return '#f34b79';
}

export default function GamePage() {
  const [answers, setAnswers] = useState<AnswerIndex[]>(() => buildEmptyAnswers());
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const answeredCount = useMemo(
    () => answers.filter((value): value is number => value !== null).length,
    [answers]
  );

  const totalPoints = useMemo(
    () =>
      answers.reduce<number>((sum, optionIndex, questionIndex) => {
        if (optionIndex === null) return sum;
        return sum + QUESTIONS[questionIndex].options[optionIndex].points;
      }, 0),
    [answers]
  );

  const score = useMemo(() => normalizeScore(totalPoints), [totalPoints]);
  const scoreColor = useMemo(() => getScoreColor(score), [score]);
  const scoreRingStyle = useMemo<CSSProperties>(
    () => ({
      background: `conic-gradient(${scoreColor} ${score * 36}deg, rgba(255, 255, 255, 0.2) 0deg)`,
    }),
    [score, scoreColor]
  );

  const verdict = useMemo(() => getVerdict(score), [score]);

  const insights = useMemo(() => {
    const picks: string[] = [];

    answers.forEach((optionIndex, questionIndex) => {
      if (optionIndex === null) return;
      picks.push(QUESTIONS[questionIndex].options[optionIndex].insight);
    });

    return Array.from(new Set(picks)).slice(0, 5);
  }, [answers]);

  const recoveryPlan = useMemo(() => {
    const tasks: string[] = [];

    const pointsFor = (questionIndex: number) => {
      const answerIndex = answers[questionIndex];
      if (answerIndex === null) return 0;
      return QUESTIONS[questionIndex].options[answerIndex].points;
    };

    if (pointsFor(0) >= 3) {
      tasks.push('Ur still gay');
    }
    if (pointsFor(1) >= 3) {
      tasks.push('Ima beat u anyways');
    }
    if (pointsFor(3) >= 3) {
      tasks.push('blablabla');
    }
    if (pointsFor(4) >= 3) {
      tasks.push('Shut yo bitchass');
    }
    if (pointsFor(5) >= 3) {
      tasks.push('getthefuggoutofhere');
    }

    if (tasks.length === 0 && score <= 3) {
      tasks.push('Call an ambulance');
    }
    if (tasks.length < 3 && score >= 6) {
      tasks.push('Ts is annoying kys');
    }
    if (tasks.length < 3 && score >= 8) {
      tasks.push('Die.');
    }

    return tasks.slice(0, 4);
  }, [answers, score]);

  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
  const activeQuestion = QUESTIONS[currentQuestionIndex];
  const activeSelection = answers[currentQuestionIndex];

  const selectOption = (optionIndex: number) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[currentQuestionIndex] = optionIndex;
      return next;
    });

    if (currentQuestionIndex >= QUESTIONS.length - 1) {
      setSubmitted(true);
      return;
    }

    setCurrentQuestionIndex((previous) => previous + 1);
  };

  const goBack = () => {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex((previous) => previous - 1);
    setSubmitted(false);
  };

  const reset = () => {
    setAnswers(buildEmptyAnswers());
    setSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const scoreToneClass =
    score <= 3 ? styles.calm : score <= 6 ? styles.spicy : score <= 8 ? styles.hot : styles.danger;

  return (
    <main className={`${styles.page} ${display.variable} ${body.variable}`}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>kys lil nigga</p>
          <h1 className={`${styles.title} ${styles.display}`}>
            Should My GF Beat Me Meter
          </h1>
          <p className={styles.subhead}>
            Chat am i getting beaten today chat.
          </p>
        </header>

        <div className={styles.progressWrap} aria-label="Quiz progress">
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          <span className={styles.progressText}>
            {answeredCount}/{QUESTIONS.length} answered
          </span>
        </div>

        <div className={styles.layout}>
          <section className={styles.quizColumn}>
            {!submitted ? (
              <>
                <article className={styles.questionCard} key={activeQuestion.id}>
                  <p className={styles.questionTag}>
                    Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                  </p>
                  <h2 className={styles.questionPrompt}>{activeQuestion.prompt}</h2>

                  <div className={styles.optionGrid}>
                    {activeQuestion.options.map((option, optionIndex) => {
                      const active = activeSelection === optionIndex;

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => selectOption(optionIndex)}
                          className={`${styles.optionButton} ${active ? styles.optionActive : ''}`}
                        >
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </article>

                <p className={styles.helperText}>Tap an answer to continue to the next question.</p>

                <div className={styles.actions}>
                  {currentQuestionIndex > 0 ? (
                    <button type="button" className={styles.ghostButton} onClick={goBack}>
                      Previous Question
                    </button>
                  ) : null}
                  <button type="button" className={styles.ghostButton} onClick={reset}>
                    Restart Quiz
                  </button>
                </div>
              </>
            ) : (
              <article className={styles.questionCard}>
                <h2 className={styles.questionPrompt}>Done CHARRR.</h2>
                <p className={styles.pendingBody}>Retake anytime dw</p>
                <div className={styles.actions}>
                  <button type="button" className={styles.primaryButton} onClick={reset}>
                    Play Again
                  </button>
                </div>
              </article>
            )}
          </section>

          <aside className={`${styles.resultCard} ${submitted ? scoreToneClass : ''}`}>
            <p className={styles.resultKicker}>Result</p>

            {!submitted ? (
              <div className={styles.pendingState}>
                <p className={styles.pendingTitle}>Waiting for the answers...</p>
                <p className={styles.pendingBody}>
                  On question {currentQuestionIndex + 1} of {QUESTIONS.length}.
                </p>
              </div>
            ) : (
              <div className={styles.resultReady}>
                <div className={styles.scoreRing} style={scoreRingStyle} aria-hidden="true">
                  <div className={styles.scoreInner}>
                    <span className={`${styles.scoreValue} ${styles.display}`}>{score}</span>
                    <span className={styles.scoreOutOf}>/10</span>
                  </div>
                </div>

                <p className={styles.scoreLabel}>Chat am i cooked chat</p>
                <p className={styles.verdict}>{verdict}</p>

                <h3 className={styles.blockTitle}>Key Insights</h3>
                <ul className={styles.list}>
                  {insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>

                <h3 className={styles.blockTitle}>Additional comments</h3>
                <ol className={styles.list}>
                  {recoveryPlan.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ol>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
