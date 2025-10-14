import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 👇 Clean, corrected list of verses
const VERSES = [
  'Genesis+1:27',
  'Psalm+139:13-14',
  'Proverbs+25:28', // fixed typo
  '1+Corinthians+9:27',
  'Romans+12:2',
  'Galatians+6:4-5',
  'Micah+6:8',
  '1+Peter+2:9',
  'Matthew+11:28',
  'Psalm+46:1',
];

export async function GET(req: NextRequest) {
  const translation = 'web';
  const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
  const apiUrl = `https://bible-api.com/${randomVerse}?translation=${translation}`;

  try {
    // Fetch from the Bible API
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Bible API returned status ${response.status}`);
    }

    const data = await response.json();

    // Combine all verse texts (in case of multi-verse ranges)
    const text = data.verses.map((v: any) => v.text).join(' ').trim();

    return NextResponse.json({
      reference: data.reference,
      translation: data.translation_name,
      text,
    });
  } catch (error: any) {
    console.error('Error fetching verse:', error.message);
    return NextResponse.json(
      { error: 'Could not fetch verse. Please try again later.' },
      { status: 500 }
    );
  }
}
