/**
 * The lens is a route, not a piece of UI state.
 *
 * `/`    -> systems lens (SDE)      -- the default landing
 * `/3d`  -> craft lens (3D)
 *
 * Making it a route is what lets each identity be linked, shared and
 * previewed independently. The Redux `identity` slice still mirrors it,
 * because the admin portal keys its editors off the same value.
 */

export const SYSTEMS = 'SDE';
export const CRAFT = '3D';

/** Route prefix for a lens. Systems lives at the root. */
export function lensBase(lens) {
  return lens === CRAFT ? '/3d' : '';
}

/** Build an in-lens path: href(CRAFT, '/work') -> '/3d/work' */
export function href(lens, path = '') {
  const base = lensBase(lens);
  if (!path || path === '/') return base || '/';
  return `${base}${path}`;
}

/** Read the lens out of a pathname. */
export function lensFromPath(pathname) {
  return pathname === '/3d' || pathname.startsWith('/3d/') ? CRAFT : SYSTEMS;
}

/**
 * Swap lenses while staying on the equivalent page where one exists.
 * Case-study URLs are lens-specific, so those fall back to the work index.
 */
export function counterpartPath(pathname) {
  const lens = lensFromPath(pathname);
  const rest = lens === CRAFT ? pathname.slice(3) || '/' : pathname;
  const target = lens === CRAFT ? SYSTEMS : CRAFT;
  const isCaseStudy = /^\/work\/[^/]+/.test(rest);
  return href(target, isCaseStudy ? '/work' : rest);
}

/** Stable, readable slug for case-study routes. */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function findProjectBySlug(projects, slug) {
  return (projects || []).find((project) => slugify(project.name) === slug);
}

export const LENS_COPY = {
  [SYSTEMS]: {
    label: 'Systems',
    eyebrow: 'Data & distributed systems',
    title: 'Anuj Verma — Data & Distributed Systems Engineer',
    workLabel: 'Work',
    workBlurb:
      'Pipelines, platforms and the operator tooling that makes them legible. Each entry is a full case study, not a card.',
  },
  [CRAFT]: {
    label: '3D',
    eyebrow: '3D & real-time art',
    title: 'Anuj Verma — 3D & Real-Time Art',
    workLabel: 'Gallery',
    workBlurb:
      'Game-ready assets built with the constraint decided before the first sculpt. Still growing — breakdowns land as I shoot them.',
  },
};
