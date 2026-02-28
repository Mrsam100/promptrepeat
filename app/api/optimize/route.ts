import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PromptEngine } from '@/lib/engine';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

const MAX_PROMPT_LENGTH = 50000;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 20 optimizations per minute per user
    const rl = rateLimit(`optimize:${session.user.id}`, { limit: 20, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rl.resetInSeconds),
            'X-RateLimit-Limit': String(rl.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { prompt, ...options } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required and must be a string' }, { status: 400 });
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH.toLocaleString()} characters allowed.` },
        { status: 400 }
      );
    }

    const result = await PromptEngine.execute(prompt, options);

    // Log usage to database (non-blocking, never fails the request)
    try {
      await prisma.usage.create({
        data: {
          userId: session.user.id,
          promptLength: prompt.length,
          repetitionMode: result.mode,
          latencyMs: result.latencyMs,
          promptText: prompt.substring(0, 10000),
          optimizedText: result.optimizedPrompt?.substring(0, 20000) || null,
          outputText: result.output?.substring(0, 20000) || null,
          taskType: result.taskType || null,
          confidenceScore: result.confidenceScore ?? null,
        },
      });
    } catch (logError) {
      console.error('Usage logging error:', logError);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Optimization failed. Please try again.' }, { status: 500 });
  }
}
