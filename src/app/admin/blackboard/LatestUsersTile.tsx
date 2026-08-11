'use client';

import React, { useState, useEffect } from 'react';
import EmptyState from '../../../components/EmptyState';
import { UserRow } from '../../../lib/blackboard/fetchers/users';

export default function LatestUsersTile() {
  const [data, setData] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/blackboard/users/latest');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `il y a ${diffInSeconds} s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `il y a ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `il y a ${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `il y a ${diffInDays} j`;
  };

  const maskEmail = (email?: string) => {
    if (!email) return 'N/A';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    return `${localPart.charAt(0)}•••@${domain}`;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-full min-h-[250px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          Derniers users
        </h2>
        <div className="flex-grow flex flex-col justify-center">
          <EmptyState
            title="Aucun utilisateur"
            message={`Erreur ou aucune donnée retournée. (${error || 'Empty array'})`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        Derniers users
      </h2>
      <div className="flex-grow overflow-auto">
        <ul className="divide-y divide-gray-100">
          {data.map((user) => (
            <li key={user.id} className="py-3 flex justify-between items-center text-sm">
              <span className="font-medium text-gray-900">{maskEmail(user.email)}</span>
              <span className="text-gray-500">{formatRelativeTime(user.created_at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
