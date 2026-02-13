import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { createSupabaseClient } from "@/lib/supabase/client";

const REGISTER_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 5 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (email.length > 255 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
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
    const rl = checkRateLimit(`register:${ip}`, REGISTER_RATE_LIMIT);

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            "Não foi possível criar a conta. Verifique os dados e tente novamente."
        },
        { status: 400 }
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
      { error: "Falha ao processar cadastro." },
      { status: 500 }
    );
  }
}
