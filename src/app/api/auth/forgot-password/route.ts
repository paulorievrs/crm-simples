import crypto from "crypto";

import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { TABLES } from "@/lib/supabase/tables";
import { sendResetPasswordEmail } from "@/lib/email/send-reset-email";

const FORGOT_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 3 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ForgotPasswordBody = {
  email?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ForgotPasswordBody;
    const email = body.email?.trim().toLowerCase();

    if (!email || email.length > 255 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = checkRateLimit(`forgot:${ip}`, FORGOT_RATE_LIMIT);

    if (!rl.allowed) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const supabase = getSupabaseAdminClient();

    const { data: profile, error: profileError } = await supabase
      .from(TABLES.profiles)
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to lookup profile:", profileError);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!profile) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const userId = profile.id;

    await supabase
      .from(TABLES.password_reset_tokens)
      .update({ used: true })
      .eq("user_id", userId)
      .eq("used", false);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from(TABLES.password_reset_tokens)
      .insert({
        user_id: userId,
        token,
        expires_at: expiresAt
      });

    if (insertError) {
      console.error("Failed to insert reset token:", insertError);
      return NextResponse.json(
        { error: "Falha ao gerar token de redefinição." },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/redefinir-senha?token=${token}`;

    try {
      await sendResetPasswordEmail(email, resetUrl);
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      return NextResponse.json(
        { error: "Falha ao enviar e-mail. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("Forgot password error:", e);
    return NextResponse.json(
      { error: "Falha ao processar solicitação." },
      { status: 500 }
    );
  }
}
