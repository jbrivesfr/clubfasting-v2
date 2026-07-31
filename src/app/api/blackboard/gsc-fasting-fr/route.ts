import { NextResponse } from 'next/server';
import { fetchAndUpsertGSC } from '../../../../lib/gsc-fasting-fr';

export async function GET() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return NextResponse.json({ error: 'GSC non configuré' }, { status: 503 });
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

    return NextResponse.json({
      totals: {
        impressions: totalImpressions,
        clics: totalClics,
        ctr: totalCtr,
        position: totalPosition,
      },
      top_pages: topPages
    });
  } catch (error: any) {
    console.error('Error in GSC blackboard endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
