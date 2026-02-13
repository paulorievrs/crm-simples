"use client";

import Link from "next/link";
import * as React from "react";

import { ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ensureUserPipeline, type Deal } from "@/lib/crm/bootstrap";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { checkSubscriptionStatus } from "@/lib/subscription";
import { TABLES } from "@/lib/supabase/tables";

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const sub = await checkSubscriptionStatus();
      if (!sub.active) {
        window.location.href = "/planos";
        return;
      }

      setUserEmail(user.email ?? null);

      const { pipeline } = await ensureUserPipeline();

      const { data: dealsRows, error } = await supabase
        .from(TABLES.deals)
        .select("id,title,value,stage_id,pipeline_id,created_at,updated_at")
        .eq("user_id", user.id)
        .eq("pipeline_id", pipeline.id)
        .order("updated_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setDeals((dealsRows ?? []) as Deal[]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (message.includes("Missing database tables")) {
        toast.error(
          "Tabelas do CRM não encontradas no Supabase. Rode o arquivo supabase/schema.sql no SQL Editor e aguarde alguns segundos."
        );
      } else {
        toast.error("Falha ao carregar o dashboard.");
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function onLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  React.useEffect(() => {
    void load();
  }, []);

  const totalDeals = deals.length;
  const totalValue = deals.reduce((acc, d) => acc + (d.value ?? 0), 0);
  const recentDeals = deals.slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="text-sm font-black tracking-tight">Dashboard</div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <div className="hidden text-sm text-black/50 md:block">
                {userEmail}
              </div>
            )}
            <Button
              variant="outline"
              className="rounded-full border-black/10"
              asChild
            >
              <Link href="/pipeline">
                Ver pipeline <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-black/5"
              onClick={onLogout}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-black/10">
            <CardHeader>
              <CardDescription>Oportunidades</CardDescription>
              <CardTitle className="text-3xl font-black">
                {totalDeals}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-black/10">
            <CardHeader>
              <CardDescription>Valor total</CardDescription>
              <CardTitle className="text-3xl font-black">
                {formatCurrencyBRL(totalValue)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-black/10">
            <CardHeader>
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-3xl font-black">
                {loading ? "Carregando..." : "Ativo"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Atividade recente
              </h2>
              <p className="text-sm text-black/60">
                Últimas oportunidades atualizadas no seu pipeline.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-black/10"
              onClick={() => void load()}
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {recentDeals.length === 0 ? (
              <Card className="border-black/10 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-black">
                    Nenhuma oportunidade ainda
                  </CardTitle>
                  <CardDescription>
                    Vá para o pipeline e crie sua primeira oportunidade.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="rounded-full bg-black text-white">
                    <Link href="/pipeline">Criar oportunidade</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              recentDeals.map((d) => (
                <Card key={d.id} className="border-black/10">
                  <CardHeader>
                    <CardTitle className="text-base font-black">
                      {d.title}
                    </CardTitle>
                    <CardDescription>
                      {d.value ? formatCurrencyBRL(d.value) : "Sem valor"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
