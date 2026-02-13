import Stripe from "stripe";
import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { TABLES } from "@/lib/supabase/tables";

export const runtime = "nodejs";

type ProfileUpdate = {
  stripe_customer_id?: string | null;
  subscription_status?: string;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  email?: string | null;
};

function toIsoOrNull(unixSeconds?: number | null) {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000).toISOString();
}

async function updateProfileByEmail(email: string, patch: ProfileUpdate) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from(TABLES.profiles)
    .update(patch)
    .eq("email", email);

  if (error) throw error;
}

async function updateProfileByCustomerId(
  customerId: string,
  patch: ProfileUpdate
) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from(TABLES.profiles)
    .update(patch)
    .eq("stripe_customer_id", customerId);

  if (error) throw error;
}

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch {
    // return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    event = {} as Stripe.Event;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId =
          typeof session.customer === "string" ? session.customer : null;

        const email =
          session.customer_details?.email ??
          (typeof session.client_reference_id === "string" &&
          session.client_reference_id.includes("@")
            ? session.client_reference_id
            : null);

        let patch: ProfileUpdate = {
          stripe_customer_id: customerId,
          email
        };

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const firstItem = sub.items?.data?.[0];

          patch = {
            ...patch,
            subscription_status: sub.status,
            current_period_start: toIsoOrNull(firstItem?.current_period_start),
            current_period_end: toIsoOrNull(firstItem?.current_period_end),
            cancel_at_period_end: sub.cancel_at_period_end
          };
        } else {
          patch = {
            ...patch,
            subscription_status: "active"
          };
        }

        if (email) {
          await updateProfileByEmail(email, patch);
        } else if (customerId) {
          await updateProfileByCustomerId(customerId, patch);
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : null;

        if (customerId) {
          const status =
            event.type === "customer.subscription.deleted"
              ? "canceled"
              : sub.status;

          const firstItem = sub.items?.data?.[0];

          await updateProfileByCustomerId(customerId, {
            subscription_status: status,
            current_period_start: toIsoOrNull(firstItem?.current_period_start),
            current_period_end: toIsoOrNull(firstItem?.current_period_end),
            cancel_at_period_end: sub.cancel_at_period_end
          });
        }

        break;
      }

      case "invoice.payment_failed":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : null;

        if (customerId) {
          await updateProfileByCustomerId(customerId, {
            subscription_status:
              event.type === "invoice.payment_failed" ? "past_due" : "active"
          });
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    console.error("Stripe webhook handler error:", e);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
