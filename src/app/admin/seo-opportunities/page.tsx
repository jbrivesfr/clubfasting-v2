import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Opportunités SEO | Admin Club Fasting',
  description: 'Top URLs by CTR and impressions for the last 28 days.',
};

export default async function SeoOpportunitiesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Accès non autorisé. Vous devez être administrateur pour voir cette page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate the date 28 days ago
  const date28DaysAgo = new Date();
  date28DaysAgo.setDate(date28DaysAgo.getDate() - 28);
  const dateStr = date28DaysAgo.toISOString().split('T')[0];

  const { data: snapshots, error } = await supabase
    .from('seo_gsc_snapshots')
    .select('url, impressions, clics, position')
    .gte('snapshot_date', dateStr);

  if (error) {
    throw new Error('Failed to fetch SEO snapshots');
  }

  // Aggregate by URL
  const aggregated = (snapshots || []).reduce((acc, row) => {
    if (!acc[row.url]) {
      acc[row.url] = {
        url: row.url,
        impressions: 0,
        clics: 0,
        positionSum: 0,
        positionCount: 0,
      };
    }
    acc[row.url].impressions += row.impressions || 0;
    acc[row.url].clics += row.clics || 0;
    if (row.position != null) {
      acc[row.url].positionSum += Number(row.position);
      acc[row.url].positionCount += 1;
    }
    return acc;
  }, {} as Record<string, { url: string; impressions: number; clics: number; positionSum: number; positionCount: number }>);

  // Filter and compute final metrics
  const results = Object.values(aggregated)
    .map((item) => {
      const ctr = item.impressions > 0 ? item.clics / item.impressions : 0;
      const avgPosition = item.positionCount > 0 ? item.positionSum / item.positionCount : null;
      return {
        url: item.url,
        impressions: item.impressions,
        clics: item.clics,
        ctr,
        avgPosition,
      };
    })
    .filter((item) => item.ctr > 0.02 && item.impressions > 100)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin/blackboard" className="text-sm text-indigo-600 hover:text-indigo-900 mb-4 inline-block">
            &larr; Retour au Blackboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Opportunités SEO (28 derniers jours)</h1>
          <p className="mt-2 text-sm text-gray-500">
            Top 10 des URLs avec CTR &gt; 2% et Impressions &gt; 100
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clics
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position Moyenne
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length > 0 ? (
                results.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={item.url}>
                      {item.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.impressions.toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.clics.toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {(item.ctr * 100).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.avgPosition ? item.avgPosition.toFixed(1) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="https://search.google.com/search-console/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ouvrir GSC
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    Aucune opportunité trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
