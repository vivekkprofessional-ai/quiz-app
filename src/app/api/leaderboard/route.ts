import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const search = searchParams.get('search')?.toLowerCase() || '';
    const allDates = searchParams.get('allDates');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

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

    // Calculate absolute rank for that day
    const rankedData = (data || []).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    let filtered = rankedData;
    if (search) {
      filtered = filtered.filter(e => e.name.toLowerCase().includes(search));
    }

    const totalEntries = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / limit));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (currentPage - 1) * limit;
    const paginatedEntries = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      date,
      entries: paginatedEntries,
      totalEntries,
      totalPages,
      currentPage
    });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch leaderboard' }, { status: 500 });
  }
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
  } catch (error: any) {
    console.error('Error saving leaderboard entry:', error);
    return NextResponse.json({ error: error.message || 'Failed to save entry' }, { status: 500 });
  }
}
