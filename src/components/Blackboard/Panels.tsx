import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lyyevuyejxrjpsaisaal.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = supabaseAdminKey ? createClient(supabaseUrl, supabaseAdminKey) : null;

async function getComments() {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching comments:', err);
    return [];
  }
}

async function getHubSpotEmails() {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/emails?limit=5&sort=-hs_createdate', {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('HubSpot fetch failed');
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error fetching HubSpot emails:', err);
    return [];
  }
}

async function getSupabaseUsers() {
  if (!supabaseAdmin) return [];
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 5,
    });
    if (error) throw error;
    return users || [];
  } catch (err) {
    console.error('Error fetching Supabase users:', err);
    return [];
  }
}

async function getStripeSales() {
  const token = process.env.STRIPE_SECRET_KEY;
  if (!token) return [];
  try {
    const res = await fetch('https://api.stripe.com/v1/charges?limit=5', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Stripe fetch failed');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching Stripe sales:', err);
    return [];
  }
}

async function getGSCStats() {
  const token = process.env.GSC_ACCESS_TOKEN;
  if (!token) return null;
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    const res = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Ffasting.fr/searchAnalytics/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['date'],
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('GSC fetch failed');
    const data = await res.json();
    return data.rows || [];
  } catch (err) {
    console.error('Error fetching GSC stats:', err);
    return null;
  }
}

export default async function Panels() {
  const [comments, emails, users, sales, gscStats] = await Promise.all([
    getComments(),
    getHubSpotEmails(),
    getSupabaseUsers(),
    getStripeSales(),
    getGSCStats(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* 1. Derniers commentaires Supabase */}
      <div className="bg-white shadow rounded-lg p-4 text-gray-800">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Derniers commentaires</h2>
        {comments.length > 0 ? (
          <ul className="space-y-3">
            {comments.map((c: any) => (
              <li key={c.id} className="text-sm">
                <p className="font-medium">{c.content || c.text || JSON.stringify(c)}</p>
                <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Aucun commentaire ou erreur de connexion.</p>
        )}
      </div>

      {/* 2. Derniers emails HubSpot */}
      <div className="bg-white shadow rounded-lg p-4 text-gray-800">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Derniers emails (HubSpot)</h2>
        {emails.length > 0 ? (
          <ul className="space-y-3">
            {emails.map((e: any) => (
              <li key={e.id} className="text-sm">
                <p className="font-semibold">{e.properties?.hs_email_subject || 'Sans objet'}</p>
                <span className="text-xs text-gray-500">{new Date(e.createdAt || e.properties?.hs_createdate).toLocaleString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Configuration HubSpot manquante ou aucun email.</p>
        )}
      </div>

      {/* 3. 5 derniers users Supabase */}
      <div className="bg-white shadow rounded-lg p-4 text-gray-800">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">5 derniers utilisateurs</h2>
        {users.length > 0 ? (
          <ul className="space-y-3">
            {users.map((u: any) => (
              <li key={u.id} className="text-sm flex justify-between">
                <span className="truncate pr-2 font-medium">{u.email}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Clé Admin Supabase manquante ou aucun utilisateur.</p>
        )}
      </div>

      {/* 4. 5 dernières ventes Stripe */}
      <div className="bg-white shadow rounded-lg p-4 text-gray-800">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">5 dernières ventes (Stripe)</h2>
        {sales.length > 0 ? (
          <ul className="space-y-3">
            {sales.map((s: any) => (
              <li key={s.id} className="text-sm flex justify-between items-center">
                <span className="font-bold text-green-600">{(s.amount / 100).toFixed(2)} {s.currency.toUpperCase()}</span>
                <span className="text-xs text-gray-500">{new Date(s.created * 1000).toLocaleDateString('fr-FR')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Clé Stripe manquante ou aucune vente.</p>
        )}
      </div>

      {/* 5. Stats GSC fasting.fr (7j) */}
      <div className="bg-white shadow rounded-lg p-4 text-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Stats GSC fasting.fr (7j)</h2>
        {gscStats ? (
          <div className="text-sm">
            <p className="mb-4 text-gray-600">Clics et impressions des 7 derniers jours sur la Search Console.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gscStats.map((r: any, i: number) => (
                <div key={i} className="flex flex-col border border-gray-200 rounded p-2">
                  <span className="text-xs text-gray-500">{r.keys[0]}</span>
                  <span className="font-bold text-blue-600">{r.clicks} clics</span>
                  <span className="text-xs text-gray-400">{r.impressions} impressions</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Token GSC manquant ou erreur.</p>
        )}
      </div>
    </div>
  );
}
