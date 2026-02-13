create extension if not exists pgcrypto;

create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists pipelines_user_id_idx on public.pipelines(user_id);

create table if not exists public.stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position integer not null,
  created_at timestamptz not null default now()
);

create index if not exists stages_pipeline_id_idx on public.stages(pipeline_id);
create index if not exists stages_user_id_idx on public.stages(user_id);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  stage_id uuid not null references public.stages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  value numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deals_pipeline_id_idx on public.deals(pipeline_id);
create index if not exists deals_stage_id_idx on public.deals(stage_id);
create index if not exists deals_user_id_idx on public.deals(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists deals_set_updated_at on public.deals;
create trigger deals_set_updated_at
before update on public.deals
for each row
execute function public.set_updated_at();

alter table public.pipelines enable row level security;
alter table public.stages enable row level security;
alter table public.deals enable row level security;

drop policy if exists "pipelines_select" on public.pipelines;
create policy "pipelines_select" on public.pipelines
for select
using (auth.uid() = user_id);

drop policy if exists "pipelines_insert" on public.pipelines;
create policy "pipelines_insert" on public.pipelines
for insert
with check (auth.uid() = user_id);

drop policy if exists "pipelines_update" on public.pipelines;
create policy "pipelines_update" on public.pipelines
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "pipelines_delete" on public.pipelines;
create policy "pipelines_delete" on public.pipelines
for delete
using (auth.uid() = user_id);

drop policy if exists "stages_select" on public.stages;
create policy "stages_select" on public.stages
for select
using (auth.uid() = user_id);

drop policy if exists "stages_insert" on public.stages;
create policy "stages_insert" on public.stages
for insert
with check (auth.uid() = user_id);

drop policy if exists "stages_update" on public.stages;
create policy "stages_update" on public.stages
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "stages_delete" on public.stages;
create policy "stages_delete" on public.stages
for delete
using (auth.uid() = user_id);

drop policy if exists "deals_select" on public.deals;
create policy "deals_select" on public.deals
for select
using (auth.uid() = user_id);

drop policy if exists "deals_insert" on public.deals;
create policy "deals_insert" on public.deals
for insert
with check (auth.uid() = user_id);

drop policy if exists "deals_update" on public.deals;
create policy "deals_update" on public.deals
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "deals_delete" on public.deals;
create policy "deals_delete" on public.deals
for delete
using (auth.uid() = user_id);

-- ============================================================
-- profiles (Stripe integration)
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  stripe_customer_id text unique,
  subscription_status text not null default 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_stripe_customer_id_idx on public.profiles(stripe_customer_id);
create index if not exists profiles_email_idx on public.profiles(email);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_service_role_all" on public.profiles;
create policy "profiles_service_role_all" on public.profiles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- ============================================================
-- password_reset_tokens (forgot password flow)
-- ============================================================

create table if not exists public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists prt_token_idx on public.password_reset_tokens(token);
create index if not exists prt_user_id_idx on public.password_reset_tokens(user_id);

alter table public.password_reset_tokens enable row level security;

drop policy if exists "prt_service_role_all" on public.password_reset_tokens;
create policy "prt_service_role_all" on public.password_reset_tokens
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
