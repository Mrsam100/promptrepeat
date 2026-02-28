import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalOptimizations, avgLatency, recentUsage, recent] = await Promise.all([
      prisma.usage.count({ where: { userId } }),

      prisma.usage.aggregate({
        where: { userId },
        _avg: { latencyMs: true },
      }),

      prisma.usage.findMany({
        where: { userId, timestamp: { gte: sevenDaysAgo } },
        select: { timestamp: true, latencyMs: true, repetitionMode: true },
        orderBy: { timestamp: 'asc' },
      }),

      prisma.usage.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
          id: true,
          promptText: true,
          repetitionMode: true,
          latencyMs: true,
          taskType: true,
          timestamp: true,
          promptLength: true,
        },
      }),
    ]);

    // Build chart data grouped by date
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartMap: Record<string, { usage: number; totalLatency: number }> = {};
    for (const row of recentUsage) {
      const key = row.timestamp.toISOString().split('T')[0];
      if (!chartMap[key]) chartMap[key] = { usage: 0, totalLatency: 0 };
      chartMap[key].usage++;
      chartMap[key].totalLatency += row.latencyMs;
    }
    const chartData = Object.entries(chartMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateStr, v]) => ({
        name: dayNames[new Date(dateStr + 'T00:00:00Z').getUTCDay()],
        date: dateStr,
        usage: v.usage,
        avgLatency: Math.round(v.totalLatency / v.usage),
      }));

    // Most used mode
    const modeCounts: Record<string, number> = {};
    for (const row of recentUsage) {
      modeCounts[row.repetitionMode] = (modeCounts[row.repetitionMode] || 0) + 1;
    }
    const mostUsedMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const thisWeekCount = recentUsage.length;

    return NextResponse.json({
      totalOptimizations,
      avgLatencyMs: Math.round(avgLatency._avg.latencyMs ?? 0),
      thisWeekCount,
      mostUsedMode,
      chartData,
      recent,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
