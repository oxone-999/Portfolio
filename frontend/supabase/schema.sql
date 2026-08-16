-- Signal Plate content schema.
--
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query),
-- then run seed.sql to populate it from the bundled asset data.
--
-- Public visitors read through the anon key (RLS: select is open to everyone).
-- Writes require an authenticated session — create your admin user under
-- Authentication -> Users -> Add user, then log in at /control-room/... .
-- There is no client-side signup flow; provisioning the admin account is a
-- Supabase-dashboard action, deliberately, so the write path can't be self-served.

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  lens text not null check (lens in ('SDE', '3D')),
  name text not null,
  status text not null default 'Completed',
  description text not null default '',
  content text not null default '',
  skills text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  lens text not null check (lens in ('SDE', '3D')),
  name text not null,
  url text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.journey (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'milestone',
  type_label text not null default 'Milestone',
  title text not null,
  organization text not null default '',
  duration text not null default '',
  logo text not null default '',
  sort_order integer not null default 0
);

-- Working log: a private lab notebook that becomes public proof on promotion.
--   kind = 'learning' | 'read' | 'note'  -> PRIVATE draft, visible only to you
--   kind = 'shipped'                     -> PUBLIC, appears on /log
-- source_kind remembers where a promoted entry came from.
create table if not exists public.log (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  kind text not null default 'note'
    check (kind in ('shipped', 'learning', 'read', 'note')),
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

create index if not exists projects_lens_sort_idx on public.projects (lens, sort_order);
create index if not exists skills_lens_sort_idx on public.skills (lens, sort_order);
create index if not exists journey_sort_idx on public.journey (sort_order);
create index if not exists log_date_idx on public.log (entry_date desc);
create index if not exists log_kind_idx on public.log (kind);

-- updated_at housekeeping on projects, the only table with meaningful edits.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists log_set_updated_at on public.log;
create trigger log_set_updated_at
  before update on public.log
  for each row execute function public.set_updated_at();

-- RLS: anyone can read (the public site), only a signed-in session can write
-- (the admin portal). One admin account is all this needs — see the note above.
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.journey enable row level security;
alter table public.log enable row level security;

drop policy if exists "Public read" on public.projects;
create policy "Public read" on public.projects for select using (true);
drop policy if exists "Authenticated write" on public.projects;
create policy "Authenticated write" on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public read" on public.skills;
create policy "Public read" on public.skills for select using (true);
drop policy if exists "Authenticated write" on public.skills;
create policy "Authenticated write" on public.skills for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- SECURITY: the log is the one table where anon must NOT see everything.
-- Drafts are unreadable through the public API, not merely hidden in the UI.
-- Never widen this to `using (true)`.
drop policy if exists "Public read shipped only" on public.log;
create policy "Public read shipped only" on public.log
  for select using (kind = 'shipped');
drop policy if exists "Authenticated read all" on public.log;
create policy "Authenticated read all" on public.log
  for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated write" on public.log;
create policy "Authenticated write" on public.log for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public read" on public.journey;
create policy "Public read" on public.journey for select using (true);
drop policy if exists "Authenticated write" on public.journey;
create policy "Authenticated write" on public.journey for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
