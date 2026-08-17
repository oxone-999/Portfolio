-- Layered case studies.
--
-- Run once in the Supabase SQL editor on an existing project.
--
-- A case study is read at three depths:
--   overview — what it is, for anyone
--   hld      — architecture: shape, guarantees, failure behaviour
--   lld      — implementation: contracts and measurements
--
-- Layers render as bands on one scrolling page, not tabs: hidden depth is
-- depth nobody reads and search engines never index. A project carries only
-- the layers it has real material for.
--
-- `content` is kept as the pre-layer fallback so nothing breaks mid-migration.
-- `diagram` names a React component in src/components/diagrams/ rather than
-- holding markup, because the sanitiser strips <svg>.

alter table public.projects add column if not exists overview text not null default '';
alter table public.projects add column if not exists hld text not null default '';
alter table public.projects add column if not exists lld text not null default '';
alter table public.projects add column if not exists diagram text not null default '';

-- Hero metrics for the case study. jsonb array of
--   { label, value, unit, source }
-- A null `value` renders as a visibly unfilled slot rather than a fabricated
-- number — see Metric in src/components/Plate.jsx.
alter table public.projects add column if not exists metrics jsonb not null default '[]'::jsonb;
