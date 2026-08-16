/**
 * Shared helpers for the content pipeline.
 *
 * content/portfolio.json is the source of truth. Everything else —
 * the bundled fallback, the Supabase tables, the resume — is derived
 * from it, so there is exactly one place to edit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(here, '..', '..');
export const CONTENT_PATH = path.join(ROOT, 'content', 'portfolio.json');

export const LENSES = ['SDE', '3D'];

/**
 * Log entry kinds.
 *
 * Only `shipped` is public. `learning`, `read` and `note` are private drafts —
 * a lab notebook. Promotion flips kind to `shipped` and the entry goes live,
 * with `sourceKind` remembering where it came from.
 *
 * Nothing public is a standing claim: the public log is entirely past-tense
 * dated records, so it cannot go stale if Anuj stops writing for a while.
 */
export const LOG_KINDS = ['shipped', 'learning', 'read', 'note'];
export const PUBLIC_LOG_KINDS = ['shipped'];

export const isPublicLogKind = (kind) => PUBLIC_LOG_KINDS.includes(kind);

export function loadContent() {
  const raw = fs.readFileSync(CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

export function saveContent(content) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2) + '\n', 'utf8');
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Collapse CRLF to LF.
 *
 * On Windows the same HTML reaches the database with \r\n (pasted through
 * the SQL editor) but sits in the JSON with \n. The two are identical as
 * markup, so without this every diff reports phantom changes on every
 * project, forever. Normalising both sides — and writing LF on push — keeps
 * the diff honest.
 */
export function normalizeText(value) {
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n') : value;
}

/** Fails loudly on the mistakes that would otherwise reach the live site. */
export function validateContent(content) {
  const errors = [];

  if (!content.profile?.name) errors.push('profile.name is required.');

  for (const lens of LENSES) {
    const projects = content.projects?.[lens];
    if (!Array.isArray(projects)) {
      errors.push(`projects.${lens} must be an array.`);
      continue;
    }

    const seen = new Set();
    projects.forEach((p, i) => {
      const at = `projects.${lens}[${i}]`;
      if (!p.name) errors.push(`${at}.name is required.`);
      if (!p.slug) errors.push(`${at}.slug is required.`);
      if (p.slug && p.slug !== slugify(p.name)) {
        errors.push(`${at}.slug "${p.slug}" does not match its name "${p.name}" (expected "${slugify(p.name)}").`);
      }
      if (seen.has(p.slug)) errors.push(`${at}.slug "${p.slug}" is duplicated — case-study URLs would collide.`);
      seen.add(p.slug);
      if (!p.description) errors.push(`${at}.description is required — it is the card copy on /work.`);
      if (p.status && !['Completed', 'In Progress'].includes(p.status)) {
        errors.push(`${at}.status must be "Completed" or "In Progress", got "${p.status}".`);
      }
      if (!Array.isArray(p.skills)) errors.push(`${at}.skills must be an array.`);
      if (p.metrics && !Array.isArray(p.metrics)) errors.push(`${at}.metrics must be an array.`);
      (p.metrics || []).forEach((m, mi) => {
        if (!m.label) errors.push(`${at}.metrics[${mi}].label is required.`);
      });
    });

    const skills = content.skills?.[lens];
    if (!Array.isArray(skills)) errors.push(`skills.${lens} must be an array.`);
    else
      skills.forEach((s, i) => {
        if (!s.name) errors.push(`skills.${lens}[${i}].name is required.`);
      });
  }

  if (!Array.isArray(content.journey)) errors.push('journey must be an array.');

  if (content.log !== undefined) {
    if (!Array.isArray(content.log)) {
      errors.push('log must be an array.');
    } else {
      const knownSlugs = new Set(
        LENSES.flatMap((lens) => (content.projects?.[lens] || []).map((p) => p.slug)),
      );
      const today = new Date().toISOString().slice(0, 10);

      content.log.forEach((e, i) => {
        const at = `log[${i}]`;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date || '')) {
          errors.push(`${at}.date must be YYYY-MM-DD, got "${e.date}".`);
        } else if (e.date > today) {
          errors.push(`${at}.date "${e.date}" is in the future.`);
        }
        if (!e.title) errors.push(`${at}.title is required.`);
        if (!LOG_KINDS.includes(e.kind)) {
          errors.push(`${at}.kind must be one of ${LOG_KINDS.join(' | ')}, got "${e.kind}".`);
        }
        if (e.sourceKind && !LOG_KINDS.includes(e.sourceKind)) {
          errors.push(`${at}.sourceKind must be one of ${LOG_KINDS.join(' | ')}.`);
        }
        if (e.lens && !LENSES.includes(e.lens)) {
          errors.push(`${at}.lens must be SDE or 3D, got "${e.lens}".`);
        }
        // A dangling slug would render a log entry linking to a 404.
        if (e.project && !knownSlugs.has(e.project)) {
          errors.push(`${at}.project "${e.project}" does not match any project slug.`);
        }
        if (e.tags && !Array.isArray(e.tags)) errors.push(`${at}.tags must be an array.`);
      });
    }
  }

  return errors;
}

