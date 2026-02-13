import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { createSupabaseClient } from "@/lib/supabase/client";

const LOGIN_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 5 };

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (email.length > 255 || password.length > 128) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = checkRateLimit(`login:${email}:${ip}`, LOGIN_RATE_LIMIT);

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

    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return NextResponse.json(
        { error: "Email ou senha incorretos." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: data.user,
        session: data.session
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Falha ao processar login." },
      { status: 500 }
    );
  }
}
