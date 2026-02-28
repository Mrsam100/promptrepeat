import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 submissions per minute per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`contact:${ip}`, { limit: 3, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { firstName, lastName, email, message } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await prisma.contactSubmission.create({
      data: {
        firstName: typeof firstName === "string" ? firstName.trim().substring(0, 100) : null,
        lastName: typeof lastName === "string" ? lastName.trim().substring(0, 100) : null,
        email: email.trim().toLowerCase().substring(0, 255),
        message: message.trim().substring(0, 5000),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