/** Flatten to the row shapes the Supabase tables use. */
export function toRows(content) {
  const projects = [];
  const skills = [];

  for (const lens of LENSES) {
    (content.projects?.[lens] || []).forEach((p, i) => {
      projects.push({
        lens,
        name: p.name,
        status: p.status || 'Completed',
        description: normalizeText(p.description || ''),
        content: normalizeText(p.content || ''),
        skills: p.skills || [],
        sort_order: i,
      });
    });
    (content.skills?.[lens] || []).forEach((s, i) => {
      skills.push({ lens, name: s.name, url: s.url || '', sort_order: i });
    });
  }

  const journey = (content.journey || []).map((j, i) => ({
    type: j.type || 'milestone',
    type_label: j.typeLabel || 'Milestone',
    title: j.title,
    organization: j.organization || '',
    duration: j.duration || '',
    logo: j.logo || '',
    sort_order: i,
  }));

  const log = (content.log || []).map((e) => ({
    entry_date: e.date,
    kind: e.kind || 'note',
    source_kind: e.sourceKind || e.kind || 'note',
    lens: e.lens || 'SDE',
    project_slug: e.project || '',
    title: e.title,
    body: normalizeText(e.body || ''),
    url: e.url || '',
    tags: e.tags || [],
  }));

  return { projects, skills, journey, log };
}

/* ---------- diffing ---------- */

const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

export const color = C;

function truncate(value, n = 72) {
  const s = String(value ?? '').replace(/\s+/g, ' ').trim();
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

/**
 * Compares two row sets keyed by a stable identity, and reports
 * added / removed / changed with per-field before→after.
 */
export function diffRows(before, after, keyOf, fields) {
  const beforeMap = new Map(before.map((r) => [keyOf(r), r]));
  const afterMap = new Map(after.map((r) => [keyOf(r), r]));

  const added = [];
  const removed = [];
  const changed = [];

  for (const [key, row] of afterMap) {
    if (!beforeMap.has(key)) {
      added.push({ key, row });
      continue;
    }
    const prev = beforeMap.get(key);
    const fieldDiffs = [];
    for (const field of fields) {
      const a = JSON.stringify(prev[field] ?? '');
      const b = JSON.stringify(row[field] ?? '');
      if (a !== b) fieldDiffs.push({ field, from: prev[field], to: row[field] });
    }
    if (fieldDiffs.length) changed.push({ key, fieldDiffs });
  }

  for (const [key, row] of beforeMap) {
    if (!afterMap.has(key)) removed.push({ key, row });
  }

  return { added, removed, changed };
}

export function printDiffSection(title, diff) {
  const total = diff.added.length + diff.removed.length + diff.changed.length;
  if (total === 0) {
    console.log(`${C.dim}${title}: no changes${C.reset}`);
    return 0;
  }

  console.log(`${C.bold}${title}${C.reset}`);
  for (const { key } of diff.added) {
    console.log(`  ${C.green}+ ADDED    ${key}${C.reset}`);
  }
  for (const { key } of diff.removed) {
    console.log(`  ${C.red}- REMOVED  ${key}${C.reset}`);
  }
  for (const { key, fieldDiffs } of diff.changed) {
    console.log(`  ${C.yellow}~ CHANGED  ${key}${C.reset}`);
    for (const { field, from, to } of fieldDiffs) {
      console.log(`      ${C.cyan}${field}${C.reset}`);
      console.log(`        ${C.red}- ${truncate(Array.isArray(from) ? from.join(', ') : from)}${C.reset}`);
      console.log(`        ${C.green}+ ${truncate(Array.isArray(to) ? to.join(', ') : to)}${C.reset}`);
    }
  }
  console.log('');
  return total;
}
