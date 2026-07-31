import React from 'react';

export default function BlackboardLivePage() {
  // Stubbed data
  const comments = [
    { id: 1, author: 'Alice', text: 'Great article on fasting!', date: '2023-10-27' },
    { id: 2, author: 'Bob', text: 'How long should I fast?', date: '2023-10-26' },
  ];

  const emails = [
    { id: 1, subject: 'Welcome to Club Fasting', sent: 1500, opened: 800 },
    { id: 2, subject: 'Weekly Newsletter', sent: 5000, opened: 2100 },
  ];

  const recentUsers = [
    { id: 1, name: 'Charlie', email: 'charlie@example.com', joined: '2 Hours ago' },
    { id: 2, name: 'Diana', email: 'diana@example.com', joined: '5 Hours ago' },
  ];

  const stripeSales = [
    { id: 1, amount: '$49.00', product: 'Premium Membership', date: '2023-10-27' },
    { id: 2, amount: '$19.00', product: 'Basic Membership', date: '2023-10-27' },
    { id: 3, amount: '$99.00', product: 'Annual Plan', date: '2023-10-26' },
  ];

  const gscData = {
    clicks: 12540,
    impressions: 154300,
    ctr: '8.13%',
    position: 4.2,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blackboard Fasting Live</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Recent Comments</h2>
            <ul className="space-y-3">
              {comments.map(comment => (
                <li key={comment.id} className="text-sm">
                  <span className="font-medium text-blue-600">{comment.author}</span>:
                  <span className="text-gray-700 ml-1">"{comment.text}"</span>
                  <div className="text-xs text-gray-400 mt-1">{comment.date}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Emails Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Email Campaigns</h2>
            <ul className="space-y-4">
              {emails.map(email => (
                <li key={email.id} className="text-sm">
                  <div className="font-medium text-gray-800">{email.subject}</div>
                  <div className="text-gray-600 flex justify-between mt-1">
                    <span>Sent: {email.sent}</span>
                    <span>Opened: {email.opened}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Users Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Recent Users</h2>
            <ul className="space-y-3">
              {recentUsers.map(user => (
                <li key={user.id} className="text-sm flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{user.joined}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stripe Sales Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Stripe Sales</h2>
            <ul className="space-y-3">
              {stripeSales.map(sale => (
                <li key={sale.id} className="text-sm flex justify-between items-center">
                  <div>
                    <div className="font-medium text-green-600">{sale.amount}</div>
                    <div className="text-gray-600 text-xs">{sale.product}</div>
                  </div>
                  <span className="text-xs text-gray-400">{sale.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* GSC API Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">fasting.fr Search Console</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded text-center">
                <div className="text-2xl font-bold text-blue-600">{gscData.clicks.toLocaleString()}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Clicks</div>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center">
                <div className="text-2xl font-bold text-indigo-600">{gscData.impressions.toLocaleString()}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Impressions</div>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center">
                <div className="text-2xl font-bold text-purple-600">{gscData.ctr}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">CTR</div>
              </div>
              <div className="bg-gray-50 p-3 rounded text-center">
                <div className="text-2xl font-bold text-teal-600">{gscData.position}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Avg Position</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
