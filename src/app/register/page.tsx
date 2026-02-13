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

type ApiSession = {
  access_token: string;
  refresh_token: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const json = (await res.json()) as {
        session?: ApiSession | null;
        error?: string;
      };

      if (!res.ok) {
        toast.error(json.error ?? "Falha ao criar conta.");
        return;
      }

      const supabase = getSupabaseBrowserClient();

      if (json.session?.access_token && json.session?.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: json.session.access_token,
          refresh_token: json.session.refresh_token
        });

        if (!error) {
          toast.success(
            "Conta criada com sucesso! Escolha seu plano para continuar."
          );
          router.push("/planos");
          return;
        }
      }

      toast.message(
        "Conta criada. Se o Supabase estiver exigindo confirmação por e-mail, finalize pelo link que você recebeu."
      );
      router.push("/login");
    } catch {
      toast.error("Falha ao criar conta.");
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
                Criar conta
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-black text-white hover:bg-zinc-800"
                  disabled={loading}
                >
                  {loading ? "Criando..." : "Criar conta"}
                </Button>

                <div className="text-sm text-black/60">
                  Já tem conta?{" "}
                  <Link href="/login" className="font-semibold text-black">
                    Entrar
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
