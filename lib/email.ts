import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  const resend = getResend();
  const fromEmail = process.env.EMAIL_FROM || "PromptRepeat <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Reset your PromptRepeat password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0;">PromptRepeat</h1>
        </div>

        <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 32px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 0 0 12px;">Reset your password</h2>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 24px;">
            We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
          </p>

          <a href="${resetUrl}" style="display: inline-block; background: #FF5A1F; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px;">
            Reset Password
          </a>

          <p style="font-size: 12px; color: #999; line-height: 1.5; margin: 24px 0 0;">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

          <p style="font-size: 11px; color: #bbb; line-height: 1.5; margin: 0; word-break: break-all;">
            If the button doesn't work, copy and paste this link:<br />
            <a href="${resetUrl}" style="color: #FF5A1F;">${resetUrl}</a>
          </p>
        </div>

        <p style="font-size: 11px; color: #ccc; text-align: center; margin-top: 24px;">
          &copy; ${new Date().getFullYear()} PromptRepeat. All rights reserved.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send email");
  }
}
