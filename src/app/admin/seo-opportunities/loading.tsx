import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="mt-8 bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="h-10 bg-gray-200 border-b border-gray-100"></div>
            <div className="h-16 bg-white border-b border-gray-100"></div>
            <div className="h-16 bg-gray-50 border-b border-gray-100"></div>
            <div className="h-16 bg-white border-b border-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
