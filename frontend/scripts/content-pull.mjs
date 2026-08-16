#!/usr/bin/env node
/**
 * Pulls live Supabase content back into content/portfolio.json.
 *
 * Use this after editing through the admin portal, so the JSON (and the
 * resume generated from it) doesn't fall behind the live site.
 *
 *   npm run content:pull
 *
 * Resume-only fields the database doesn't store — role, period, highlights,
 * metrics, links — are preserved from the existing JSON by slug.
 */
import { loadContent, saveContent, slugify, color as C } from './lib/content.mjs';
import { fullReadClient, fetchLiveRows } from './lib/supabaseAdmin.mjs';

const content = loadContent();
const live = await fetchLiveRows(await fullReadClient());

// Index existing entries so resume-only fields survive the round trip.
const existing = new Map();
for (const lens of ['SDE', '3D']) {
  for (const p of content.projects?.[lens] || []) existing.set(`${lens}/${p.slug}`, p);
}

const projects = { SDE: [], '3D': [] };
for (const row of live.projects) {
  const lens = row.lens === '3D' ? '3D' : 'SDE';
  const slug = slugify(row.name);
  const prev = existing.get(`${lens}/${slug}`) || {};
  projects[lens].push({
    slug,
    name: row.name,
    status: row.status,
    description: row.description,
    skills: row.skills || [],
    role: prev.role || '',
    org: prev.org || '',
    period: prev.period || '',
    highlights: prev.highlights || [],
    metrics: prev.metrics || [],
    links: prev.links || {},
    content: row.content || '',
  });
}

const skills = { SDE: [], '3D': [] };
for (const row of live.skills) {
  const lens = row.lens === '3D' ? '3D' : 'SDE';
  skills[lens].push({ name: row.name, url: row.url || '', group: '' });
}

const journey = live.journey.map((row) => ({
  type: row.type,
  typeLabel: row.type_label,
  title: row.title,
  organization: row.organization,
  duration: row.duration,
  logo: row.logo,
}));

const log = (live.log || []).map((row) => ({
  date: row.entry_date,
  kind: row.kind,
  sourceKind: row.source_kind,
  lens: row.lens,
  project: row.project_slug || '',
  title: row.title,
  body: row.body || '',
  url: row.url || '',
  tags: row.tags || [],
}));

const before = JSON.stringify({
  p: content.projects,
  s: content.skills,
  j: content.journey,
  l: content.log,
});
const after = JSON.stringify({ p: projects, s: skills, j: journey, l: log });

if (before === after) {
  console.log(`${C.green}content/portfolio.json already matches the live site.${C.reset}`);
  process.exit(0);
}

content.projects = projects;
content.skills = skills;
content.journey = journey;
if (!live.logTableMissing) content.log = log;
saveContent(content);

console.log(
  `${C.green}${C.bold}Pulled.${C.reset} content/portfolio.json updated from Supabase.\n` +
    `${C.dim}Review with: git diff -- content/portfolio.json${C.reset}`,
);
