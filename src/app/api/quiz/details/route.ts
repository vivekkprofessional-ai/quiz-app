import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');

  if (!idsParam) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
  }

  const idsToFind = new Set(idsParam.split(','));

  try {
    const dataPath = path.join(process.cwd(), 'public', 'quiz_data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const db = JSON.parse(rawData);

    const matchedQuestions: any[] = [];

    // The quiz database is grouped by level (VE, E, M)
    // We iterate through all levels and questions to find the requested IDs.
    for (const level in db) {
      if (Array.isArray(db[level])) {
        for (const q of db[level]) {
          if (idsToFind.has(q.id)) {
            matchedQuestions.push({
              id: q.id,
              text: q.text,
              options: q.options,
              answer: q.answer,
              explanation: q.explanation
            });
          }
        }
      }
    }

    return NextResponse.json({ questions: matchedQuestions });
  } catch (error) {
    console.error("Error reading quiz details:", error);
    return NextResponse.json({ error: 'Failed to load details' }, { status: 500 });
  }
}
