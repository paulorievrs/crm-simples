"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        toast.error(json.error ?? "Falha ao redefinir senha.");
        return;
      }

      setSuccess(true);
    } catch {
      toast.error("Falha ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6">
          <div className="mx-auto w-full max-w-md">
            <Card className="border-black/10">
              <CardHeader>
                <CardTitle className="text-2xl font-black tracking-tight">
                  Link inválido
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-black/60">
                  Este link de redefinição de senha é inválido ou está
                  incompleto. Solicite um novo link.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-black/10"
                >
                  <Link href="/esqueci-senha">
                    <ArrowLeft className="mr-2 size-4" />
                    Solicitar novo link
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6">
          <div className="mx-auto w-full max-w-md">
            <Card className="border-black/10">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-black text-white">
                  <CheckCircle2 className="size-6" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">
                  Senha redefinida
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-black/60">
                  Sua senha foi alterada com sucesso. Agora você pode entrar com
                  a nova senha.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-black text-white hover:bg-zinc-800"
                >
                  <Link href="/login">Ir para o login</Link>
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
                Nova senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={onSubmit}>
                <p className="text-sm text-black/60">
                  Escolha uma nova senha para sua conta.
                </p>

                <div className="grid gap-2">
                  <Label htmlFor="password">Nova senha</Label>
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
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
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
                  {loading ? "Redefinindo..." : "Redefinir senha"}
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

export default function RedefinirSenhaPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-sm text-black/50">Carregando...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </React.Suspense>
  );
}
