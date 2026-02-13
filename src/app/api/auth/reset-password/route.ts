import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { TABLES } from "@/lib/supabase/tables";

const RESET_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 5 };
const HEX_TOKEN_REGEX = /^[a-f0-9]{64}$/;

type ResetPasswordBody = {
  token?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ResetPasswordBody;
    const token = body.token?.trim();
    const password = body.password;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token e nova senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (!HEX_TOKEN_REGEX.test(token)) {
      return NextResponse.json({ error: "Token inválido." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: "Senha muito longa." },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = checkRateLimit(`reset:${ip}`, RESET_RATE_LIMIT);

    if (!rl.allowed) {
      const retryAfterSec = Math.ceil(rl.retryAfterMs / 1000);
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${retryAfterSec}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) }
        }
      );
    }

    const supabase = getSupabaseAdminClient();

    const { data: tokenRow, error: tokenError } = await supabase
      .from(TABLES.password_reset_tokens)
      .select("id, user_id, expires_at, used")
      .eq("token", token)
      .maybeSingle();

    if (tokenError) {
      console.error("Token lookup error:", tokenError);
      return NextResponse.json(
        { error: "Falha ao verificar token." },
        { status: 500 }
      );
    }

    if (!tokenRow) {
      return NextResponse.json(
        { error: "Token inválido ou expirado." },
        { status: 400 }
      );
    }

    if (tokenRow.used) {
      return NextResponse.json(
        { error: "Este link já foi utilizado. Solicite um novo." },
        { status: 400 }
      );
    }

    const expiresAt = new Date(tokenRow.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Este link expirou. Solicite um novo." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      tokenRow.user_id,
      {
        password
      }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { error: "Falha ao atualizar a senha." },
        { status: 500 }
      );
    }

    await supabase
      .from(TABLES.password_reset_tokens)
      .update({ used: true })
      .eq("id", tokenRow.id);

    return NextResponse.json(
      { ok: true, message: "Senha redefinida com sucesso." },
      { status: 200 }
    );
  } catch (e) {
    console.error("Reset password error:", e);
    return NextResponse.json(
      { error: "Falha ao processar solicitação." },
      { status: 500 }
    );
  }
}
