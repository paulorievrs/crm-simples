import { NextResponse } from "next/server";

import { createSupabaseClient } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { access_token?: string; refresh_token?: string };

    if (!body.access_token || !body.refresh_token) {
      return NextResponse.json(
        { error: "Missing tokens" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient();

    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: body.access_token,
      refresh_token: body.refresh_token
    });

    if (sessionError || !sessionData.user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from(TABLES.profiles)
      .select("subscription_status")
      .eq("id", sessionData.user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    const status = profile?.subscription_status ?? "incomplete";

    return NextResponse.json({
      subscription_status: status,
      has_active_subscription: status === "active" || status === "trialing"
    });
  } catch {
    return NextResponse.json(
      { error: "Falha ao verificar assinatura." },
      { status: 500 }
    );
  }
}
