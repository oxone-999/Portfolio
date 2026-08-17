-- Skill categories.
--
-- Run once in the Supabase SQL editor on an existing project.
--
-- The stack is grouped by *kind of technology* — languages, frameworks,
-- datastores, tooling — so the About page reads as a categorised plate rather
-- than one undifferentiated wall of logos.
--
-- Named `skill_group` rather than `group` because GROUP is a reserved word in
-- SQL; an unquoted `group` column is a parse error waiting to happen in every
-- hand-written query against this table.
--
-- Empty string means uncategorised, which renders in a trailing "Other" band
-- rather than disappearing — an unsorted skill should be visibly unsorted.

alter table public.skills add column if not exists skill_group text not null default '';
