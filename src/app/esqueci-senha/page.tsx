"use client";

import Link from "next/link";
import * as React from "react";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        toast.error(json.error ?? "Falha ao enviar e-mail.");
        return;
      }

      setSent(true);
    } catch {
      toast.error("Falha ao enviar e-mail.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6">
          <div className="mx-auto w-full max-w-md">
            <Card className="border-black/10">
              <CardHeader>
                <CardTitle className="text-2xl font-black tracking-tight">
                  E-mail enviado
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-black/60">
                  Se existe uma conta com o e-mail <strong>{email}</strong>,
                  você receberá um link para redefinir sua senha. Verifique
                  também a pasta de spam.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-black/10"
                >
                  <Link href="/login">
                    <ArrowLeft className="mr-2 size-4" />
                    Voltar para o login
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6">
        <div className="mx-auto w-full max-w-md">
          <Card className="border-black/10">
            <CardHeader>
              <CardTitle className="text-2xl font-black tracking-tight">
                Esqueci minha senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={onSubmit}>
                <p className="text-sm text-black/60">
                  Informe seu e-mail e enviaremos um link para redefinir sua
                  senha.
                </p>

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

                <Button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-black text-white hover:bg-zinc-800"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar link"}
                </Button>

                <div className="text-sm text-black/60">
                  Lembrou a senha?{" "}
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
