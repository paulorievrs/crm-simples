"use client";

import Link from "next/link";
import * as React from "react";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ensureUserPipeline, type Deal, type Stage } from "@/lib/crm/bootstrap";
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

function DealCard({
  deal,
  stages,
  onMove
}: {
  deal: Deal;
  stages: Stage[];
  onMove: (dealId: string, stageId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: deal.id,
      data: { currentStageId: deal.stage_id }
    });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: "transform 150ms ease",
    opacity: isDragging ? 0.6 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-black tracking-tight">{deal.title}</div>
          <div className="mt-1 text-xs text-black/50">
            {typeof deal.value === "number"
              ? formatCurrencyBRL(deal.value)
              : "Sem valor"}
          </div>
        </div>

        <button
          type="button"
          className="cursor-grab select-none rounded-full border border-black/10 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-black/40 hover:bg-black/5 active:cursor-grabbing"
          {...listeners}
          {...attributes}
          aria-label="Arrastar"
        >
          Drag
        </button>
      </div>

      <div className="mt-4">
        <Select value={deal.stage_id} onValueChange={(v) => onMove(deal.id, v)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stages.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function StageColumn({
  stage,
  count,
  children,
  onAdd
}: {
  stage: Stage;
  count: number;
  children: React.ReactNode;
  onAdd: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <Card
      ref={setNodeRef as unknown as React.Ref<HTMLDivElement>}
      className={`border-black/10 bg-zinc-50/40 transition-colors ${isOver ? "bg-black/5" : ""}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-black tracking-tight">
              {stage.name}
            </CardTitle>
            <CardDescription>{count} oportunidades</CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-full border-black/10 px-3"
            onClick={onAdd}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  );
}

export default function PipelinePage() {
  const [loading, setLoading] = React.useState(true);
  const [pipelineName, setPipelineName] = React.useState<string>("Pipeline");
  const [stages, setStages] = React.useState<Stage[]>([]);
  const [deals, setDeals] = React.useState<Deal[]>([]);

  const [openNewDeal, setOpenNewDeal] = React.useState(false);
  const [newDealTitle, setNewDealTitle] = React.useState("");
  const [newDealValue, setNewDealValue] = React.useState<string>("");
  const [newDealStageId, setNewDealStageId] = React.useState<string | null>(
    null
  );

  const pipelineIdRef = React.useRef<string | null>(null);
  const userIdRef = React.useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  );

  async function onDragEnd(event: DragEndEvent) {
    const activeId = event.active?.id;
    const overId = event.over?.id;

    if (!activeId || !overId) return;
    if (activeId === overId) return;

    const deal = deals.find((d) => d.id === String(activeId));
    if (!deal) return;

    const newStageId = String(overId);
    if (deal.stage_id === newStageId) return;

    await moveDeal(deal.id, newStageId);
  }

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

      userIdRef.current = user.id;

      const { pipeline, stages: s } = await ensureUserPipeline();
      pipelineIdRef.current = pipeline.id;
      setPipelineName(pipeline.name);
      setStages(s);

      const { data: dealsRows, error } = await supabase
        .from(TABLES.deals)
        .select("id,title,value,stage_id,pipeline_id,created_at,updated_at")
        .eq("user_id", user.id)
        .eq("pipeline_id", pipeline.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setDeals((dealsRows ?? []) as Deal[]);

      if (!newDealStageId && s.length > 0) {
        setNewDealStageId(s[0].id);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (message.includes("Missing database tables")) {
        toast.error(
          "Tabelas do CRM não encontradas no Supabase. Rode o arquivo supabase/schema.sql no SQL Editor e aguarde alguns segundos."
        );
      } else {
        toast.error("Falha ao carregar o pipeline.");
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createDeal() {
    const title = newDealTitle.trim();
    const stageId = newDealStageId;
    const pipelineId = pipelineIdRef.current;
    const userId = userIdRef.current;

    if (!title) {
      toast.error("Informe um título.");
      return;
    }

    if (!stageId || !pipelineId || !userId) {
      toast.error("Pipeline não carregado.");
      return;
    }

    const value = newDealValue.trim() ? Number(newDealValue.trim()) : null;
    if (newDealValue.trim() && Number.isNaN(value)) {
      toast.error("Valor inválido.");
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from(TABLES.deals).insert({
        user_id: userId,
        pipeline_id: pipelineId,
        stage_id: stageId,
        title,
        value
      });

      if (error) throw error;

      toast.success("Oportunidade criada.");
      setOpenNewDeal(false);
      setNewDealTitle("");
      setNewDealValue("");
      await load();
    } catch (e) {
      toast.error("Falha ao criar oportunidade.");
      console.error(e);
    }
  }

  async function moveDeal(dealId: string, stageId: string) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from(TABLES.deals)
        .update({ stage_id: stageId })
        .eq("id", dealId);

      if (error) throw error;

      setDeals((prev) =>
        prev.map((d) => (d.id === dealId ? { ...d, stage_id: stageId } : d))
      );
    } catch (e) {
      toast.error("Falha ao mover oportunidade.");
      console.error(e);
    }
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dealsByStage = React.useMemo(() => {
    const map = new Map<string, Deal[]>();
    for (const stage of stages) map.set(stage.id, []);
    for (const deal of deals) {
      const arr = map.get(deal.stage_id) ?? [];
      arr.push(deal);
      map.set(deal.stage_id, arr);
    }
    return map;
  }, [deals, stages]);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-full hover:bg-black/5"
            >
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <div className="text-sm font-black tracking-tight">
                {pipelineName}
              </div>
              <div className="text-xs text-black/50">Pipeline</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full border-black/10"
              onClick={() => void load()}
              disabled={loading}
            >
              <RefreshCw className="mr-2 size-4" />
              {loading ? "Carregando..." : "Atualizar"}
            </Button>

            <Dialog open={openNewDeal} onOpenChange={setOpenNewDeal}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-black text-white hover:bg-zinc-800">
                  <Plus className="mr-2 size-4" /> Nova oportunidade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova oportunidade</DialogTitle>
                  <DialogDescription>
                    Crie uma oportunidade e coloque na etapa correta.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newDealTitle}
                      onChange={(e) => setNewDealTitle(e.target.value)}
                      placeholder="Ex: ACME - Plano Pro"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="value">Valor (opcional)</Label>
                    <Input
                      id="value"
                      inputMode="numeric"
                      value={newDealValue}
                      onChange={(e) => setNewDealValue(e.target.value)}
                      placeholder="Ex: 5000"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Etapa</Label>
                    <Select
                      value={newDealStageId ?? undefined}
                      onValueChange={(v) => setNewDealStageId(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    className="rounded-full border-black/10"
                    onClick={() => setOpenNewDeal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="rounded-full bg-black text-white hover:bg-zinc-800"
                    onClick={() => void createDeal()}
                  >
                    Criar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight">Pipeline</h1>
          <p className="text-sm text-black/60">
            Mova oportunidades entre etapas usando o seletor.
          </p>
        </div>

        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="grid gap-4 md:grid-cols-5">
            {stages.map((stage) => {
              const list = dealsByStage.get(stage.id) ?? [];

              return (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  count={list.length}
                  onAdd={() => {
                    setNewDealStageId(stage.id);
                    setOpenNewDeal(true);
                  }}
                >
                  {list.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-black/10 bg-white p-3 text-xs text-black/50">
                      Arraste aqui ou clique em +
                    </div>
                  ) : (
                    list.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        stages={stages}
                        onMove={(dealId, stageId) =>
                          void moveDeal(dealId, stageId)
                        }
                      />
                    ))
                  )}
                </StageColumn>
              );
            })}
          </div>
        </DndContext>
      </main>
    </div>
  );
}
