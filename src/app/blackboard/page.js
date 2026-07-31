import React from 'react';

async function getGSCStats() {
  const token = process.env.GSC_ACCESS_TOKEN;
  if (!token) return null;
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3); // Account for ~3 days GSC data lag
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 10); // 7 days prior to endDate

    const res = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Ffasting.fr/searchAnalytics/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['date'],
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('GSC fetch failed');
    const data = await res.json();
    return data.rows || [];
  } catch (err) {
    console.error('Error fetching GSC stats:', err);
    return null;
  }
}

export default async function BlackboardPage() {
  const gscStats = await getGSCStats();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blackboard Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats GSC fasting.fr (7j) */}
          <div className="bg-white shadow rounded-lg p-4 text-gray-800 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Stats GSC fasting.fr (7j)</h2>
            {gscStats ? (
              <div className="text-sm">
                <p className="mb-4 text-gray-600">Clics et impressions des 7 derniers jours sur la Search Console.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {gscStats.map((r, i) => (
                    <div key={i} className="flex flex-col border border-gray-200 rounded p-2">
                      <span className="text-xs text-gray-500">{r.keys[0]}</span>
                      <span className="font-bold text-blue-600">{r.clicks} clics</span>
                      <span className="text-xs text-gray-400">{r.impressions} impressions</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Token GSC manquant ou erreur.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}