import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') || 'E';

  try {
    const dataPath = path.join(process.cwd(), 'public', 'quiz_data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const db = JSON.parse(rawData);

    const questionsList = db[level];
    if (!questionsList || questionsList.length < 10) {
      return NextResponse.json({ error: 'Not enough questions found' }, { status: 400 });
    }

    // Shuffle
    const shuffled = [...questionsList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10).map(q => {
      // Find the correct option text (starts with q.answer like "B")
      const correctOptObj = q.options.find((o: string) => o.startsWith(q.answer));
      
      // Remove prefixes from all options
      let cleanOptions = q.options.map((o: string) => o.replace(/^[A-D][\.\)]\s*/, ''));
      let cleanCorrect = correctOptObj ? correctOptObj.replace(/^[A-D][\.\)]\s*/, '') : q.answer;
      
      // Shuffle options securely
      cleanOptions = cleanOptions.sort(() => 0.5 - Math.random());
      
      return {
        ...q,
        options: cleanOptions,
        answer: cleanCorrect // Store the actual clean string
      };
    });

    return NextResponse.json({ questions: selected });
  } catch (error) {
    console.error("Error reading quiz data:", error);
    return NextResponse.json({ error: 'Failed to load quiz data' }, { status: 500 });
  }
}
