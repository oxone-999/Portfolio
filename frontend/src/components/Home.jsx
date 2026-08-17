import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Section, Metric, MetricRow, Tag, Eyebrow } from './Plate';
import { href, slugify, LENS_COPY, SYSTEMS, statusTone } from '../utils/lens';
import { useLens } from '../hooks/useLens';
import { hero as HERO } from '../content';

/**
 * Hero copy comes from content/portfolio.json, alongside every other piece
 * of content. Metrics with a null value render as visibly unfilled slots
 * (see Plate.Metric) — nothing here asserts a number that wasn't measured.
 */

export default function Home() {
  const lens = useLens();
  const projects = useSelector(
    (state) => state.admin.content.projects?.[lens] || [],
  );
  const skills = useSelector((state) => state.admin.content.skills?.[lens] || []);

  const hero = HERO[lens];
  const copy = LENS_COPY[lens];
  /* Archived work is excluded here — the front page shows front-line work. */
  const shipped = projects.filter((p) => p.status !== 'Archived');
  const selected = shipped.slice(0, 3);

  return (
    <Page className="pt-32">
      {/* ---- hero: the thesis ---- */}
      <header>
        <Eyebrow>{hero.eyebrow || copy.eyebrow}</Eyebrow>
        <h1 className="mb-5 max-w-[15ch] text-[clamp(38px,6.6vw,64px)] leading-[1.01]">
          {hero.headline[0]} <span className="text-ch">{hero.headline[1]}</span>
        </h1>
        <p className="mb-9 max-w-[54ch] text-[18px] leading-relaxed text-ink-2">
          {hero.lede}
        </p>

        <MetricRow>
          {hero.metrics.map((m) => (
            <Metric
              key={m.label}
              figure={m.value}
              unit={m.unit}
              label={m.label}
              source={m.source}
            />
          ))}
          <Metric
            figure={shipped.length}
            label={lens === SYSTEMS ? 'Projects shipped' : 'Pieces published'}
            source="From content"
          />
        </MetricRow>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-data text-[10px] uppercase tracking-[0.06em] text-ink-3">
          {skills.slice(0, 6).map((skill, i) => (
            <span key={skill.id} className={i === 0 ? 'text-ch' : undefined}>
              {i > 0 ? '· ' : ''}
              {skill.name}
            </span>
          ))}
        </div>
      </header>

      {/* ---- selected work ---- */}
      <Section
        label="Selected"
        note="Each entry is a routed page, not a modal. Linkable and indexable."
      >
        <h2 className="mb-3 text-[clamp(25px,3.4vw,32px)]">{copy.workLabel}</h2>
        <p className="mb-7 max-w-[58ch] text-ink-2">{copy.workBlurb}</p>

        {selected.length > 0 ? (
          <ul className="border-t border-rule">
            {selected.map((project) => (
              <li key={project.id} className="border-b border-rule-soft">
                <Link
                  to={href(lens, `/work/${slugify(project.name)}`)}
                  className="group grid gap-2 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline md:gap-8"
                >
                  <div className="min-w-0">
                    <h3 className="mb-1 text-[19px] text-ink transition-colors group-hover:text-ch">
                      {project.name}
                    </h3>
                    <p className="max-w-[62ch] text-[14.5px] text-ink-2">
                      {project.description}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 font-data text-[10px] uppercase tracking-[0.06em] text-ink-3">
                      {(project.skills || []).slice(0, 6).map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <Tag tone={statusTone(project.status)}>{project.status}</Tag>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border border-rule bg-paper-2 p-5 text-[14.5px] text-ink-2">
            No entries yet for this lens.
          </p>
        )}

        <Link
          to={href(lens, '/work')}
          className="mt-6 inline-block border-b border-ch pb-0.5 font-data text-[11px] uppercase tracking-[0.1em] text-ch"
        >
          All {copy.workLabel.toLowerCase()} ({shipped.length})
        </Link>
      </Section>

      {/* ---- contact ---- */}
      <Section label="Contact" note="A real form, not a mailto in the footer.">
        <h2 className="mb-3 text-[clamp(25px,3.4vw,32px)]">
          {lens === SYSTEMS
            ? 'Hiring, or want the architecture detail?'
            : 'Commissions and collaborations'}
        </h2>
        <p className="mb-6 max-w-[54ch] text-ink-2">
          {lens === SYSTEMS
            ? 'Happy to walk through any of these systems in depth — the tradeoffs are more interesting than the diagrams.'
            : 'Open to asset work and real-time art. Tell me the engine, the budget and the deadline.'}
        </p>
        <Link
          to={href(lens, '/contact')}
          className="inline-block border border-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ch transition-colors hover:bg-ch hover:text-paper"
        >
          Get in touch
        </Link>
      </Section>
    </Page>
  );
}
