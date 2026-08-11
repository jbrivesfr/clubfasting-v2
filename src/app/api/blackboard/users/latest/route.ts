import { NextResponse } from 'next/server';
import { fetchLastUsers, BlackboardFetchError } from '@/lib/blackboard/fetchers/users';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await fetchLastUsers();
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    });
  } catch (error: any) {
    if (error instanceof BlackboardFetchError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
