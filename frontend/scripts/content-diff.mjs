#!/usr/bin/env node
/**
 * Shows exactly what would change on the live site if you pushed
 * content/portfolio.json right now. Read-only — touches nothing.
 *
 *   npm run content:diff
 *
 * Exit code 0 = no changes, 1 = changes pending, 2 = validation failed.
 */
import {
  loadContent,
  validateContent,
  toRows,
  diffRows,
  printDiffSection,
  color as C,
} from './lib/content.mjs';
import { fullReadClient, fetchLiveRows, hasWriteCredentials } from './lib/supabaseAdmin.mjs';

const content = loadContent();

const errors = validateContent(content);
if (errors.length) {
  console.error(`${C.red}${C.bold}content/portfolio.json is invalid:${C.reset}`);
  errors.forEach((e) => console.error(`  ${C.red}• ${e}${C.reset}`));
  process.exit(2);
}

const local = toRows(content);
const client = await fullReadClient();
const live = await fetchLiveRows(client);

console.log(`${C.bold}Pending content changes${C.reset}`);
console.log(`${C.dim}local: content/portfolio.json  →  live: Supabase${C.reset}\n`);

if (live.logTableMissing) {
  console.log(
    `${C.yellow}The log table does not exist yet.${C.reset} ` +
      `Run ${C.cyan}supabase/migrations/001_add_log.sql${C.reset} in the Supabase SQL editor.\n`,
  );
} else if (!hasWriteCredentials && (content.log || []).length > 0) {
  console.log(
    `${C.yellow}No write credentials — reading with the anon key, which can only see ` +
      `published log entries.${C.reset}\n${C.dim}Private drafts will look missing. Add ` +
      `SUPABASE_ADMIN_EMAIL/PASSWORD to .env.local for an accurate log diff.${C.reset}\n`,
  );
}

let total = 0;

total += printDiffSection(
  'PROJECTS',
  diffRows(
    live.projects,
    local.projects,
    (r) => `${r.lens} / ${r.name}`,
    ['status', 'description', 'skills', 'content', 'overview', 'hld', 'lld', 'diagram', 'ui_preview', 'metrics', 'sort_order'],
  ),
);

total += printDiffSection(
  'SKILLS',
  diffRows(live.skills, local.skills, (r) => `${r.lens} / ${r.name}`, [
    'url',
    'skill_group',
    'sort_order',
  ]),
);

total += printDiffSection(
  'JOURNEY',
  diffRows(live.journey, local.journey, (r) => r.title, [
    'type',
    'type_label',
    'organization',
    'duration',
    'logo',
    'sort_order',
  ]),
);

if (!live.logTableMissing) {
  total += printDiffSection(
    'LOG',
    diffRows(
      live.log,
      local.log,
      (r) => `${r.entry_date} ${r.title}`,
      ['kind', 'source_kind', 'lens', 'project_slug', 'body', 'url', 'tags'],
    ),
  );

  // Promotion is the one change that alters public visibility, so call it out
  // separately rather than leaving it buried as a `kind` field change.
  const liveByKey = new Map(live.log.map((r) => [`${r.entry_date} ${r.title}`, r]));
  const promoted = local.log.filter((r) => {
    const prev = liveByKey.get(`${r.entry_date} ${r.title}`);
    return prev && prev.kind !== 'shipped' && r.kind === 'shipped';
  });
  const unpublished = local.log.filter((r) => {
    const prev = liveByKey.get(`${r.entry_date} ${r.title}`);
    return prev && prev.kind === 'shipped' && r.kind !== 'shipped';
  });
  const newPublic = local.log.filter(
    (r) => r.kind === 'shipped' && !liveByKey.has(`${r.entry_date} ${r.title}`),
  );

  if (promoted.length || unpublished.length || newPublic.length) {
    console.log(`${C.bold}VISIBILITY${C.reset}`);
    [...promoted, ...newPublic].forEach((r) =>
      console.log(`  ${C.green}→ BECOMES PUBLIC   ${r.entry_date} ${r.title}${C.reset}`),
    );
    unpublished.forEach((r) =>
      console.log(`  ${C.yellow}← BECOMES PRIVATE  ${r.entry_date} ${r.title}${C.reset}`),
    );
    console.log('');
  }
}

if (total === 0) {
  console.log(`${C.green}Live site already matches content/portfolio.json.${C.reset}`);
  process.exit(0);
}

console.log(
  `${C.bold}${total} change${total === 1 ? '' : 's'} pending.${C.reset} ` +
    `Run ${C.cyan}npm run content:push${C.reset} to apply.`,
);
process.exit(1);
