import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Page, Section, Eyebrow } from './Plate';
import Reveal from './motion/Reveal';
import { StaggerGroup, StaggerItem } from './motion/StaggerList';
import StackPlate from './StackPlate';
import { SYSTEMS } from '../utils/lens';
import { useLens } from '../hooks/useLens';

/**
 * About merges what used to be /about (skills) and /story (timeline).
 *
 * The old skill cards carried percentage bars — self-assessed numbers styled
 * as measurements. They're gone: a tool list states what you use, which is
 * true, where "React 90%" asserts something no one can verify.
 *
 * The list is now grouped by kind of technology (see StackPlate) because one
 * flat grid of ~24 logos reads as clutter — a language, a broker and a video
 * codec are not the same kind of claim and shouldn't sit in the same run.
 */
export default function About() {
  const lens = useLens();
  const reduced = useReducedMotion();
  const skills = useSelector((state) => state.admin.content.skills?.[lens] || []);
  const projects = useSelector((state) => state.admin.content.projects?.[lens] || []);
  const journey = useSelector((state) => state.admin.content.journey || []);
  const timeline = [...journey].reverse();

  /* Tracks how far down the timeline list the visitor has scrolled, so the
   * rail beside it fills as a read progress indicator — representing actual
   * scroll position through actual content, not a decorative loop. */
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.85', 'end 0.4'],
  });
  // Smoothed rather than a raw 1:1 readout, so the rail settles rather than
  // jumping on every scroll tick.
  const railScale = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.5 });

  return (
    <Page>
      <Reveal as="header">
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
      </Reveal>

      <Section
        label="Stack"
        note={
          lens === SYSTEMS
            ? 'What I actually reach for, not a proficiency chart.'
            : 'The modelling, texturing and post pipeline.'
        }
      >
        <h2 className="mb-6 text-[clamp(24px,3.2vw,30px)]">Tools</h2>
        <StackPlate skills={skills} projects={projects} lens={lens} />
      </Section>

      <Section
        label="Timeline"
        note="Most recent first. Edit entries in the studio."
      >
        <h2 className="mb-6 text-[clamp(24px,3.2vw,30px)]">Path</h2>
        {timeline.length > 0 ? (
          <div ref={timelineRef} className="relative pl-3">
            {/* A read-progress rail, not a decoration: it fills exactly as far
                as the visitor has actually scrolled through this list. */}
            {!reduced ? (
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-px bg-rule-soft"
              >
                <motion.div
                  className="w-full origin-top bg-ch"
                  style={{ scaleY: railScale, height: '100%' }}
                />
              </div>
            ) : null}

            {/* Keyed on the ids for the same reason as Home's list — the
                bundled-to-Supabase swap re-keys every row. See StaggerList.jsx. */}
            <StaggerGroup
              key={timeline.map((t) => t.id || t.title).join('|')}
              as="ol"
              className="border-t border-rule"
            >
              {timeline.map((item, i) => (
                <StaggerItem
                  key={item.id || `${item.title}-${i}`}
                  as="li"
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
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        ) : (
          <p className="border border-rule bg-paper-2 p-5 text-[14.5px] text-ink-2">
            No timeline entries yet.
          </p>
        )}
      </Section>
    </Page>
  );
}
