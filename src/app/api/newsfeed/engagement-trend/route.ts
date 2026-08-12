import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

function calculateDelta(current: number, previous: number) {
  const abs = current - previous;
  const percent = previous > 0 ? (abs / previous) * 100 : (current > 0 ? 100 : 0);
  return { abs, percent };
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Calculate current ISO week start (Monday)
    const dayOfWeek = now.getUTCDay();
    const dayDiffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

    const currentWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + dayDiffToMonday, 0, 0, 0, 0));

    // Previous ISO week start
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setUTCDate(prevWeekStart.getUTCDate() - 7);

    // Previous week end (Sunday 23:59:59.999)
    const prevWeekEnd = new Date(currentWeekStart);
    prevWeekEnd.setUTCMilliseconds(-1);

    const prevWeekStartStr = prevWeekStart.toISOString().split('T')[0];
    const prevWeekEndStr = prevWeekEnd.toISOString().split('T')[0];

    // For current week, we take from Monday up to today
    const currentWeekStartStr = currentWeekStart.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    const { data: activityData, error: activityError } = await supabase
      .from('newsfeed_activity_weekly')
      .select('*')
      .gte('date', prevWeekStartStr)
      .lte('date', todayStr);

    if (activityError) {
      console.error('Error fetching newsfeed_activity_weekly:', activityError);
      throw activityError;
    }

    const records = activityData || [];

    const current_week = {
      start: currentWeekStart.toISOString(),
      end: now.toISOString(),
      posts_count: 0,
      comments_count: 0,
      reactions_count: 0
    };

    const previous_week = {
      start: prevWeekStart.toISOString(),
      end: prevWeekEnd.toISOString(),
      posts_count: 0,
      comments_count: 0,
      reactions_count: 0
    };

    for (const record of records) {
      const dateStr = record.date;
      const posts = Number(record.posts) || 0;
      const comments = Number(record.comments) || 0;
      const likes = Number(record.likes) || 0;

      if (dateStr >= currentWeekStartStr && dateStr <= todayStr) {
        current_week.posts_count += posts;
        current_week.comments_count += comments;
        current_week.reactions_count += likes;
      } else if (dateStr >= prevWeekStartStr && dateStr <= prevWeekEndStr) {
        previous_week.posts_count += posts;
        previous_week.comments_count += comments;
        previous_week.reactions_count += likes;
      }
    }

    const delta = {
      posts: calculateDelta(current_week.posts_count, previous_week.posts_count),
      comments: calculateDelta(current_week.comments_count, previous_week.comments_count),
      reactions: calculateDelta(current_week.reactions_count, previous_week.reactions_count)
    };

    const upCount = [delta.posts.abs, delta.comments.abs, delta.reactions.abs].filter(v => v > 0).length;
    const is_up = upCount >= 2;

    return NextResponse.json({
      current_week,
      previous_week,
      delta,
      is_up,
      computed_at: now.toISOString()
    });

  } catch (err) {
    console.error('Newsfeed engagement trend endpoint error:', err);
    // Return a default empty state
    return NextResponse.json({
      current_week: { start: '', end: '', posts_count: 0, comments_count: 0, reactions_count: 0 },
      previous_week: { start: '', end: '', posts_count: 0, comments_count: 0, reactions_count: 0 },
      delta: {
        posts: { abs: 0, percent: 0 },
        comments: { abs: 0, percent: 0 },
        reactions: { abs: 0, percent: 0 }
      },
      is_up: false,
      computed_at: new Date().toISOString()
    }, { status: 500 }); // actually we might want to just return 200 with empty state to match pattern if needed, but let's throw 500
  }
}
