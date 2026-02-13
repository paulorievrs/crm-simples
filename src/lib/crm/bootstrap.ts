import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { TABLES } from "@/lib/supabase/tables";

type PostgrestErrorLike = {
  code?: string;
  message?: string;
};

export type Pipeline = {
  id: string;
  name: string;
};

export type Stage = {
  id: string;
  name: string;
  position: number;
  pipeline_id: string;
};

export type Deal = {
  id: string;
  title: string;
  value: number | null;
  stage_id: string;
  pipeline_id: string;
  created_at: string;
  updated_at: string;
};

const DEFAULT_PIPELINE_NAME = "Pipeline";
const DEFAULT_STAGES = ["Novo", "Qualificação", "Proposta", "Ganho", "Perdido"];

export async function ensureUserPipeline() {
  const supabase = getSupabaseBrowserClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  const { data: pipelineRow, error: pipelineError } = await supabase
    .from(TABLES.pipelines)
    .select("id,name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (pipelineError) {
    const err = pipelineError as unknown as PostgrestErrorLike;
    if (err.code === "PGRST205") {
      throw new Error(
        "Missing database tables. Run supabase/schema.sql in the Supabase SQL Editor (then wait a few seconds for schema cache)."
      );
    }
    throw pipelineError;
  }

  let pipeline: Pipeline | null = pipelineRow as Pipeline | null;

  if (!pipeline) {
    const { data: created, error: createError } = await supabase
      .from(TABLES.pipelines)
      .insert({ user_id: user.id, name: DEFAULT_PIPELINE_NAME })
      .select("id,name")
      .single();

    if (createError) throw createError;
    pipeline = created as Pipeline;

    const pipelineId = pipeline.id;

    const stagesToInsert = DEFAULT_STAGES.map((name, index) => ({
      user_id: user.id,
      pipeline_id: pipelineId,
      name,
      position: index
    }));

    const { error: stagesError } = await supabase
      .from(TABLES.stages)
      .insert(stagesToInsert);
    if (stagesError) throw stagesError;
  }

  if (!pipeline) {
    throw new Error("Failed to create or fetch pipeline");
  }

  const { data: stagesRows, error: stagesFetchError } = await supabase
    .from(TABLES.stages)
    .select("id,name,position,pipeline_id")
    .eq("user_id", user.id)
    .eq("pipeline_id", pipeline.id)
    .order("position", { ascending: true });

  if (stagesFetchError) throw stagesFetchError;

  const stages = (stagesRows ?? []) as Stage[];

  if (stages.length === 0) {
    const stagesToInsert = DEFAULT_STAGES.map((name, index) => ({
      user_id: user.id,
      pipeline_id: pipeline.id,
      name,
      position: index
    }));

    const { error: stagesError } = await supabase
      .from(TABLES.stages)
      .insert(stagesToInsert);
    if (stagesError) throw stagesError;

    const { data: refetched, error: refetchError } = await supabase
      .from(TABLES.stages)
      .select("id,name,position,pipeline_id")
      .eq("user_id", user.id)
      .eq("pipeline_id", pipeline.id)
      .order("position", { ascending: true });

    if (refetchError) throw refetchError;
    return { user, pipeline, stages: (refetched ?? []) as Stage[] };
  }

  return { user, pipeline, stages };
}
