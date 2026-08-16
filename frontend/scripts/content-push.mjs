#!/usr/bin/env node
/**
 * Applies content/portfolio.json to Supabase — this is what makes a change
 * visible to visitors.
 *
 *   npm run content:push          shows the diff, then asks to confirm
 *   npm run content:push -- --yes skips the prompt (for scripted use)
 *
 * Deliberately prints the diff first and requires confirmation, because the
 * write is immediate and public. Sort order is rewritten wholesale so the
 * live ordering always matches the JSON.
 */
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import {
  loadContent,
  validateContent,
  toRows,
  diffRows,
  printDiffSection,
  color as C,
} from './lib/content.mjs';
import { fullReadClient, writeClient, fetchLiveRows } from './lib/supabaseAdmin.mjs';

const autoYes = process.argv.includes('--yes') || process.argv.includes('-y');

const content = loadContent();

const errors = validateContent(content);
if (errors.length) {
  console.error(`${C.red}${C.bold}content/portfolio.json is invalid — nothing was pushed:${C.reset}`);
  errors.forEach((e) => console.error(`  ${C.red}• ${e}${C.reset}`));
  process.exit(2);
}

const local = toRows(content);
const live = await fetchLiveRows(await fullReadClient());

console.log(`${C.bold}About to change the live site${C.reset}\n`);

let total = 0;
total += printDiffSection(
  'PROJECTS',
  diffRows(live.projects, local.projects, (r) => `${r.lens} / ${r.name}`, [
    'status',
    'description',
    'skills',
    'content',
    'sort_order',
  ]),
);
total += printDiffSection(
  'SKILLS',
  diffRows(live.skills, local.skills, (r) => `${r.lens} / ${r.name}`, ['url', 'sort_order']),
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
    diffRows(live.log, local.log, (r) => `${r.entry_date} ${r.title}`, [
      'kind',
      'source_kind',
      'lens',
      'project_slug',
      'body',
      'url',
      'tags',
    ]),
  );

  // Anything crossing into public view gets its own callout before the prompt.
  const liveByKey = new Map(live.log.map((r) => [`${r.entry_date} ${r.title}`, r]));
  const becomingPublic = local.log.filter((r) => {
    if (r.kind !== 'shipped') return false;
    const prev = liveByKey.get(`${r.entry_date} ${r.title}`);
    return !prev || prev.kind !== 'shipped';
  });
  if (becomingPublic.length) {
    console.log(`${C.bold}${C.green}These log entries become PUBLIC:${C.reset}`);
    becomingPublic.forEach((r) => console.log(`  ${C.green}• ${r.entry_date} ${r.title}${C.reset}`));
    console.log('');
  }
} else {
  console.log(
    `${C.yellow}Skipping log — table not found. Run supabase/migrations/001_add_log.sql first.${C.reset}\n`,
  );
}

if (total === 0) {
  console.log(`${C.green}Nothing to push — live already matches.${C.reset}`);
  process.exit(0);
}

if (!autoYes) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(
    `\n${C.bold}Apply these ${total} change(s) to the live site? ${C.reset}(yes/no) `,
  );
  rl.close();
  if (answer.trim().toLowerCase() !== 'yes') {
    console.log(`${C.yellow}Aborted. Nothing was written.${C.reset}`);
    process.exit(0);
  }
}

const db = await writeClient();
const NIL = '00000000-0000-0000-0000-000000000000';

/**
 * Replace-in-place per table. These tables are tens of rows and are keyed by
 * generated UUIDs the JSON doesn't track, so a clean replace is both simpler
 * and less error-prone than trying to reconcile identities. The diff above is
 * what makes it safe to do.
 */
async function replaceTable(table, rows) {
  const { error: delError } = await db.from(table).delete().neq('id', NIL);
  if (delError) throw new Error(`Clearing ${table} failed: ${delError.message}`);

  if (rows.length === 0) return;
  const { error: insError } = await db.from(table).insert(rows);
  if (insError) throw new Error(`Inserting into ${table} failed: ${insError.message}`);
}

try {
  await replaceTable('projects', local.projects);
  await replaceTable('skills', local.skills);
  await replaceTable('journey', local.journey);
  if (!live.logTableMissing) await replaceTable('log', local.log);
} catch (error) {
  console.error(`\n${C.red}${C.bold}Push failed.${C.reset} ${error.message}`);
  console.error(
    `${C.yellow}The live site may be partially updated. Re-run the push once the cause is fixed.${C.reset}`,
  );
  process.exit(1);
}

// Read back and confirm the live state now matches, rather than assuming.
const after = await fetchLiveRows(await fullReadClient());
const mismatch =
  after.projects.length !== local.projects.length ||
  after.skills.length !== local.skills.length ||
  after.journey.length !== local.journey.length ||
  (!live.logTableMissing && after.log.length !== local.log.length);

if (mismatch) {
  console.error(`${C.red}Post-push verification failed — row counts do not match.${C.reset}`);
  console.error(
    `  projects ${after.projects.length}/${local.projects.length}, ` +
      `skills ${after.skills.length}/${local.skills.length}, ` +
      `journey ${after.journey.length}/${local.journey.length}, ` +
      `log ${after.log.length}/${local.log.length}`,
  );
  process.exit(1);
}

const publicLog = after.log.filter((r) => r.kind === 'shipped').length;
const privateLog = after.log.length - publicLog;

console.log(
  `\n${C.green}${C.bold}Pushed.${C.reset} ` +
    `${after.projects.length} projects, ${after.skills.length} skills, ` +
    `${after.journey.length} journey entries, ` +
    `${after.log.length} log entries (${publicLog} public, ${privateLog} private).`,
);
