import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PromptEngine } from '@/lib/engine';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, ...options } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await PromptEngine.execute(prompt, options);

    // Log usage to database
    try {
      const userId = session.user.id;
      if (userId) {
        await prisma.usage.create({
          data: {
            userId,
            promptLength: prompt.length,
            repetitionMode: result.mode,
            latencyMs: result.latencyMs,
          },
        });
      }
    } catch (logError) {
      console.error('Usage logging error:', logError);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Optimization error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
