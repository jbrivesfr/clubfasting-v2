import React from 'react';
import BlackboardTile from '../../../components/BlackboardTile';
import LatestUsersTile from './LatestUsersTile';

export const metadata = {
  title: 'Blackboard Admin Dashboard | Club Fasting',
  description: 'Internal dashboard for metrics and third-party integrations.',
};

export default function BlackboardAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blackboard Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Overview of external metrics and system statuses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          <div className="lg:col-span-1">
            <BlackboardTile title="Stripe Sales" endpoint="/api/blackboard/stripe" />
          </div>

          <div className="lg:col-span-1">
            <BlackboardTile title="User Metrics" endpoint="/api/blackboard/users" />
          </div>

          <div className="lg:col-span-1">
            <BlackboardTile title="Newsletter Performance" endpoint="/api/blackboard/newsletters" />
          </div>

          <div className="lg:col-span-1">
            <BlackboardTile title="Google Search Console" endpoint="/api/blackboard/gsc" />
          </div>

          <div className="lg:col-span-1 md:col-span-2 lg:col-span-1">
            <BlackboardTile title="HubSpot Integration" endpoint="/api/blackboard/hubspot" />
          </div>

          <div className="lg:col-span-1">
            <LatestUsersTile />
          </div>
        </div>
      </div>
    </div>
  );
}
