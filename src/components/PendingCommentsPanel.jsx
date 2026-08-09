'use client';

import React, { useState, useEffect } from 'react';
import EmptyState from './EmptyState';

export default function PendingCommentsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/moderation/pending-comments');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col min-h-[250px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Commentaires non répondus &gt;24h</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const count = data?.count || 0;

  if (count === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Commentaires non répondus &gt;24h</h2>
        <div className="flex-grow flex items-center justify-center">
          <EmptyState title="Aucun commentaire en attente" message="Tous les commentaires ont été traités." />
        </div>
      </div>
    );
  }

  const formatAge = (hours) => {
    if (hours < 24) {
      return `${Math.floor(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`;
  };

  const comments = data?.comments?.slice(0, 5) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Commentaires non répondus &gt;24h</h2>
      <div className="flex items-center mb-6">
        <span className={`text-4xl font-bold ${count > 0 ? 'text-red-600' : 'text-gray-400'}`}>
          {count}
        </span>
        <span className="ml-2 text-sm text-gray-500">en attente</span>
      </div>
      <div className="space-y-4 flex-grow overflow-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-sm text-gray-900">{comment.author}</span>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                {formatAge(comment.age_hours)}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate" title={comment.snippet}>
              {comment.snippet?.length > 80 ? comment.snippet.substring(0, 80) + '...' : comment.snippet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
