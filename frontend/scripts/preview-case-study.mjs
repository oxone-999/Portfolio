#!/usr/bin/env node
/**
 * Renders a case study from content/portfolio.json to a standalone HTML file,
 * so it can be reviewed before pushing anything live.
 *
 *   npm run preview:case -- event-exchange-platform
 *
 * Writes public/_preview.html. Served by the dev server at /_preview.html.
 * The file is gitignored — it is a scratch artifact, not site content.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadContent, ROOT, LENSES } from './lib/content.mjs';

const slug = process.argv[2];
const content = loadContent();

const all = LENSES.flatMap((lens) =>
  (content.projects?.[lens] || []).map((p) => ({ ...p, lens })),
);

if (!slug) {
  console.log('Usage: npm run preview:case -- <slug>\n\nAvailable:');
  all.forEach((p) => console.log(`  ${p.slug.padEnd(38)} ${p.lens}  ${p.name}`));
  process.exit(1);
}

const project = all.find((p) => p.slug === slug);
if (!project) {
  console.error(`No project with slug "${slug}".`);
  all.forEach((p) => console.error(`  ${p.slug}`));
  process.exit(1);
}

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Layered body: overview / hld / lld render as separate rail-labeled
// sections, same as the real CaseStudy page. Legacy `content` is the
// fallback when a project predates layering.
const LAYER_META = [
  ['overview', 'Overview', 'What it is, for anyone.'],
  ['hld', 'Architecture', 'High-level design: shape, guarantees, failure behaviour.'],
  ['lld', 'Implementation', 'Low-level design: contracts and measurements.'],
];
const layers = LAYER_META.filter(([key]) => project[key]);

const diagramStub = project.diagram
  ? `<div class="diagram-stub"><b>◈ diagram:</b> ${esc(project.diagram)} — this is a live
     animated React component, not static markup. See it rendered at the real page:
     <code>npm run dev</code> (or <code>netlify dev</code>) → <code>/work/${esc(project.slug)}</code>.
     It cannot render inside this standalone preview file.</div>`
  : '';

const bodyHtml =
  layers.length > 0
    ? layers
        .map(
          ([key, label, note]) => `
    <div class="rail">${esc(label)}<span class="rail-note">${esc(note)}</span></div>
    <div class="prose">${project[key]}</div>`,
        )
        .join('\n')
    : `<div class="rail">Detail</div>
    <div class="prose">${project.content || '<p><em>No case study body yet.</em></p>'}</div>`;

const metrics = (project.metrics || [])
  .map((m) => {
    const unfilled = m.value === null || m.value === undefined || m.value === '';
    return `<div class="metric">
      <span class="fig ${unfilled ? 'slot' : ''}">${unfilled ? '——' : esc(m.value)}${
        !unfilled && m.unit ? `<i>${esc(m.unit)}</i>` : ''
      }</span>
      <span class="lbl">${esc(m.label)}</span>
      ${m.source ? `<span class="src">${esc(m.source)}</span>` : ''}
    </div>`;
  })
  .join('');

const html = `<!doctype html>
<html lang="en" data-lens="${project.lens === '3D' ? 'craft' : 'systems'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preview — ${esc(project.name)}</title>
<style>
  :root{
    --paper:#e8eae7; --paper-2:#f1f2f0; --paper-3:#dcdfdb;
    --ink:#14201e; --ink-2:#4a5654; --ink-3:#6e7a77;
    --rule:#c6cac6; --rule-soft:#d5d8d4; --ch:#0a6e68;
    --display:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
    --body:"Segoe UI Variable Text","Segoe UI",-apple-system,Arial,sans-serif;
    --data:"Cascadia Mono",Consolas,ui-monospace,monospace;
  }
  :root[data-lens="craft"]{ --ch:#8f5c18; }
  @media (prefers-color-scheme:dark){
    :root{ --paper:#0f1413; --paper-2:#161d1c; --paper-3:#1d2524;
      --ink:#e6eae8; --ink-2:#97a3a0; --ink-3:#737f7c;
      --rule:#2b3534; --rule-soft:#212927; --ch:#57cfc5; }
    :root[data-lens="craft"]{ --ch:#d9a25c; }
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);line-height:1.62}
  .banner{background:var(--ch);color:var(--paper);font-family:var(--data);font-size:11px;
    letter-spacing:.1em;text-transform:uppercase;padding:8px 24px;position:sticky;top:0;z-index:5}
  .wrap{max-width:1080px;margin:0 auto;padding:40px 24px 100px}
  h1{font-family:var(--display);font-size:clamp(32px,5.4vw,54px);line-height:1.02;
    letter-spacing:-.024em;margin:0 0 16px;font-weight:600}
  .lede{font-size:18px;color:var(--ink-2);max-width:58ch;margin:0 0 24px}
  .tags{display:flex;flex-wrap:wrap;gap:10px;border-top:1px solid var(--rule);padding-top:14px;
    font-family:var(--data);font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-3)}
  .metrics{display:grid;gap:1px;background:var(--rule);border:1px solid var(--rule);
    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin:26px 0}
  .metric{background:var(--paper-2);padding:15px 16px}
  .fig{font-family:var(--display);font-size:32px;font-weight:600;line-height:1;display:block;
    letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .fig i{font-family:var(--data);font-size:14px;font-style:normal;color:var(--ink-3);margin-left:2px}
  .fig.slot{color:var(--ink-3);border-bottom:2px dashed var(--ch);display:inline-block;padding-bottom:2px}
  .lbl{display:block;margin-top:8px;font-family:var(--data);font-size:9.5px;text-transform:uppercase;
    letter-spacing:.1em;color:var(--ink-3)}
  .src{display:block;margin-top:5px;font-family:var(--data);font-size:9.5px;color:var(--ch)}
  .rail{font-family:var(--data);font-size:10.5px;text-transform:uppercase;letter-spacing:.09em;
    color:var(--ch);border-top:1px solid var(--rule);padding-top:6px;margin:44px 0 14px}
  .rail-note{font-family:var(--data);font-size:10.5px;color:var(--ink-3);font-weight:normal;
    text-transform:none;letter-spacing:0;margin-left:10px}
  .diagram-stub{border:1px dashed var(--ch);background:var(--ch-fill,transparent);
    padding:16px 18px;font-family:var(--data);font-size:11.5px;color:var(--ink-2);margin:26px 0}
  .diagram-stub b{color:var(--ch)}

  /* mirrors .prose-plate in src/index.css so the preview matches the site */
  .prose{max-width:68ch;color:var(--ink-2);font-size:16.5px;line-height:1.68}
  .prose > * + *{margin-top:1.1em}
  .prose h2{font-family:var(--display);font-size:25px;line-height:1.2;color:var(--ink);
    margin-top:2.2em;padding-top:.6em;border-top:1px solid var(--rule)}
  .prose strong{color:var(--ink);font-weight:650}
  .prose em{font-style:italic;color:var(--ink)}
  .prose ul,.prose ol{padding-left:1.15em}
  .prose li{margin-top:.45em}
  .prose li::marker{color:var(--ch)}
  .prose code{font-family:var(--data);font-size:.87em;background:var(--paper-3);padding:1px 5px}
  .prose pre{background:var(--paper-2);border:1px solid var(--rule);padding:16px;overflow-x:auto;
    font-family:var(--data);font-size:12.5px;line-height:1.45;color:var(--ink)}
  .prose a{color:var(--ch)}
  .prose img{max-width:100%;height:auto;display:block;border:1px solid var(--rule)}
</style>
</head>
<body>
  <div class="banner">Preview · not published · content/portfolio.json</div>
  <div class="wrap">
    <h1>${esc(project.name)}</h1>
    <p class="lede">${esc(project.description)}</p>
    <div class="tags">${(project.skills || []).map((s) => `<span>${esc(s)}</span>`).join('')}</div>
    ${metrics ? `<div class="metrics">${metrics}</div>` : ''}
    ${diagramStub}
    ${bodyHtml}
  </div>
</body>
</html>
`;

const out = path.join(ROOT, 'public', '_preview.html');
fs.writeFileSync(out, html, 'utf8');
console.log(`Wrote public/_preview.html for "${project.name}"`);
console.log('Open: http://localhost:8888/_preview.html');
