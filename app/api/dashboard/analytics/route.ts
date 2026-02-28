import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const rawRange = parseInt(req.nextUrl.searchParams.get('range') || '7');
    const range = Number.isNaN(rawRange) ? 7 : Math.min(Math.max(rawRange, 1), 365);

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - range);

    const [usageRows, modeGroups, agg] = await Promise.all([
      prisma.usage.findMany({
        where: { userId, timestamp: { gte: daysAgo } },
        select: {
          timestamp: true,
          latencyMs: true,
          repetitionMode: true,
          promptLength: true,
        },
        orderBy: { timestamp: 'asc' },
      }),

      prisma.usage.groupBy({
        by: ['repetitionMode'],
        where: { userId, timestamp: { gte: daysAgo } },
        _count: true,
      }),

      prisma.usage.aggregate({
        where: { userId, timestamp: { gte: daysAgo } },
        _avg: { latencyMs: true, promptLength: true },
        _count: true,
        _min: { latencyMs: true },
        _max: { latencyMs: true },
      }),
    ]);

    // Group by date for time-series
    const byDate: Record<string, { count: number; totalLatency: number; totalPromptLen: number }> = {};
    for (const row of usageRows) {
      const key = row.timestamp.toISOString().split('T')[0];
      if (!byDate[key]) byDate[key] = { count: 0, totalLatency: 0, totalPromptLen: 0 };
      byDate[key].count++;
      byDate[key].totalLatency += row.latencyMs;
      byDate[key].totalPromptLen += row.promptLength;
    }
    const timeSeriesData = Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        date,
        optimizations: v.count,
        avgLatency: Math.round(v.totalLatency / v.count),
        avgPromptLength: Math.round(v.totalPromptLen / v.count),
      }));

    const modeDistribution = modeGroups.map((g) => ({
      name: g.repetitionMode,
      value: g._count,
    }));

    return NextResponse.json({
      timeSeriesData,
      modeDistribution,
      stats: {
        total: agg._count,
        avgLatency: Math.round(agg._avg.latencyMs ?? 0),
        minLatency: agg._min.latencyMs ?? 0,
        maxLatency: agg._max.latencyMs ?? 0,
        avgPromptLength: Math.round(agg._avg.promptLength ?? 0),
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to load analytics data' }, { status: 500 });
  }
}
