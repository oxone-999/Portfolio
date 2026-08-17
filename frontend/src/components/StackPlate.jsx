import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { href, slugify } from '../utils/lens';

/**
 * The stack drawn as a cross-section: strata, read bottom-up.
 *
 * A flat grid of ~40 logos says every one of them is the same kind of claim,
 * which is false — a language, a broker, a load-test harness and "distributed
 * systems" are different orders of thing. Stacking them as strata puts that
 * difference in the geometry: languages are the bedrock everything else is
 * written in, tooling sits above the things it operates on, and practices cap
 * the section because they're what the whole depth is *for*.
 *
 * Two rules the design has to keep:
 *
 * 1. **No proficiency scores.** This page once carried percentage bars —
 *    self-assessed numbers dressed as measurement. The figure beside a tool
 *    counts *projects on this site that list it*, derived at render time from
 *    the project data. It cannot drift from the case studies, and each one is
 *    a click away. No project, no figure — absence shows as absence, not as a
 *    score of nought.
 *
 * 2. **Motion is optional.** Strata rise into place on scroll via
 *    IntersectionObserver. Under `prefers-reduced-motion` the transition is
 *    removed outright, not shortened, and every stratum renders in place.
 */

/**
 * Bottom-up stratum order — index 0 is the bedrock.
 * Anything not listed sorts above the named strata, before "Other".
 */
const STRATA_ORDER = {
  SDE: [
    'Languages',
    'Frameworks & Libraries',
    'Data & Storage',
    'Streaming & Orchestration',
    'AI & Models',
    'Platform & Tooling',
    'Protocols & Auth',
    'Practices & Concepts',
  ],
  '3D': [
    'Languages',
    'Engines',
    'Modelling & Sculpting',
    'Texturing & 2D',
    'Compositing & Post',
    'Practices & Concepts',
  ],
};

/** Competencies rather than products: no logo exists, so none is faked. */
const CONCEPT_STRATUM = 'Practices & Concepts';
const UNGROUPED = 'Other';

/**
 * Project skill lists are free text and a few spellings differ from the
 * canonical name. Only exact, verified aliases belong here — fuzzy matching
 * ("react" ⊂ "react native") would invent evidence that isn't there.
 */
const ALIASES = {
  reactjs: 'react',
  dockercli: 'docker',
  expressjs: 'express',
  bsoup: 'beautifulsoup',
};

const normalise = (v) => String(v).toLowerCase().replace(/[^a-z0-9]/g, '');
const canonical = (v) => {
  const n = normalise(v);
  return ALIASES[n] || n;
};

export default function StackPlate({ skills, projects, lens }) {
  const [openSkill, setOpenSkill] = useState(null);

  /** tool → the projects listing it. Derived, never authored. */
  const usage = useMemo(() => {
    const index = new Map();
    for (const project of projects) {
      for (const raw of project.skills || []) {
        const key = canonical(raw);
        if (!index.has(key)) index.set(key, []);
        const bucket = index.get(key);
        if (!bucket.includes(project.name)) bucket.push(project.name);
      }
    }
    return index;
  }, [projects]);

  /** Strata ordered top-of-section first, because that's DOM reading order. */
  const strata = useMemo(() => {
    const order = STRATA_ORDER[lens] || [];
    const byGroup = new Map();
    for (const skill of skills) {
      const key = skill.group || UNGROUPED;
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key).push(skill);
    }
    const rank = (name) => {
      const i = order.indexOf(name);
      if (i !== -1) return i;
      return name === UNGROUPED ? order.length + 1 : order.length;
    };
    return [...byGroup.entries()]
      .map(([name, items], i) => ({ name, items, key: name || `g${i}` }))
      .sort((a, b) => rank(b.name) - rank(a.name) || a.name.localeCompare(b.name));
  }, [skills, lens]);

  const total = skills.length;

  if (!total) {
    return (
      <p className="border border-rule bg-paper-2 p-5 text-[14.5px] text-ink-2">
        No tools listed for this lens yet.
      </p>
    );
  }

  const depth = strata.length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">
        <span>Cross-section · read bottom-up</span>
        <span className="tabular-nums">
          {total} entries · {depth} strata
        </span>
      </div>

      <div className="border border-rule bg-paper-2">
        {strata.map((stratum, i) => (
          <Stratum
            key={stratum.key}
            stratum={stratum}
            /* Depth label counts from the bedrock, so it stays stable as
               strata are added above it. */
            depthIndex={depth - i}
            isBedrock={i === depth - 1}
            lens={lens}
            usage={usage}
            openSkill={openSkill}
            setOpenSkill={setOpenSkill}
          />
        ))}
      </div>

      <p className="mt-3 font-data text-[10px] leading-relaxed text-ink-3">
        Figures count the projects on this site that list that entry — read off
        the case studies, not self-rated. Practices carry no logo because they
        aren&apos;t products.
      </p>
    </div>
  );
}

StackPlate.propTypes = {
  skills: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  lens: PropTypes.string.isRequired,
};

