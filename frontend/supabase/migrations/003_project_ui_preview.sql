-- UI-recreation field, alongside `diagram`.
--
-- Run once in the Supabase SQL editor on an existing project.
--
-- `ui_preview` names a React component in src/components/interfaces/,
-- registered in that folder's index.jsx and rendered above the `diagram`
-- Shape section — a live, interactive rebuild of a project's own frontend,
-- not a screenshot. Same reasoning as `diagram`: kept out of the sanitised
-- body so it can be interactive and read the site's theme tokens directly.

alter table public.projects add column if not exists ui_preview text not null default '';
