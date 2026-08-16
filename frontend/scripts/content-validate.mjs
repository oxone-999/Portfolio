#!/usr/bin/env node
/**
 * Validates content/portfolio.json without touching the network.
 * Fast pre-flight before a diff or push.
 *
 *   npm run content:check
 */
import { loadContent, validateContent, color as C } from './lib/content.mjs';

const content = loadContent();
const errors = validateContent(content);

if (errors.length) {
  console.error(`${C.red}${C.bold}Invalid:${C.reset}`);
  errors.forEach((e) => console.error(`  ${C.red}• ${e}${C.reset}`));
  process.exit(1);
}

const log = content.log || [];
const byKind = (k) => log.filter((e) => e.kind === k).length;

const counts = {
  'projects SDE': content.projects.SDE.length,
  'projects 3D': content.projects['3D'].length,
  'skills SDE': content.skills.SDE.length,
  'skills 3D': content.skills['3D'].length,
  journey: content.journey.length,
  experience: content.experience?.length ?? 0,
  education: content.education?.length ?? 0,
};

console.log(`${C.green}${C.bold}Valid.${C.reset}`);
for (const [k, v] of Object.entries(counts)) {
  console.log(`  ${k.padEnd(14)} ${v}`);
}

if (log.length) {
  console.log(`\n${C.bold}Log${C.reset}  ${log.length} entries`);
  console.log(`  ${C.green}public (shipped)  ${byKind('shipped')}${C.reset}`);
  console.log(
    `  ${C.dim}private           ${byKind('learning') + byKind('read') + byKind('note')}` +
      ` (learning ${byKind('learning')}, read ${byKind('read')}, note ${byKind('note')})${C.reset}`,
  );
}

// Surface unmeasured metric slots — the direction refuses to fake evidence,
// so it should be easy to see what still needs a real number.
const empty = [];
for (const lens of ['SDE', '3D']) {
  for (const p of content.projects[lens]) {
    for (const m of p.metrics || []) {
      if (m.value === null || m.value === undefined || m.value === '') {
        empty.push(`${lens} / ${p.name} → ${m.label}`);
      }
    }
  }
}
if (empty.length) {
  console.log(`\n${C.yellow}Unfilled metric slots (${empty.length}):${C.reset}`);
  empty.forEach((e) => console.log(`  ${C.dim}${e}${C.reset}`));
}
