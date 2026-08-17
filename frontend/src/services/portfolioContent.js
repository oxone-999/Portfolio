import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { defaultProjects, defaultSkills, defaultJourney, defaultLog } from '../content';

/**
 * Reads and writes go straight to Supabase — there is no local cache layer.
 * Row counts here are small (tens of records), so a full refetch after every
 * mutation is simpler and safer than reconciling optimistic local state, and
 * it means what the admin sees is always exactly what the DB has.
 */

export function bundledDefaultContent() {
  const clone = (v) => JSON.parse(JSON.stringify(v));
  return {
    projects: clone(defaultProjects),
    skills: clone(defaultSkills),
    journey: clone(defaultJourney),
    log: clone(defaultLog),
  };
}

function rowToProject(row) {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    description: row.description,
    content: row.content,
    overview: row.overview || '',
    hld: row.hld || '',
    lld: row.lld || '',
    diagram: row.diagram || '',
    uiPreview: row.ui_preview || '',
    metrics: row.metrics || [],
    skills: row.skills || [],
  };
}

function rowToSkill(row) {
  return { id: row.id, name: row.name, url: row.url, group: row.skill_group || '' };
}

function rowToJourney(row) {
  return {
    id: row.id,
    type: row.type,
    typeLabel: row.type_label,
    title: row.title,
    organization: row.organization,
    duration: row.duration,
    logo: row.logo,
  };
}

function rowToLog(row) {
  return {
    id: row.id,
    date: row.entry_date,
    kind: row.kind,
    sourceKind: row.source_kind,
    lens: row.lens,
    project: row.project_slug || '',
    title: row.title,
    body: row.body || '',
    url: row.url || '',
    tags: row.tags || [],
  };
}

export async function fetchPortfolioContent() {
  if (!isSupabaseConfigured) return bundledDefaultContent();

  const [projectsRes, skillsRes, journeyRes, logRes] = await Promise.all([
    supabase.from('projects').select('*').order('lens').order('sort_order'),
    supabase.from('skills').select('*').order('lens').order('sort_order'),
    supabase.from('journey').select('*').order('sort_order'),
    // RLS returns only `kind = 'shipped'` to anon, and everything to a signed-in
    // admin. Drafts are filtered server-side, not here.
    supabase.from('log').select('*').order('entry_date', { ascending: false }),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (skillsRes.error) throw skillsRes.error;
  if (journeyRes.error) throw journeyRes.error;
  // A project that hasn't run the log migration yet should still render, and
  // should fall back to the bundled entries rather than showing an empty log.
  const logMissing = Boolean(logRes.error);
  if (logMissing) console.warn('Log table unavailable:', logRes.error.message);

  const group = (rows, mapRow) =>
    rows.reduce(
      (acc, row) => {
        const lens = row.lens === '3D' ? '3D' : 'SDE';
        acc[lens].push(mapRow(row));
        return acc;
      },
      { SDE: [], '3D': [] },
    );

  return {
    projects: group(projectsRes.data, rowToProject),
    skills: group(skillsRes.data, rowToSkill),
    journey: journeyRes.data.map(rowToJourney),
    log: logMissing ? JSON.parse(JSON.stringify(defaultLog)) : logRes.data.map(rowToLog),
  };
}

export async function saveLogEntry({ id, date, kind, sourceKind, lens, project, title, body, url, tags }) {
  const row = {
    entry_date: date,
    kind,
    source_kind: sourceKind || kind,
    lens: lens || 'SDE',
    project_slug: project || '',
    title,
    body: body || '',
    url: url || '',
    tags: tags || [],
  };

  if (id) {
    const { error } = await supabase.from('log').update(row).eq('id', id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('log').insert(row);
  if (error) throw error;
}

export async function deleteLogEntry(id) {
  const { error } = await supabase.from('log').delete().eq('id', id);
  if (error) throw error;
}

/** Promotion is the moment a private draft becomes public. */
export async function promoteLogEntry(id) {
  const { error } = await supabase.from('log').update({ kind: 'shipped' }).eq('id', id);
  if (error) throw error;
}

async function nextSortOrder(table, filter) {
  let query = supabase.from(table).select('sort_order').order('sort_order', { ascending: false }).limit(1);
  if (filter) query = query.eq('lens', filter);
  const { data, error } = await query;
  if (error) throw error;
  return (data[0]?.sort_order ?? -1) + 1;
}

export async function saveProject({ id, mode, name, status, description, content, skills }) {
  if (id) {
    const { error } = await supabase
      .from('projects')
      .update({ name, status, description, content, skills })
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const sort_order = await nextSortOrder('projects', mode);
  const { error } = await supabase
    .from('projects')
    .insert({ lens: mode, name, status, description, content, skills, sort_order });
  if (error) throw error;
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function saveSkill({ id, mode, name, url }) {
  if (id) {
    const { error } = await supabase.from('skills').update({ name, url }).eq('id', id);
    if (error) throw error;
    return;
  }

  const sort_order = await nextSortOrder('skills', mode);
  const { error } = await supabase.from('skills').insert({ lens: mode, name, url, sort_order });
  if (error) throw error;
}

export async function deleteSkill(id) {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

export async function saveJourneyEntry({ id, type, typeLabel, title, organization, duration, logo }) {
  const row = { type, type_label: typeLabel, title, organization, duration, logo };

  if (id) {
    const { error } = await supabase.from('journey').update(row).eq('id', id);
    if (error) throw error;
    return;
  }

  const sort_order = await nextSortOrder('journey');
  const { error } = await supabase.from('journey').insert({ ...row, sort_order });
  if (error) throw error;
}

export async function deleteJourneyEntry(id) {
  const { error } = await supabase.from('journey').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Wipes and reseeds the live tables from the asset files bundled in this
 * build. Destructive for every visitor, not just this browser — the admin
 * portal gates it behind an explicit, strongly-worded confirmation.
 */
export async function reseedFromBundledDefaults() {
  const defaults = bundledDefaultContent();

  const { error: delProjects } = await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delProjects) throw delProjects;
  const { error: delSkills } = await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delSkills) throw delSkills;
  const { error: delJourney } = await supabase.from('journey').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delJourney) throw delJourney;

  const projectRows = [
    ...defaults.projects.SDE.map((p, i) => ({
      lens: 'SDE',
      name: p.name,
      status: p.status,
      description: p.description,
      content: p.content,
      skills: p.skills,
      sort_order: i,
    })),
    ...defaults.projects['3D'].map((p, i) => ({
      lens: '3D',
      name: p.name,
      status: p.status,
      description: p.description,
      content: p.content,
      skills: p.skills,
      sort_order: i,
    })),
  ];
  const { error: insProjects } = await supabase.from('projects').insert(projectRows);
  if (insProjects) throw insProjects;

  const skillRows = [
    ...defaults.skills.SDE.map((s, i) => ({
      lens: 'SDE',
      name: s.name,
      url: s.url,
      skill_group: s.group || '',
      sort_order: i,
    })),
    ...defaults.skills['3D'].map((s, i) => ({
      lens: '3D',
      name: s.name,
      url: s.url,
      skill_group: s.group || '',
      sort_order: i,
    })),
  ];
  const { error: insSkills } = await supabase.from('skills').insert(skillRows);
  if (insSkills) throw insSkills;

  const journeyRows = defaults.journey.map((j, i) => ({
    type: j.type,
    type_label: j.typeLabel,
    title: j.title,
    organization: j.organization,
    duration: j.duration,
    logo: j.logo,
    sort_order: i,
  }));
  const { error: insJourney } = await supabase.from('journey').insert(journeyRows);
  if (insJourney) throw insJourney;
}
