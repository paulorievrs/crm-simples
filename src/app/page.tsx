import {
  Sparkles,
  ArrowRight,
  MousePointer2,
  Users2,
  LayoutDashboard,
  Globe,
  Lock,
  Zap,
  CheckCircle2,
  Plus
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

import Link from "next/link";

// turbo
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Minimal Grid Background Effect */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-black text-white shadow-lg shadow-black/20">
              <Sparkles className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">SaaS CRM</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a
              className="transition-colors hover:text-black/60"
              href="#recursos"
            >
              Recursos
            </a>
            <a
              className="transition-colors hover:text-black/60"
              href="#como-funciona"
            >
              Como funciona
            </a>
            <a className="transition-colors hover:text-black/60" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="text-sm font-medium hover:bg-black/5"
            >
              <Link href="/login">Entrar</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-black px-6 text-white hover:bg-black/90"
            >
              <Link href="/register">Começar agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center text-center">
              <Badge
                variant="outline"
                className="mb-6 border-black/10 bg-black/5 py-1 px-4 text-xs font-semibold tracking-wide backdrop-blur-sm"
              >
                <Zap className="mr-2 size-3 fill-black" />
                V1.0 DISPONÍVEL AGORA
              </Badge>
              <h1 className="max-w-4xl text-balance text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
                O CRM que não{" "}
                <span className="text-black/40 italic">atrapalha</span> seu dia.
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg text-black/60 sm:text-xl">
                Gerencie seu funil com uma interface minimalista. Foco no que
                importa:
                <span className="font-semibold text-black">
                  {" "}
                  fechar negócios
                </span>
                , não preencher formulários infinitos.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-14 rounded-full bg-black px-8 text-lg font-bold text-white transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar conta grátis
                  <ArrowRight className="ml-2 size-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-black/10 px-8 text-lg font-bold hover:bg-black/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ver pipeline
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Logos */}
        <section className="border-y border-black/5 bg-zinc-50/50 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-8">
              Empresas que confiam na nossa simplicidade
            </p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale filter transition-all hover:grayscale-0">
              {[
                "Empresa A",
                "Logo B",
                "SaaS Corp",
                "Acme Inc",
                "Startup X"
              ].map((logo) => (
                <span
                  key={logo}
                  className="text-xl font-black italic tracking-tighter text-black"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="recursos" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tudo em uma única tela.
              </h2>
              <p className="mt-4 text-black/60">
                Design pensado para performance e clareza visual.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
              {/* Dashboard Preview - Main Bento Item */}
              <Card className="relative overflow-hidden border-black/5 bg-zinc-50 md:col-span-8 md:row-span-2 group">
                <div className="absolute inset-0 bg-linear-to-br from-white/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                    <LayoutDashboard className="size-3" />
                    Interface de Controle
                  </div>
                  <CardTitle className="text-3xl font-black tracking-tight">
                    Dashboard Executivo
                  </CardTitle>
                  <CardDescription className="text-base">
                    Visão em tempo real da saúde do seu pipeline comercial.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      { label: "Receita", val: "R$ 42k", sub: "+12%" },
                      { label: "Leads", val: "248", sub: "+5%" },
                      { label: "Conversão", val: "18%", sub: "-2%" },
                      { label: "Tickets", val: "14", sub: "Estável" }
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-black/10"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                          {stat.label}
                        </div>
                        <div className="mt-1 text-2xl font-black tracking-tight">
                          {stat.val}
                        </div>
                        <div
                          className={`text-[10px] font-bold mt-1 ${stat.sub.startsWith("+") ? "text-emerald-600" : stat.sub.startsWith("-") ? "text-rose-600" : "text-black/40"}`}
                        >
                          {stat.sub}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl transition-transform group-hover:scale-[1.01]">
                    <div className="flex items-center justify-between border-b border-black/5 bg-zinc-50 px-6 py-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-black/40">
                        Performance de Vendas
                      </div>
                      <div className="flex gap-1">
                        <div className="size-2 rounded-full bg-black/10" />
                        <div className="size-2 rounded-full bg-black/10" />
                        <div className="size-2 rounded-full bg-black/10" />
                      </div>
                    </div>
                    <div className="flex h-56 items-end gap-2 p-8">
                      {[60, 85, 45, 90, 65, 30, 75, 55, 95, 40, 70, 50].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-lg bg-zinc-100 transition-all hover:bg-black group/bar relative"
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-bold">
                              {h}%
                            </div>
                            <div
                              className="w-full bg-black/5 rounded-t-lg"
                              style={{ height: `${h}%` }}
                            />
                            <div
                              className="w-full bg-black rounded-t-lg absolute bottom-0 left-0 scale-y-0 origin-bottom transition-transform duration-500 group-hover/bar:scale-y-100"
                              style={{ height: `${h}%` }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pipeline Kanban Bento Item */}
              <Card className="border-black/5 bg-zinc-50 md:col-span-4 overflow-hidden group flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                    <Plus className="size-3" />
                    Fluxo Dinâmico
                  </div>
                  <CardTitle className="text-2xl font-black">
                    Pipeline Ágil
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    {[
                      { label: "Novo Lead", count: 12, color: "bg-zinc-200" },
                      { label: "Qualificação", count: 8, color: "bg-zinc-400" },
                      { label: "Proposta", count: 5, color: "bg-black" }
                    ].map((step, i) => (
                      <div
                        key={i}
                        className="group/item flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black tracking-tight">
                            {step.label}
                          </span>
                          <span className="text-[10px] font-bold text-black/40">
                            {step.count} cards
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${step.color} transition-all duration-1000 origin-left scale-x-0 group-hover/item:scale-x-100`}
                            style={{ width: `${(step.count / 15) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-black/5">
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest leading-relaxed">
                      Aumente sua conversão em até 30% com etapas claras.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Bento Item */}
              <Card className="border-black/5 bg-white md:col-span-4 flex flex-col justify-between group hover:bg-black transition-colors duration-500">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 group-hover:text-white/40">
                    <Lock className="size-3" />
                    Segurança
                  </div>
                  <CardTitle className="text-2xl font-black group-hover:text-white">
                    Dados
                    <br />
                    Protegidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="group-hover:text-white/80 transition-colors">
                  <p className="text-sm font-medium leading-relaxed">
                    Criptografia militar e conformidade total com a LGPD.
                  </p>
                  <div className="mt-4 flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="size-1 rounded-full bg-black/20 group-hover:bg-white/20"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Collaboration Bento Item */}
              <Card className="border-black/5 bg-zinc-50 md:col-span-4 flex flex-col justify-between group">
                <CardHeader>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                    <Users2 className="size-3" />
                    Colaboração
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">
                    Time
                    <br />
                    Alinhado
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block size-10 rounded-full border-2 border-white bg-zinc-200 transition-transform group-hover:translate-x-1"
                        style={{ zIndex: 5 - i }}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-black text-black/60 bg-white border border-black/5 px-3 py-1.5 rounded-full shadow-sm">
                    +12 membros
                  </div>
                </CardContent>
              </Card>

              {/* Global Bento Item */}
              <Card className="border-black/10 bg-black md:col-span-4 flex flex-col justify-between text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-32 bg-white/10 blur-3xl -translate-y-16 translate-x-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                <CardHeader>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    <Globe className="size-3" />
                    Acesso Global
                  </div>
                  <CardTitle className="text-2xl font-black">
                    Cloud
                    <br />
                    Native
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/60 font-medium leading-relaxed">
                    Disponível em qualquer lugar, 24/7.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                    Sincronização Real-time
                    <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="como-funciona" className="bg-black py-24 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  O fluxo de trabalho perfeito.
                </h2>
                <p className="mt-6 text-lg text-white/60">
                  Desenhamos o processo para que você gaste menos de 10 minutos
                  por dia atualizando seus negócios.
                </p>
                <div className="mt-12 space-y-8">
                  {[
                    {
                      title: "Entrada Ágil",
                      desc: "Cadastre um lead em menos de 15 segundos com campos inteligentes."
                    },
                    {
                      title: "Mover & Ganhar",
                      desc: "O pipeline é intuitivo. Arraste e veja os números atualizarem."
                    },
                    {
                      title: "Dashboard Automático",
                      desc: "Relatórios prontos sem precisar configurar nada."
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <p className="text-white/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-white/5 blur-2xl" />
                <div className="relative rounded-2xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
                    <MousePointer2 className="size-4 text-white/40" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                      Visualização do Pipeline
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="h-2 w-20 rounded bg-white/10" />
                      <div className="h-24 rounded-xl bg-white/5 border border-white/5" />
                      <div className="h-24 rounded-xl bg-white/5 border border-white/5" />
                    </div>
                    <div className="space-y-3 translate-y-8">
                      <div className="h-2 w-20 rounded bg-white/10" />
                      <div className="h-24 rounded-xl border-2 border-dashed border-white/10" />
                      <div className="h-24 rounded-xl bg-white text-black p-4">
                        <div className="h-2 w-12 rounded bg-black/10 mb-2" />
                        <div className="h-3 w-full rounded bg-black/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precos" className="py-24 bg-zinc-50/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Preço justo e transparente.
              </h2>
              <p className="mt-4 text-black/60">
                Comece grátis e evolua conforme sua equipe cresce.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "R$ 0",
                  features: [
                    "1 Pipeline",
                    "Até 100 leads",
                    "Suporte por e-mail"
                  ],
                  button: "Começar Grátis",
                  variant: "outline"
                },
                {
                  name: "Pro",
                  price: "R$ 99",
                  features: [
                    "1 Pipeline Master",
                    "Leads ilimitados",
                    "Dashboard avançado",
                    "Suporte prioritário"
                  ],
                  button: "Assinar Agora",
                  variant: "default",
                  tag: "Popular"
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  features: [
                    "Múltiplos usuários",
                    "API access",
                    "SSO",
                    "Gerente de conta"
                  ],
                  button: "Falar com vendas",
                  variant: "outline"
                }
              ].map((plan, i) => (
                <Card
                  key={i}
                  className={`relative border-black/5 bg-white flex flex-col justify-between transition-all hover:border-black/10 hover:shadow-xl ${plan.tag ? "ring-2 ring-black" : ""}`}
                >
                  {plan.tag && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {plan.tag}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-black/40 text-sm">/mês</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {plan.features.map((feature, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-3 text-sm text-black/60"
                        >
                          <CheckCircle2 className="size-4 text-black shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button
                      className="w-full rounded-full"
                      variant={plan.variant as "default" | "outline"}
                    >
                      {plan.button}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 border-t border-black/5">
          <div className="mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold tracking-tight">
                Dúvidas comuns
              </h2>
              <p className="mt-4 text-black/60 text-lg">
                Transparência total sobre nossa ferramenta e como podemos ajudar
                seu negócio.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-zinc-50 border border-black/5">
                <p className="text-sm font-medium">Ainda tem dúvidas?</p>
                <p className="text-sm text-black/60 mt-1">
                  Nossa equipe de suporte responde em menos de 2 horas.
                </p>
                <Button
                  variant="link"
                  className="px-0 mt-4 text-black font-bold"
                >
                  Falar com especialista <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    q: "Posso criar mais de um pipeline?",
                    a: "Para manter a simplicidade absoluta, focamos em um pipeline mestre altamente eficiente. Isso evita a fragmentação de dados da sua equipe e garante que todos sigam o mesmo processo comercial."
                  },
                  {
                    q: "É seguro manter meus leads aqui?",
                    a: "Sim, utilizamos criptografia de ponta a ponta e backups diários em servidores isolados para garantir a privacidade total e conformidade com a LGPD."
                  },
                  {
                    q: "Existe uma versão mobile?",
                    a: "Nossa interface é 100% responsiva. Você pode acessar do celular com a mesma experiência do desktop, sem precisar baixar nenhum app adicional."
                  },
                  {
                    q: "Como funciona a importação de dados?",
                    a: "Você pode importar seus leads via CSV em segundos. Nosso sistema mapeia automaticamente os campos para você não perder tempo."
                  }
                ].map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${faq.q}`}
                    className="border-black/5 px-4 rounded-xl transition-colors hover:bg-zinc-50"
                  >
                    <AccordionTrigger className="text-left text-lg font-bold hover:no-underline py-6">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-black/60 pb-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-[3rem] bg-black px-8 py-20 text-center text-white">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-white/5 blur-[120px]" />

              <h2 className="relative z-10 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Foque em vender, <br />
                não em gerenciar.
              </h2>
              <p className="relative z-10 mt-8 mx-auto max-w-xl text-lg text-white/60">
                Junte-se a centenas de empresas que escolheram a simplicidade
                sobre a burocracia comercial.
              </p>
              <div className="relative z-10 mt-12 flex flex-col items-center gap-6">
                <Button
                  size="lg"
                  className="h-16 rounded-full bg-white px-10 text-xl font-bold text-black transition-transform hover:scale-105"
                >
                  Começar Agora — É Grátis
                </Button>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  NÃO É NECESSÁRIO CARTÃO DE CRÉDITO
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-black text-white">
                <Sparkles className="size-4" />
              </div>
              <span className="font-bold tracking-tight">SaaS CRM</span>
            </div>

            <div className="flex gap-8 text-sm font-medium text-black/40">
              <a href="#" className="transition-colors hover:text-black">
                Termos
              </a>
              <a href="#" className="transition-colors hover:text-black">
                Privacidade
              </a>
              <a href="#" className="transition-colors hover:text-black">
                Segurança
              </a>
            </div>

            <div className="text-sm text-black/40">
              © {new Date().getFullYear()} CRM Simples Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
