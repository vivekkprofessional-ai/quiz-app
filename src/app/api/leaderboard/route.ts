import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const search = searchParams.get('search')?.toLowerCase() || '';
  const allDates = searchParams.get('allDates');

  // Return all distinct dates that have leaderboard data
  if (allDates === 'true') {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('date')
      .order('date', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const uniqueDates = [...new Set(data?.map(r => r.date) || [])];
    return NextResponse.json({ dates: uniqueDates });
  }

  if (!date) {
    return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
  }

  let { data, error } = await supabase
    .from('leaderboard')
    .select('name, school, level, score, timestamp, correct_ids, wrong_ids')
    .eq('date', date)
    .order('score', { ascending: false })
    .order('timestamp', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Calculate absolute absolute rank for that day
  const rankedData = (data || []).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  let finalData = rankedData;
  if (search) {
    finalData = finalData.filter(e => e.name.toLowerCase().includes(search));
  } else {
    finalData = finalData.slice(0, 10);
  }

  return NextResponse.json({ date, entries: finalData });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, school, level, score, correct_ids = [], wrong_ids = [], localDate, localTimestamp } = body;

    if (!name || !school || !level || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date();
    const dateKey = localDate || now.toISOString().split('T')[0];
    const timestamp = localTimestamp || now.toISOString();

    const { error } = await supabase
      .from('leaderboard')
      .insert({ name, school, level, score, correct_ids, wrong_ids, date: dateKey, timestamp });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, date: dateKey });
  } catch (error) {
    console.error('Error saving leaderboard entry:', error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}
