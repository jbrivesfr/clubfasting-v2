import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    // Week end is end of yesterday to have full days
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
    // Week start is 7 days before weekEnd (start of day)
    const weekStart = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate() - 6, 0, 0, 0, 0);

    // Prev week
    const prevWeekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() - 1, 23, 59, 59, 999);
    const prevWeekStart = new Date(prevWeekEnd.getFullYear(), prevWeekEnd.getMonth(), prevWeekEnd.getDate() - 6, 0, 0, 0, 0);

    const { data: activityData, error: activityError } = await supabase
      .from('newsfeed_activity_weekly')
      .select('*')
      .gte('date', prevWeekStart.toISOString().split('T')[0])
      .lte('date', weekEnd.toISOString().split('T')[0])
      .order('date', { ascending: false });

    const days: any[] = [];
    const total = { posts: 0, comments: 0, likes: 0, active_users: 0 };
    const prev_week = { posts: 0, comments: 0, likes: 0, active_users: 0 };

    if (activityError) {
      console.error('Error fetching newsfeed_activity_weekly:', activityError);
      return NextResponse.json({
        week_start: weekStart.toISOString(),
        week_end: weekEnd.toISOString(),
        days,
        total,
        prev_week
      });
    }

    const records = activityData || [];

    // Process current week (last 7 days)
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate() - i);
      const dateStr = targetDate.toISOString().split('T')[0];

      const record = records.find(r => r.date === dateStr) || {
        date: dateStr,
        posts: 0,
        comments: 0,
        likes: 0,
        active_users: 0
      };

      days.push({
        date: dateStr,
        posts: Number(record.posts) || 0,
        comments: Number(record.comments) || 0,
        likes: Number(record.likes) || 0,
        active_users: Number(record.active_users) || 0
      });

      total.posts += Number(record.posts) || 0;
      total.comments += Number(record.comments) || 0;
      total.likes += Number(record.likes) || 0;
      total.active_users += Number(record.active_users) || 0;
    }

    // Process previous week
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(prevWeekEnd.getFullYear(), prevWeekEnd.getMonth(), prevWeekEnd.getDate() - i);
      const dateStr = targetDate.toISOString().split('T')[0];

      const record = records.find(r => r.date === dateStr);
      if (record) {
        prev_week.posts += Number(record.posts) || 0;
        prev_week.comments += Number(record.comments) || 0;
        prev_week.likes += Number(record.likes) || 0;
        prev_week.active_users += Number(record.active_users) || 0;
      }
    }

    return NextResponse.json({
      week_start: weekStart.toISOString(),
      week_end: weekEnd.toISOString(),
      days: days.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      total,
      prev_week
    });
  } catch (err) {
    console.error('Newsfeed engagement endpoint error:', err);
    // Return empty payload to prevent 500 error per requirements
    const now = new Date();
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
    const weekStart = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate() - 6, 0, 0, 0, 0);
    return NextResponse.json({
      week_start: weekStart.toISOString(),
      week_end: weekEnd.toISOString(),
      days: [],
      total: { posts: 0, comments: 0, likes: 0, active_users: 0 },
      prev_week: { posts: 0, comments: 0, likes: 0, active_users: 0 }
    });
  }
}
