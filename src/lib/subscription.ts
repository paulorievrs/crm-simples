import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { TABLES } from "@/lib/supabase/tables";

export type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export function isActiveSubscription(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

export async function checkSubscriptionStatus(): Promise<{
  authenticated: boolean;
  status: string;
  active: boolean;
}> {
  const supabase = getSupabaseBrowserClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { authenticated: false, status: "incomplete", active: false };
  }

  const { data: profile, error: profileError } = await supabase
    .from(TABLES.profiles)
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { authenticated: true, status: "incomplete", active: false };
  }

  const status = profile.subscription_status ?? "incomplete";

  return {
    authenticated: true,
    status,
    active: isActiveSubscription(status)
  };
}
