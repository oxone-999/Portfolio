import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Page, Section, Tag, Eyebrow } from './Plate';
import Reveal from './motion/Reveal';
import { StaggerItem } from './motion/StaggerList';
import { href, slugify, LENS_COPY, statusTone } from '../utils/lens';
import { useLens } from '../hooks/useLens';
import { EASE } from '../utils/motionVariants';

export default function Work() {
  const lens = useLens();
  const reduced = useReducedMotion();
  const projects = useSelector(
    (state) => state.admin.content.projects?.[lens] || [],
  );
  const copy = LENS_COPY[lens];
  const [filter, setFilter] = useState('All');
  const [archiveOpen, setArchiveOpen] = useState(false);

  /* Archived work shipped, but isn't front-line — a separate, muted section
     rather than a silent deletion. Everything below filters and counts off
     the active list, so an archived project can't distort them. */
  const active = useMemo(
    () => projects.filter((p) => p.status !== 'Archived'),
    [projects],
  );
  const archived = useMemo(
    () => projects.filter((p) => p.status === 'Archived'),
    [projects],
  );

  /* Filters come from the data, so they can never drift out of sync with it. */
  const tools = useMemo(() => {
    const counts = new Map();
    active.forEach((p) =>
      (p.skills || []).forEach((s) => counts.set(s, (counts.get(s) || 0) + 1)),
    );
    return [...counts.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name]) => name);
  }, [active]);

  const visible = useMemo(
    () =>
      filter === 'All'
        ? active
        : active.filter((p) => (p.skills || []).includes(filter)),
    [active, filter],
  );

  return (
    <Page>
      <Reveal as="header">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="mb-4 text-[clamp(34px,5.6vw,56px)] leading-[1.02]">
          {copy.workLabel}
        </h1>
        <p className="max-w-[58ch] text-[17px] text-ink-2">{copy.workBlurb}</p>
      </Reveal>

      <Section
        label={`${visible.length} / ${active.length}`}
        note="Filters are derived from the project data, so they never drift."
      >
        {tools.length > 0 ? (
          <div className="mb-7 flex flex-wrap gap-x-1 gap-y-1.5">
            {['All', ...tools].map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => setFilter(tool)}
                aria-pressed={filter === tool}
                className={`relative isolate border px-2.5 py-1 font-data text-[10px] uppercase tracking-[0.08em] transition-colors ${
                  filter === tool
                    ? 'border-ch text-paper'
                    : 'border-rule text-ink-3 hover:border-ink-3 hover:text-ink'
                }`}
              >
                {/* One shared layoutId, so the active pill slides from the old
                    filter to the new one instead of the colour snapping.

                    `isolate` on the button and z-0/z-10 here rather than a
                    negative z-index: the button is `relative` with z-index
                    auto, so it creates no stacking context of its own, and a
                    -z-10 child paints behind the nearest ancestor that does —
                    which is the opaque `bg-paper` wrapper in App.jsx. That hid
                    the pill entirely and left the label paper-on-paper, i.e.
                    invisible. */}
                {filter === tool && !reduced ? (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 z-0 bg-ch"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
                {filter === tool && reduced ? (
                  <span className="absolute inset-0 z-0 bg-ch" />
                ) : null}
                <span className="relative z-10">{tool}</span>
              </button>
            ))}
          </div>
        ) : null}

        {visible.length > 0 ? (
          /* Keyed on the *unfiltered* id set — not `visible`, which changes on
             every filter click and would remount the whole list instead of
             letting AnimatePresence transition it. This key changes only when
             bundled content is replaced by the Supabase rows (project ids go
             from slugs to database ids), which is exactly when it needs to
             remount: AnimatePresence otherwise processes that swap as every
             row exiting and a same-shaped set of rows entering at once, and
             confirmed empirically (not merely suspected) that some rows landed
             stuck at a low opacity out of that overlap and never recovered —
             see the finding in the motion-implementation review this fixes. */
          <ul key={active.map((p) => p.id).join('|')} className="border-t border-rule">
            <AnimatePresence initial={false}>
              {visible.map((project) => (
                <StaggerItem
                  key={project.id}
                  as="li"
                  layout={!reduced}
                  className="border-b border-rule-soft"
                  initial={reduced ? false : 'hidden'}
                  animate={reduced ? undefined : 'visible'}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <motion.div whileHover={reduced ? undefined : { x: 6 }} transition={{ duration: 0.18 }}>
                    <Link
                      to={href(lens, `/work/${slugify(project.name)}`)}
                      className="group grid gap-2 py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline md:gap-8"
                    >
                      <div className="min-w-0">
                        <h2 className="mb-1.5 text-[21px] leading-tight text-ink transition-colors group-hover:text-ch">
                          {project.name}
                        </h2>
                        <p className="max-w-[64ch] text-[15px] text-ink-2">
                          {project.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 font-data text-[10px] uppercase tracking-[0.06em] text-ink-3">
                          {(project.skills || []).map((s) => (
                            <span key={s}>{s}</span>
                          ))}
                        </div>
                      </div>
                      <Tag tone={statusTone(project.status)}>{project.status}</Tag>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="border border-rule bg-paper-2 p-5 text-[14.5px] text-ink-2">
            Nothing matches <span className="text-ink">{filter}</span> in this
            lens.{' '}
            <button
              type="button"
              onClick={() => setFilter('All')}
              className="border-b border-ch text-ch"
            >
              Clear the filter
            </button>
            .
          </p>
        )}
      </Section>

      {archived.length > 0 ? (
        <Section
          label="Archive"
          note="Shipped, but not front-line — kept reachable rather than deleted."
        >
          <button
            type="button"
            onClick={() => setArchiveOpen((open) => !open)}
            aria-expanded={archiveOpen}
            className="flex w-full items-center justify-between border border-rule px-4 py-3 text-left font-data text-[11px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:border-ink-3 hover:text-ink"
          >
            <span>
              {archiveOpen ? 'Hide' : 'Show'} {archived.length} archived{' '}
              {archived.length === 1 ? 'project' : 'projects'}
            </span>
            <span aria-hidden="true">{archiveOpen ? '−' : '+'}</span>
          </button>

          <AnimatePresence initial={false}>
            {archiveOpen ? (
              <motion.div
                key="archive-list"
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE }}
                className="overflow-hidden"
              >
                <ul className="mt-4 border-t border-rule opacity-70">
                  {archived.map((project) => (
                    <li key={project.id} className="border-b border-rule-soft">
                      <Link
                        to={href(lens, `/work/${slugify(project.name)}`)}
                        className="group grid gap-2 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline md:gap-8"
                      >
                        <div className="min-w-0">
                          <h3 className="mb-1 text-[17px] leading-tight text-ink transition-colors group-hover:text-ch">
                            {project.name}
                          </h3>
                          <p className="max-w-[64ch] text-[14px] text-ink-2">
                            {project.description}
                          </p>
                        </div>
                        <Tag tone="neutral">{project.status}</Tag>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Section>
      ) : null}
    </Page>
  );
}
