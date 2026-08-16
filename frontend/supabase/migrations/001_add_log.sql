-- Working log: a private lab notebook that becomes public proof on promotion.
--
-- Run this once in the Supabase SQL editor on an existing project.
-- (schema.sql already contains it for fresh projects.)
--
-- Visibility model:
--   kind = 'learning' | 'read' | 'note'  -> PRIVATE. Drafts, visible only to you.
--   kind = 'shipped'                     -> PUBLIC. Appears on /log.
--
-- Promotion flips kind to 'shipped'; source_kind remembers where it came from.

create extension if not exists pgcrypto;

create table if not exists public.log (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  kind text not null default 'note'
    check (kind in ('shipped', 'learning', 'read', 'note')),
  -- Where the entry started, kept after promotion so the public log can
  -- distinguish "shipped from a read" vs "shipped from a build".
  source_kind text not null default 'note'
    check (source_kind in ('shipped', 'learning', 'read', 'note')),
  lens text not null default 'SDE' check (lens in ('SDE', '3D')),
  project_slug text not null default '',
  title text not null,
  body text not null default '',
  url text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists log_date_idx on public.log (entry_date desc);
create index if not exists log_kind_idx on public.log (kind);

drop trigger if exists log_set_updated_at on public.log;
create trigger log_set_updated_at
  before update on public.log
  for each row execute function public.set_updated_at();

alter table public.log enable row level security;

-- SECURITY: anon may read ONLY promoted entries. Drafts are not merely hidden
-- in the UI — they are unreadable through the public API, which is the part
-- that actually matters. Never widen this to `using (true)`.
drop policy if exists "Public read shipped only" on public.log;
create policy "Public read shipped only" on public.log
  for select
  using (kind = 'shipped');

drop policy if exists "Authenticated read all" on public.log;
create policy "Authenticated read all" on public.log
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated write" on public.log;
create policy "Authenticated write" on public.log
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
