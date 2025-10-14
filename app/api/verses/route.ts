// app/api/verses/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Strong typings for Bible API
type BibleAPIVerse = {
  text: string;
  reference?: string;
};
type BibleAPIResponse = {
  reference: string;
  translation_name?: string;
  verses?: BibleAPIVerse[];
};

// 👇 Clean, corrected list of verses
const VERSES = [
  'Genesis+1:27',
  'Psalm+139:13-14',
  'Proverbs+25:28',
  '1+Corinthians+9:27',
  'Romans+12:2',
  'Galatians+6:4-5',
  'Micah+6:8',
  '1+Peter+2:9',
  'Matthew+11:28',
  'Psalm+46:1',
];

export async function GET(_req: NextRequest) { // note the underscore to satisfy no-unused-vars
  const translation = 'web';
  const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
  const apiUrl = `https://bible-api.com/${randomVerse}?translation=${translation}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Bible API returned status ${response.status}`);
    }

    const data: BibleAPIResponse = await response.json();
    const text = (data.verses ?? []).map((v) => v.text).join(' ').trim();

    return NextResponse.json({
      reference: data.reference,
      translation: data.translation_name,
      text,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    // keep console for server logs; no lint warnings
    // eslint-disable-next-line no-console
    console.error('Error fetching verse:', message);
    return NextResponse.json(
      { error: 'Could not fetch verse. Please try again later.' },
      { status: 500 }
    );
  }
}
