import { fetchAndUpsertGSC } from '../../lib/gsc-fasting-fr';
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


async function getGSCFastFrSEO() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return {
      isMock: true,
      totals: { impressions: 150000, clics: 12500, ctr: 0.083, position: 12.4 },
      top_pages: [
        { url: 'https://fasting.fr/', impressions: 45000, clics: 4500, ctr: 0.1, position: 2.1 },
        { url: 'https://fasting.fr/jeune-intermittent/', impressions: 30000, clics: 2500, ctr: 0.083, position: 4.5 },
        { url: 'https://fasting.fr/perdre-du-poids/', impressions: 20000, clics: 1500, ctr: 0.075, position: 6.2 },
        { url: 'https://fasting.fr/bienfaits/', impressions: 15000, clics: 1000, ctr: 0.066, position: 8.9 },
        { url: 'https://fasting.fr/programme/', impressions: 10000, clics: 800, ctr: 0.08, position: 5.4 },
      ]
    };
  }

  try {
    const { records = [] } = await fetchAndUpsertGSC();

    let totalImpressions = 0;
    let totalClics = 0;
    let totalCtr = 0;
    let totalPosition = 0;

    if (records.length > 0) {
      records.forEach((r) => {
        totalImpressions += r.impressions;
        totalClics += r.clics;
      });

      totalCtr = totalImpressions > 0 ? totalClics / totalImpressions : 0;

      const weightedPositionSum = records.reduce((sum, r) => sum + r.position * r.impressions, 0);
      totalPosition = totalImpressions > 0 ? weightedPositionSum / totalImpressions : 0;
    }

    const topPages = [...records]
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5)
      .map(r => ({
        url: r.page,
        impressions: r.impressions,
        clics: r.clics,
        ctr: r.ctr,
        position: r.position
      }));

    return {
      isMock: false,
      totals: { impressions: totalImpressions, clics: totalClics, ctr: totalCtr, position: totalPosition },
      top_pages: topPages
    };
  } catch (err) {
    console.error('Error fetching fasting.fr SEO directly:', err);
    return null;
  }
}

export default async function Panels() {
  const [comments, emails, users, sales, gscStats, fastFrSeo] = await Promise.all([
    getComments(),
    getHubSpotEmails(),
    getSupabaseUsers(),
    getStripeSales(),
    getGSCStats(),
    getGSCFastFrSEO(),
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

      {/* 5. fasting.fr SEO (28j) */}
      <div className="bg-white shadow rounded-lg p-4 text-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 flex justify-between items-center">
          <span>fasting.fr SEO (28j)</span>
          {fastFrSeo?.isMock && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Mocked (GSC non configuré)</span>}
        </h2>
        {fastFrSeo ? (
          <div className="text-sm">
            <div className="grid grid-cols-4 gap-4 mb-6 text-center">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">Impressions</div>
                <div className="font-bold text-lg">{fastFrSeo.totals.impressions.toLocaleString('fr-FR')}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">Clics</div>
                <div className="font-bold text-lg text-blue-600">{fastFrSeo.totals.clics.toLocaleString('fr-FR')}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">CTR</div>
                <div className="font-bold text-lg">{(fastFrSeo.totals.ctr * 100).toFixed(2)}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">Position Moy.</div>
                <div className="font-bold text-lg">{fastFrSeo.totals.position.toFixed(1)}</div>
              </div>
            </div>

            <h3 className="font-bold mb-2">Top 5 pages (Impressions)</h3>
            <div className="space-y-3">
              {fastFrSeo.top_pages.map((p: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 pb-2 last:border-0">
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-sm" title={p.url}>
                    {p.url.replace('https://fasting.fr', '') || '/'}
                  </a>
                  <div className="flex gap-4 mt-1 sm:mt-0 text-xs text-gray-600">
                    <span title="Impressions"><span className="text-gray-400">👁</span> {p.impressions.toLocaleString('fr-FR')}</span>
                    <span title="Clics"><span className="text-gray-400">🖱</span> {p.clics.toLocaleString('fr-FR')}</span>
                    <span title="Position"><span className="text-gray-400">#</span> {p.position.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Erreur de chargement des données SEO.</p>
        )}
      </div>
    </div>
  );
}
