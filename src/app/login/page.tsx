"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { checkSubscriptionStatus } from "@/lib/subscription";

type ApiSession = {
  access_token: string;
  refresh_token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const json = (await res.json()) as {
        session?: ApiSession | null;
        error?: string;
      };

      if (!res.ok) {
        toast.error(json.error ?? "Falha ao entrar.");
        return;
      }

      const supabase = getSupabaseBrowserClient();

      if (json.session?.access_token && json.session?.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: json.session.access_token,
          refresh_token: json.session.refresh_token
        });

        if (error) {
          toast.message(
            "Login efetuado. Se a sessão não persistir, verifique suas variáveis NEXT_PUBLIC_SUPABASE_* e as configurações do Supabase."
          );
        }
      }

      const sub = await checkSubscriptionStatus();

      if (sub.active) {
        toast.success("Bem-vindo!");
        router.push("/dashboard");
      } else {
        toast.success("Bem-vindo! Escolha seu plano para continuar.");
        router.push("/planos");
      }
    } catch {
      toast.error("Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-black/10">
            <CardHeader>
              <CardTitle className="text-2xl font-black tracking-tight">
                Entrar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="text-right">
                    <Link
                      href="/esqueci-senha"
                      className="text-xs font-medium text-black/50 transition-colors hover:text-black"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-black text-white hover:bg-zinc-800"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>

                <div className="text-sm text-black/60">
                  Não tem conta?{" "}
                  <Link href="/register" className="font-semibold text-black">
                    Criar conta
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
