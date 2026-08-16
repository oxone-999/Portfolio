import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Section, Tag, Eyebrow } from './Plate';
import { href, slugify } from '../utils/lens';
import { useLens } from '../hooks/useLens';

/**
 * The public working log.
 *
 * Only `shipped` entries ever reach here — drafts are filtered server-side by
 * RLS. Every entry is a dated, past-tense record of something that happened,
 * so the page cannot go stale: if Anuj stops writing, it simply shows less
 * rather than showing an out-of-date claim.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
}

/** Reads as a lab notebook: what it came from, not what's claimed. */
const ORIGIN_LABEL = {
  read: 'From a read',
  learning: 'From learning',
  note: 'Note',
  shipped: 'Shipped',
};

export default function Log() {
  const lens = useLens();
  const entries = useSelector((state) => state.admin.content.log || []);
  const projects = useSelector((state) => state.admin.content.projects?.[lens] || []);
  const [tag, setTag] = useState('All');

  const projectNames = useMemo(
    () => new Map(projects.map((p) => [slugify(p.name), p.name])),
    [projects],
  );

  const forLens = useMemo(
    () => entries.filter((e) => e.kind === 'shipped' && (e.lens || 'SDE') === lens),
    [entries, lens],
  );

  const tags = useMemo(() => {
    const counts = new Map();
    forLens.forEach((e) => (e.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name);
  }, [forLens]);

  const visible = useMemo(
    () => (tag === 'All' ? forLens : forLens.filter((e) => (e.tags || []).includes(tag))),
    [forLens, tag],
  );

  return (
    <Page>
      <header>
        <Eyebrow>Working log</Eyebrow>
        <h1 className="mb-4 text-[clamp(34px,5.6vw,56px)] leading-[1.02]">Log</h1>
        <p className="max-w-[58ch] text-[17px] text-ink-2">
          Dated notes on what I built, changed and measured. Written after the
          fact, not before — each entry is a record, not a plan.
        </p>
      </header>

      <Section
        label={`${visible.length} ${visible.length === 1 ? 'entry' : 'entries'}`}
        note="Newest first. Tags come from the entries themselves."
      >
        {tags.length > 0 ? (
          <div className="mb-7 flex flex-wrap gap-x-1 gap-y-1.5">
            {['All', ...tags].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                aria-pressed={tag === t}
                className={`border px-2.5 py-1 font-data text-[10px] uppercase tracking-[0.08em] transition-colors ${
                  tag === t
                    ? 'border-ch bg-ch text-paper'
                    : 'border-rule text-ink-3 hover:border-ink-3 hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}

        {visible.length > 0 ? (
          <ol className="border-t border-rule">
            {visible.map((entry) => (
              <li
                key={entry.id}
                className="grid gap-2 border-b border-rule-soft py-6 md:grid-cols-[104px_minmax(0,1fr)] md:gap-7"
              >
                <time
                  dateTime={entry.date}
                  className="font-data text-[11px] tracking-wide text-ch tabular-nums"
                >
                  {formatDate(entry.date)}
                </time>

                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-[19px] leading-snug text-ink">{entry.title}</h2>
                    {entry.sourceKind && entry.sourceKind !== 'shipped' ? (
                      <Tag tone="neutral">{ORIGIN_LABEL[entry.sourceKind]}</Tag>
                    ) : null}
                  </div>

                  {entry.body ? (
                    <p className="max-w-[64ch] whitespace-pre-line text-[15px] text-ink-2">
                      {entry.body}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-data text-[10px] uppercase tracking-[0.06em] text-ink-3">
                    {entry.project && projectNames.has(entry.project) ? (
                      <Link
                        to={href(lens, `/work/${entry.project}`)}
                        className="text-ch transition-colors hover:underline"
                      >
                        {projectNames.get(entry.project)}
                      </Link>
                    ) : null}
                    {(entry.tags || []).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ch transition-colors hover:underline"
                      >
                        Source ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="border border-rule bg-paper-2 p-5 text-[14.5px] text-ink-2">
            {forLens.length === 0
              ? 'No entries published in this lens yet.'
              : `Nothing tagged ${tag}.`}{' '}
            {forLens.length > 0 ? (
              <button type="button" onClick={() => setTag('All')} className="border-b border-ch text-ch">
                Clear the filter
              </button>
            ) : null}
          </p>
        )}
      </Section>
    </Page>
  );
}
