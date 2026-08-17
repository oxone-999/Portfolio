import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Page, Section, Tag, Eyebrow, Metric, MetricRow } from './Plate';
import Diagram from './diagrams';
import InterfacePreview from './interfaces';
import DepthDeck from './DepthDeck';
import { href, slugify, findProjectBySlug, LENS_COPY } from '../utils/lens';
import { useLens } from '../hooks/useLens';

/**
 * A case study is a page, not a modal.
 *
 * That change is what makes the work linkable, shareable and indexable —
 * previously the strongest material on the site lived behind a click with no
 * URL of its own.
 */
export default function CaseStudy() {
  const lens = useLens();
  const { slug } = useParams();
  const projects = useSelector(
    (state) => state.admin.content.projects?.[lens] || [],
  );
  const logEntries = useSelector((state) => state.admin.content.log || []);
  const project = findProjectBySlug(projects, slug);
  const copy = LENS_COPY[lens];

  useEffect(() => {
    if (project) document.title = `${project.name} — Anuj Verma`;
  }, [project]);

  const index = projects.findIndex((p) => p === project);
  const next = index >= 0 ? projects[(index + 1) % projects.length] : null;

  // Published log entries for this project, giving the case study a history.
  const relatedLog = logEntries
    .filter((e) => e.kind === 'shipped' && e.project === slug)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  if (!project) {
    return (
      <Page>
        <Eyebrow>Not found</Eyebrow>
        <h1 className="mb-5 text-[clamp(30px,5vw,48px)] leading-[1.03]">
          No case study at this address
        </h1>
        <p className="mb-8 max-w-[52ch] text-lg text-ink-2">
          This entry may have been renamed — its URL is built from its title.
        </p>
        <Link
          to={href(lens, '/work')}
          className="inline-block border border-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ch transition-colors hover:bg-ch hover:text-paper"
        >
          Back to {copy.workLabel.toLowerCase()}
        </Link>
      </Page>
    );
  }

  const clean = (html) =>
    html ? DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }) : '';

  /**
   * Layered case study: overview reads for anyone, HLD is what a hiring
   * manager probes in a system-design conversation, LLD is the implementation
   * detail underneath.
   *
   * Layers are bands on one scrolling page, not tabs — hidden depth is depth
   * nobody reads and search engines never see. A project only gets the layers
   * it has real material for; `content` is the pre-layer fallback.
   */
  const layers = [
    { key: 'overview', label: 'Overview', note: 'What it is, for anyone.', html: clean(project.overview) },
    { key: 'hld', label: 'Architecture', note: 'High-level design: shape, guarantees, failure behaviour.', html: clean(project.hld) },
    { key: 'lld', label: 'Implementation', note: 'Low-level design: the contracts and the measurements.', html: clean(project.lld) },
  ].filter((l) => l.html);

  const legacyBody = layers.length === 0 ? clean(project.content) : '';

  return (
    <Page>
      <header>
        <Link
          to={href(lens, '/work')}
          className="mb-5 inline-block font-data text-[10.5px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ch"
        >
          ← {copy.workLabel}
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-[clamp(32px,5.4vw,54px)] leading-[1.02]">
            {project.name}
          </h1>
          <Tag tone={project.status === 'In Progress' ? 'active' : 'done'}>
            {project.status}
          </Tag>
        </div>

        <p className="max-w-[58ch] text-[18px] leading-relaxed text-ink-2">
          {project.description}
        </p>

        {(project.skills || []).length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-x-2.5 gap-y-1.5 border-t border-rule pt-4 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
            {project.skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        ) : null}
      </header>

      {(project.metrics || []).length > 0 ? (
        <div className="mt-8">
          <MetricRow>
            {project.metrics.map((m) => (
              <Metric
                key={m.label}
                figure={m.value}
                unit={m.unit}
                label={m.label}
                source={m.source}
              />
            ))}
          </MetricRow>
        </div>
      ) : null}

      {project.uiPreview ? (
        <Section label="Interface" note="A recreation, rebuilt from the app's own components.">
          <InterfacePreview name={project.uiPreview} />
        </Section>
      ) : null}

      {project.diagram ? (
        <Section label="Shape" note="Drawn from the project's own code and config.">
          <Diagram name={project.diagram} />
        </Section>
      ) : null}

      {layers.length > 0 ? <DepthDeck layers={layers} /> : null}

      {layers.length === 0 ? (
        <Section label="Detail" note="Authored content, sanitised before render.">
          {legacyBody ? (
            <div
              className="prose-plate"
              /* Sanitised immediately above; DOMPurify strips scripts and handlers. */
              dangerouslySetInnerHTML={{ __html: legacyBody }}
            />
          ) : (
            <p className="border-l-2 border-flag bg-flag-soft px-4 py-3.5 text-[14.5px] text-ink-2">
              <span className="mb-1 block font-data text-[10px] uppercase tracking-[0.1em] text-flag">
                Needs writing
              </span>
              This entry has a summary but no case study yet. Add the problem, the
              architecture, the tradeoff you rejected, and one measured number.
            </p>
          )}
        </Section>
      ) : null}

      {relatedLog.length > 0 ? (
        <Section label="History" note="Dated entries from the working log.">
          <ol className="border-t border-rule">
            {relatedLog.map((entry) => (
              <li
                key={entry.id}
                className="grid gap-1.5 border-b border-rule-soft py-4 md:grid-cols-[104px_minmax(0,1fr)] md:gap-7"
              >
                <time
                  dateTime={entry.date}
                  className="font-data text-[11px] tracking-wide text-ch tabular-nums"
                >
                  {entry.date}
                </time>
                <div className="min-w-0">
                  <h3 className="text-[16px] leading-snug text-ink">{entry.title}</h3>
                  {entry.body ? (
                    <p className="mt-1 max-w-[62ch] whitespace-pre-line text-[14px] text-ink-2">
                      {entry.body}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {next && next !== project ? (
        <Section label="Next">
          <Link
            to={href(lens, `/work/${slugify(next.name)}`)}
            className="group block border-t border-rule pt-5"
          >
            <span className="font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">
              Next
            </span>
            <h2 className="mt-1.5 text-[23px] text-ink transition-colors group-hover:text-ch">
              {next.name}
            </h2>
            <p className="mt-1 max-w-[60ch] text-[14.5px] text-ink-2">
              {next.description}
            </p>
          </Link>
        </Section>
      ) : null}
    </Page>
  );
}
