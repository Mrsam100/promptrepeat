import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 per minute per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`newsletter:${ip}`, { limit: 5, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { email } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase().substring(0, 255);

    // Upsert to handle duplicates gracefully
    await prisma.newsletterSubscriber.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
