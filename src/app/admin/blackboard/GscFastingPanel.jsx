'use client';

import React, { useState, useEffect } from 'react';
import EmptyState from '../../../components/EmptyState';

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function formatPercentage(num) {
  return (num * 100).toFixed(2) + '%';
}

function KpiCard({ title, value, delta, isPercentage = false, isPosition = false, formatter }) {
  const isPositive = isPosition ? delta < 0 : delta > 0;
  const isNegative = isPosition ? delta > 0 : delta < 0;

  let formattedDelta = '';
  if (delta !== undefined && delta !== null) {
    if (isPercentage) {
      formattedDelta = (delta > 0 ? '+' : '') + formatPercentage(delta);
    } else {
      formattedDelta = (delta > 0 ? '+' : '') + formatNumber(delta);
    }
  }

  return (
    <div className="bg-gray-50 rounded p-3">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold mt-1">
        {formatter ? formatter(value) : (isPercentage ? formatPercentage(value) : formatNumber(value))}
      </div>
      {delta !== undefined && delta !== null && (
        <div className={`text-xs mt-1 font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
          {formattedDelta} vs 7j préc.
        </div>
      )}
    </div>
  );
}

export default function GscFastingPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/blackboard/gsc-fasting');
      if (response.ok) {
        const result = await response.json();
        if (result.error) {
          setError(`${result.error} - ${result.hint || ''}`);
        } else {
          setData(result);
          setError(null);
        }
      } else {
        throw new Error('Erreur réseau');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col min-h-[300px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Console — fasting.fr (7j)</h2>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col min-h-[300px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Console — fasting.fr (7j)</h2>
        <div className="flex-grow flex items-center justify-center text-sm text-gray-500">
          <EmptyState title="Impossible de charger les données GSC" message={error ? `Erreur: ${error}` : ''} />
        </div>
      </div>
    );
  }

  const { totals, delta, topPages } = data;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Search Console — fasting.fr (7j)</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <KpiCard title="Clics" value={totals.clicks} delta={delta?.clicks} />
        <KpiCard title="Impressions" value={totals.impressions} delta={delta?.impressions} />
        <KpiCard title="CTR" value={totals.ctr} isPercentage={true} />
        <KpiCard title="Position moy." value={totals.position} formatter={(v) => v.toFixed(1)} isPosition={true} />
      </div>

      <div className="flex-grow overflow-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Top 5 Pages</h3>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-2">Page</th>
              <th scope="col" className="px-2 py-2 text-right">Clics</th>
              <th scope="col" className="px-2 py-2 text-right">Impr.</th>
            </tr>
          </thead>
          <tbody>
            {(topPages || []).slice(0, 5).map((page, i) => {
              const url = new URL(page.page);
              const path = url.pathname === '/' ? '/' : url.pathname;
              return (
                <tr key={i} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-2 py-2 font-medium text-gray-900 truncate max-w-[150px]" title={page.page}>
                    {path}
                  </td>
                  <td className="px-2 py-2 text-right">{formatNumber(page.clicks)}</td>
                  <td className="px-2 py-2 text-right">{formatNumber(page.impressions)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
