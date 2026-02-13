"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { checkSubscriptionStatus } from "@/lib/subscription";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "";

const FEATURES = [
  "Pipeline completo de vendas",
  "Oportunidades ilimitadas",
  "Drag & drop entre etapas",
  "Dashboard com métricas",
  "Suporte por e-mail"
];

export default function PlanosPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function init() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setEmail(user.email ?? null);

        const sub = await checkSubscriptionStatus();

        if (sub.active) {
          router.push("/dashboard");
          return;
        }
      } catch {
        toast.error("Falha ao verificar conta.");
      } finally {
        setLoading(false);
      }
    }

    void init();
  }, [router]);

  function handleCheckout() {
    if (!CHECKOUT_URL) {
      toast.error("Link de checkout não configurado.");
      return;
    }

    const url = email
      ? `${CHECKOUT_URL}?prefilled_email=${encodeURIComponent(email)}`
      : CHECKOUT_URL;

    window.location.href = url;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm text-black/50">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight">
            Escolha seu plano
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Para usar o CRM, é necessário ter uma assinatura ativa.
          </p>
        </div>

        <Card className="w-full max-w-sm border-2 border-black">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-black tracking-tight">
              Plano Mensal
            </CardTitle>
            <CardDescription>Acesso completo ao CRM</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-black">R$ 99</span>
              <span className="text-sm text-black/50">/mês</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 grid gap-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="size-4 shrink-0 text-black" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full rounded-full bg-black text-white hover:bg-zinc-800"
              onClick={handleCheckout}
            >
              Assinar agora
            </Button>

            <p className="mt-4 text-center text-xs text-black/40">
              Pagamento seguro via Stripe. Cancele quando quiser.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
