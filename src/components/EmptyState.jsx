import React from 'react';

export default function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center h-full min-h-[200px]">
      <div className="text-gray-400 mb-2">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title || 'Data Unavailable'}</h3>
      <p className="text-sm text-gray-500">
        {message || 'This endpoint is not returning data yet or is stubbed out.'}
      </p>
    </div>
  );
}
