import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 per minute per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`reset-password:${ip}`, { limit: 5, windowSeconds: 60 });
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

    const { token, email, password } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Reset token is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "New password is required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (password.length > 128) {
      return NextResponse.json({ error: "Password must be 128 characters or fewer" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find the token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    // Check expiration
    if (new Date() > verificationToken.expires) {
      // Clean up expired token
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail, token },
      });
      return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
