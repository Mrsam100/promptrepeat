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

    const rawPage = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const page = Number.isNaN(rawPage) ? 1 : Math.max(rawPage, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.usage.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          promptText: true,
          optimizedText: true,
          outputText: true,
          repetitionMode: true,
          latencyMs: true,
          taskType: true,
          confidenceScore: true,
          promptLength: true,
          timestamp: true,
        },
      }),
      prisma.usage.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 });
  }
}