function Stratum({ stratum, depthIndex, isBedrock, lens, usage, openSkill, setOpenSkill }) {
  const ref = useRef(null);
  // The rise is inline-styled (per-item delay), so a `motion-reduce:` utility
  // cannot switch it off — the preference is read here and the transition
  // dropped entirely.
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    if (reduced) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    // Reveal once. Re-animating on the way back up is noise, not feedback.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const isConcepts = stratum.name === CONCEPT_STRATUM;

  return (
    <section
      ref={ref}
      id={`stratum-${slugify(stratum.name)}`}
      className={`grid grid-cols-[44px_minmax(0,1fr)] border-rule ${
        isBedrock ? '' : 'border-b'
      } ${isConcepts ? 'bg-ch-soft' : ''}`}
    >
      {/* depth axis — the ruler down the left edge of the section */}
      <div className="relative flex flex-col items-center border-r border-rule py-3">
        <span className="font-data text-[10px] tabular-nums text-ch">
          {String(depthIndex).padStart(2, '0')}
        </span>
        <span
          aria-hidden="true"
          className="mt-1.5 w-full flex-1 bg-[repeating-linear-gradient(to_bottom,var(--color-rule)_0_1px,transparent_1px_7px)]"
        />
      </div>

      <div className="min-w-0 px-4 py-3.5">
        <div className="mb-2.5 flex items-baseline gap-3">
          <h3
            className={`font-data text-[10.5px] uppercase tracking-[0.12em] ${
              isConcepts ? 'text-ch' : 'text-ink-2'
            }`}
          >
            {stratum.name}
          </h3>
          {isBedrock ? (
            <span className="font-data text-[9px] uppercase tracking-[0.1em] text-ink-3">
              bedrock
            </span>
          ) : null}
          <span aria-hidden="true" className="h-px flex-1 bg-rule-soft" />
          <span className="font-data text-[10px] tabular-nums text-ink-3">
            {String(stratum.items.length).padStart(2, '0')}
          </span>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {stratum.items.map((skill, i) => {
            const projectNames = usage.get(canonical(skill.name)) || [];
            const isOpen = openSkill === skill.id;
            const hasEvidence = projectNames.length > 0;

            return (
              <li
                key={skill.id}
                className="relative"
                style={
                  reduced
                    ? undefined
                    : {
                        // Per-item delay makes a stratum settle across rather
                        // than blink in whole. Capped so a wide stratum never
                        // takes noticeably long.
                        transitionDelay: `${Math.min(i, 10) * 35}ms`,
                        opacity: shown ? 1 : 0,
                        transform: shown ? 'none' : 'translateY(10px)',
                        transitionProperty: 'opacity, transform',
                        transitionDuration: '460ms',
                        transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)',
                      }
                }
              >
                <button
                  type="button"
                  disabled={!hasEvidence}
                  onClick={() => setOpenSkill(isOpen ? null : skill.id)}
                  aria-expanded={hasEvidence ? isOpen : undefined}
                  className={`flex items-center gap-2 border px-2.5 py-1.5 transition-colors ${
                    isOpen ? 'border-ch bg-ch text-paper' : 'border-rule bg-paper'
                  } ${hasEvidence && !isOpen ? 'hover:border-ch hover:text-ch' : ''} ${
                    hasEvidence ? '' : 'cursor-default opacity-70'
                  } ${isConcepts ? 'border-dashed' : ''}`}
                >
                  {skill.url ? (
                    <img
                      src={skill.url}
                      alt=""
                      loading="lazy"
                      width="16"
                      height="16"
                      className="h-4 w-4 shrink-0 object-contain"
                    />
                  ) : null}
                  <span className="font-data text-[11px] tracking-wide">
                    {skill.name}
                  </span>
                  {hasEvidence ? (
                    <span
                      className={`font-data text-[10px] tabular-nums ${
                        isOpen ? 'text-paper' : 'text-ch'
                      }`}
                    >
                      {projectNames.length}
                    </span>
                  ) : null}
                </button>

                {isOpen && hasEvidence ? (
                  /* Overlaid rather than in flow: an in-flow panel grows the
                     row and reflows every chip after it, so opening one entry
                     visibly rearranges the stratum you were reading. */
                  <ul className="absolute left-0 top-full z-10 mt-1 min-w-full border border-ch bg-paper p-2 shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
                    {projectNames.map((name) => (
                      <li key={name}>
                        <Link
                          to={href(lens, `/work/${slugify(name)}`)}
                          className="block whitespace-nowrap py-0.5 font-data text-[10.5px] text-ink-2 underline-offset-2 hover:text-ch hover:underline"
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

Stratum.propTypes = {
  stratum: PropTypes.object.isRequired,
  depthIndex: PropTypes.number.isRequired,
  isBedrock: PropTypes.bool,
  lens: PropTypes.string.isRequired,
  usage: PropTypes.instanceOf(Map).isRequired,
  openSkill: PropTypes.string,
  setOpenSkill: PropTypes.func.isRequired,
};
