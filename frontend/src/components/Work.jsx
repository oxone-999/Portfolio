import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Section, Tag, Eyebrow } from './Plate';
import { href, slugify, LENS_COPY } from '../utils/lens';
import { useLens } from '../hooks/useLens';

export default function Work() {
  const lens = useLens();
  const projects = useSelector(
    (state) => state.admin.content.projects?.[lens] || [],
  );
  const copy = LENS_COPY[lens];
  const [filter, setFilter] = useState('All');

  /* Filters come from the data, so they can never drift out of sync with it. */
  const tools = useMemo(() => {
    const counts = new Map();
    projects.forEach((p) =>
      (p.skills || []).forEach((s) => counts.set(s, (counts.get(s) || 0) + 1)),
    );
    return [...counts.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name]) => name);
  }, [projects]);

  const visible = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((p) => (p.skills || []).includes(filter)),
    [projects, filter],
  );

  return (
    <Page>
      <header>
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="mb-4 text-[clamp(34px,5.6vw,56px)] leading-[1.02]">
          {copy.workLabel}
        </h1>
        <p className="max-w-[58ch] text-[17px] text-ink-2">{copy.workBlurb}</p>
      </header>

      <Section
        label={`${visible.length} / ${projects.length}`}
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
                className={`border px-2.5 py-1 font-data text-[10px] uppercase tracking-[0.08em] transition-colors ${
                  filter === tool
                    ? 'border-ch bg-ch text-paper'
                    : 'border-rule text-ink-3 hover:border-ink-3 hover:text-ink'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        ) : null}

        {visible.length > 0 ? (
          <ul className="border-t border-rule">
            {visible.map((project) => (
              <li key={project.id} className="border-b border-rule-soft">
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
                  <Tag tone={project.status === 'In Progress' ? 'active' : 'done'}>
                    {project.status}
                  </Tag>
                </Link>
              </li>
            ))}
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
    </Page>
  );
}
