import { useSelector } from 'react-redux';
import { Page, Section, Eyebrow } from './Plate';
import { SYSTEMS } from '../utils/lens';
import { useLens } from '../hooks/useLens';

/**
 * About merges what used to be /about (skills) and /story (timeline).
 *
 * The old skill cards carried percentage bars — self-assessed numbers styled
 * as measurements. They're gone: a tool list states what you use, which is
 * true, where "React 90%" asserts something no one can verify.
 */
export default function About() {
  const lens = useLens();
  const skills = useSelector((state) => state.admin.content.skills?.[lens] || []);
  const journey = useSelector((state) => state.admin.content.journey || []);
  const timeline = [...journey].reverse();

  return (
    <Page>
      <header>
        <Eyebrow>About</Eyebrow>
        <h1 className="mb-5 max-w-[16ch] text-[clamp(34px,5.6vw,56px)] leading-[1.02]">
          Two disciplines, <span className="text-ch">one pipeline habit</span>
        </h1>
        <p className="max-w-[58ch] text-[18px] leading-relaxed text-ink-2">
          I&apos;m a full-stack and data engineer at TCG Digital, working across
          event pipelines, streaming infrastructure and the consoles that make
          them operable. Away from that I model and light real-time 3D assets —
          different tools, the same instinct for deciding the constraint before
          building inside it.
        </p>

        {/* Generated from content/portfolio.json by `npm run resume:build`, so
            it can never fall behind the site the way a checked-in PDF does. */}
        <a
          href="/resume.html"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-block border border-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ch transition-colors hover:bg-ch hover:text-paper"
        >
          Résumé
        </a>
      </header>

      <Section
        label="Stack"
        note={
          lens === SYSTEMS
            ? 'What I actually reach for, not a proficiency chart.'
            : 'The modelling, texturing and post pipeline.'
        }
      >
        <h2 className="mb-6 text-[clamp(24px,3.2vw,30px)]">Tools</h2>
        {skills.length > 0 ? (
          <ul className="grid gap-px border border-rule bg-rule [grid-template-columns:repeat(auto-fill,minmax(158px,1fr))]">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center gap-3 bg-paper-2 px-3.5 py-3"
              >
                {skill.url ? (
                  <img
                    src={skill.url}
                    alt=""
                    loading="lazy"
                    width="20"
                    height="20"
                    className="h-5 w-5 shrink-0 object-contain"
                  />
                ) : null}
                <span className="min-w-0 truncate font-data text-[11.5px] tracking-wide text-ink">
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border border-rule bg-paper-2 p-5 text-[14.5px] text-ink-2">
            No tools listed for this lens yet.
          </p>
        )}
      </Section>

      <Section
        label="Timeline"
        note="Most recent first. Edit entries in the studio."
      >
        <h2 className="mb-6 text-[clamp(24px,3.2vw,30px)]">Path</h2>
        {timeline.length > 0 ? (
          <ol className="border-t border-rule">
            {timeline.map((item, i) => (
              <li
                key={item.id || `${item.title}-${i}`}
                className="grid gap-1 border-b border-rule-soft py-4 md:grid-cols-[132px_minmax(0,1fr)_auto] md:items-baseline md:gap-6"
              >
                <span className="font-data text-[11px] tracking-wide text-ch tabular-nums">
                  {item.duration}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px] leading-snug text-ink">
                    {item.title}
                  </h3>
                  {item.organization ? (
                    <p className="text-[14px] text-ink-2">{item.organization}</p>
                  ) : null}
                </div>
                <span className="font-data text-[9.5px] uppercase tracking-[0.09em] text-ink-3">
                  {item.typeLabel}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="border border-rule bg-paper-2 p-5 text-[14.5px] text-ink-2">
            No timeline entries yet.
          </p>
        )}
      </Section>
    </Page>
  );
}
