import portfolio from '../../content/portfolio.json';

/**
 * The bundled fallback, derived from content/portfolio.json — the same file
 * the content scripts push to Supabase. One source of truth, so the offline
 * fallback can never drift from what visitors actually see.
 */

export const profile = portfolio.profile;
export const summary = portfolio.summary;
export const hero = portfolio.hero;

const toProject = (p) => ({
  id: p.slug,
  name: p.name,
  status: p.status,
  description: p.description,
  content: p.content,
  overview: p.overview || '',
  hld: p.hld || '',
  lld: p.lld || '',
  diagram: p.diagram || '',
  uiPreview: p.uiPreview || '',
  metrics: p.metrics || [],
  skills: p.skills,
});

export const defaultProjects = {
  SDE: portfolio.projects.SDE.map(toProject),
  '3D': portfolio.projects['3D'].map(toProject),
};

export const defaultSkills = {
  SDE: portfolio.skills.SDE.map((s, i) => ({
    id: `sde-${i}`,
    name: s.name,
    url: s.url,
    group: s.group || '',
  })),
  '3D': portfolio.skills['3D'].map((s, i) => ({
    id: `td-${i}`,
    name: s.name,
    url: s.url,
    group: s.group || '',
  })),
};

/**
 * Only `shipped` entries are public. The bundled fallback filters them the
 * same way RLS does server-side, so an offline render can never leak a draft.
 */
export const defaultLog = (portfolio.log || [])
  .filter((e) => e.kind === 'shipped')
  .map((e, i) => ({
    id: `log-${i}`,
    date: e.date,
    kind: e.kind,
    sourceKind: e.sourceKind || e.kind,
    lens: e.lens || 'SDE',
    project: e.project || '',
    title: e.title,
    body: e.body || '',
    url: e.url || '',
    tags: e.tags || [],
  }));

export const defaultJourney = portfolio.journey.map((j, i) => ({
  id: `journey-${i + 1}`,
  type: j.type,
  typeLabel: j.typeLabel,
  title: j.title,
  organization: j.organization,
  duration: j.duration,
  logo: j.logo,
}));

export default portfolio;
