'use client';

import React, { useState, useEffect } from 'react';

function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full text-gray-500">
      <p className="font-medium">{title}</p>
      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  );
}

export default function PanelVentes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Assuming a proxy endpoint or that the reverse proxy handles it
      const response = await fetch('/api/blackboard/stripe');
      if (response.ok) {
        const result = await response.json();
        setData(result);
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
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col min-h-[250px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventes Stripe 24h</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col min-h-[250px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventes Stripe 24h</h2>
        <div className="flex-grow flex items-center justify-center text-sm text-gray-500">
          <EmptyState title="Aucune vente sur les 24 dernières heures" message={error ? `Erreur: ${error}` : ''} />
        </div>
      </div>
    );
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const truncateEmail = (email) => {
    if (!email) return '';
    return email.length > 20 ? email.substring(0, 17) + '...' : email;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col min-h-[250px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Ventes Stripe 24h</h2>
        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
          {data.length} vente{data.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-2">Date</th>
              <th scope="col" className="px-2 py-2">Montant</th>
              <th scope="col" className="px-2 py-2">Statut</th>
              <th scope="col" className="px-2 py-2">Client</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((sale) => (
              <tr key={sale.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-2 py-2 whitespace-nowrap">{formatDate(sale.created)}</td>
                <td className="px-2 py-2 font-medium text-gray-900">{formatCurrency(sale.amount, sale.currency)}</td>
                <td className="px-2 py-2"><span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Réussi</span></td>
                <td className="px-2 py-2 truncate" title={sale.receipt_email}>{truncateEmail(sale.receipt_email)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
