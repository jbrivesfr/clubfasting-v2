import React from 'react';
import { headers } from 'next/headers';
import EmptyState from '@/components/EmptyState';

export const metadata = {
  title: 'Newsfeed Engagement Weekly | Club Fasting',
  description: 'Weekly engagement metrics for the newsfeed.',
};

async function getEngagementData() {
  const headersList = headers();
  // We construct an absolute URL to call our own API Route.
  // In a Next.js server component fetching its own API, we need absolute URL.
  // If NEXT_PUBLIC_SITE_URL is not fully reliable in local/build without it, we can fallback or use middleware/db directly.
  // However, the issue explicitly requests to "fetch l'endpoint".

  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = `${protocol}://${host}`;
  const cookieHeader = headersList.get('cookie') || '';

  const res = await fetch(`${siteUrl}/api/newsfeed/engagement-weekly`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

function Sparkline({ data, color }) {
  if (!data || data.length === 0) return null;

  // Data comes sorted by date desc. We need it asc for left-to-right drawing.
  const reversedData = [...data].reverse();

  const max = Math.max(...reversedData) || 1; // avoid division by 0
  const min = 0; // typically we want 0-based for counts

  const width = 200;
  const height = 40;

  const points = reversedData.map((val, index) => {
    const x = (index / (reversedData.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10 mt-2" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KPICard({ title, value, prevValue, sparklineData }) {
  const delta = prevValue > 0 ? ((value - prevValue) / prevValue) * 100 : (value > 0 ? 100 : 0);
  const isPositive = delta > 0;
  const isNeutral = delta === 0;

  let badgeColor = 'bg-gray-100 text-gray-800';
  if (isPositive) badgeColor = 'bg-green-100 text-green-800';
  if (!isPositive && !isNeutral) badgeColor = 'bg-red-100 text-red-800';

  const sparklineColor = isPositive ? '#16a34a' : (!isNeutral ? '#dc2626' : '#9ca3af');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <Sparkline data={sparklineData} color={sparklineColor} />
    </div>
  );
}

export default async function NewsfeedEngagementPage() {
  let data;
  let errorMsg = null;

  try {
    data = await getEngagementData();
  } catch (err) {
    errorMsg = err.message;
  }

  if (errorMsg === 'Unauthorized') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h2>
          <p className="text-gray-600">You do not have permission to view this page. Ensure you are logged in as an admin.</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <EmptyState title="Error" message={errorMsg} />
      </div>
    );
  }

  if (!data || !data.days || data.days.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Engagement Hebdo</h1>
          <EmptyState title="No Data" message="No engagement data found for the past week." />
        </div>
      </div>
    );
  }

  const postsData = data.days.map(d => d.posts);
  const commentsData = data.days.map(d => d.comments);
  const likesData = data.days.map(d => d.likes);
  const activeUsersData = data.days.map(d => d.active_users);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Engagement Hebdo</h1>
          <p className="mt-2 text-sm text-gray-500">
            {new Date(data.week_start).toLocaleDateString()} to {new Date(data.week_end).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Posts"
            value={data.total.posts}
            prevValue={data.prev_week.posts}
            sparklineData={postsData}
          />
          <KPICard
            title="Comments"
            value={data.total.comments}
            prevValue={data.prev_week.comments}
            sparklineData={commentsData}
          />
          <KPICard
            title="Likes"
            value={data.total.likes}
            prevValue={data.prev_week.likes}
            sparklineData={likesData}
          />
          <KPICard
            title="Active Users"
            value={data.total.active_users}
            prevValue={data.prev_week.active_users}
            sparklineData={activeUsersData}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.days.map((day) => (
                <tr key={day.date}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.posts}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.comments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.likes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.active_users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
