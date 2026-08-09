'use client';

import React, { useState, useEffect } from 'react';
import EmptyState from './EmptyState';

export default function BlackboardTile({ title, endpoint }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-full min-h-[250px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !data || (Array.isArray(data) && data.length === 0) || Object.keys(data).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <EmptyState
          title={`No data for ${title}`}
          message={`Endpoint ${endpoint} failed or returned no data. (Error: ${error || 'Empty response'})`}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex-grow overflow-auto">
        <pre className="text-xs bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
