import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Recreation of the Sports Intelligence Console's stream dashboard.
 *
 * Rebuilt from the app's own components rather than screenshotted, and
 * restyled through this site's design tokens instead of the original
 * Material UI / Mantine theme — the Signal Plate rule is that no component
 * hardcodes a colour.
 *
 * What's real, read from the source: the left nav's four destinations and the
 * role that gates them (config/menuItems.jsx); the header's infrastructure
 * health strip (HEALTH_CONFIG in config/dashboardConfig.jsx); collapsible
 * match groups by status with a count in the header
 * (GroupedStreamSection.jsx); the exact table columns and their order
 * (tableHeaders in config/dashboardConfig.jsx); the AI-match marker on rows
 * whose pipeline_type isn't a plain match, and the per-row actions that differ
 * by status (StreamTableRow.jsx / ActionButtons.jsx).
 *
 * What's substituted: every production company, broadcaster and fixture name
 * is invented — the real console is operated against a named rights-holder.
 * Health states and row data are sample values, labelled as such.
 */

const NAV = ['Stream List', 'Clients', 'Viewership Analytics', 'Settings'];

const HEALTH = [
  ['Kafka', true],
  ['Redis', true],
  ['Portainer', true],
  ['Nginx', true],
  ['Whisper 30', true],
  ['Whisper 32', false],
];

const COLUMNS = [
  'Production Company',
  'Input',
  'Status',
  'Output',
  'Logs',
  'Match Name',
  'Date / Time (IST)',
  'Actions',
];

const GROUPS = [
  {
    status: 'In Progress',
    rows: [
      {
        id: 'a',
        company: 'Production Co. A',
        input: 'SRT',
        state: 'running',
        match: 'Match 1 — Club A v Club B',
        when: '12 May 2025, 20:30',
        ai: true,
      },
    ],
  },
  {
    status: 'Upcoming',
    rows: [
      {
        id: 'b',
        company: 'Production Co. A',
        input: 'HLS',
        state: 'created',
        match: 'Match 2 — Club C v Club D',
        when: '14 May 2025, 18:00',
        ai: true,
      },
      {
        id: 'c',
        company: 'Production Co. B',
        input: 'SRT',
        state: 'created',
        match: 'Match 3 — Club E v Club F',
        when: '15 May 2025, 21:15',
        ai: false,
      },
    ],
  },
  {
    status: 'Completed',
    rows: [
      {
        id: 'd',
        company: 'Production Co. B',
        input: 'SRT',
        state: 'stopped',
        match: 'Match 0 — Club G v Club H',
        when: '09 May 2025, 20:30',
        ai: true,
      },
    ],
  },
];

/** Actions genuinely differ by row state in ActionButtons.jsx. */
const ACTIONS = {
  running: ['Stop', 'Logs', 'Services'],
  created: ['Start', 'Edit', 'Delete'],
  stopped: ['View', 'Clean', 'Delete'],
};

function StatusPill({ state }) {
  const tone =
    state === 'running'
      ? 'border-good text-good'
      : state === 'stopped'
        ? 'border-ink-3 text-ink-3'
        : 'border-ch text-ch';
  return (
    <span className={`inline-block border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.08em] ${tone}`}>
      {state}
    </span>
  );
}
StatusPill.propTypes = { state: PropTypes.string.isRequired };

export default function SportsConsole() {
  const [nav, setNav] = useState(NAV[0]);
  const [open, setOpen] = useState({ 'In Progress': true, Upcoming: true, Completed: false });

  return (
    <figure className="my-8">
      <div className="border border-rule bg-paper-2">
        {/* header — brand, infra health strip, user */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule bg-paper-3 px-4 py-2.5">
          <span className="font-display text-[15px] font-semibold text-ink">
            Sports Intelligence Console
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {HEALTH.map(([name, up]) => (
              <span
                key={name}
                className="flex items-center gap-1 font-data text-[9px] uppercase tracking-[0.06em] text-ink-3"
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-1.5 w-1.5 rounded-full ${up ? 'bg-good' : 'bg-flag'}`}
                />
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* left nav — role-gated in the real app */}
          <div className="w-full shrink-0 border-b border-rule bg-paper-3/60 p-3 md:w-[176px] md:border-b-0 md:border-r">
            <div className="flex flex-row flex-wrap gap-1.5 md:flex-col">
              {NAV.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNav(item)}
                  aria-pressed={nav === item}
                  className={`border px-2.5 py-2 text-left font-data text-[10px] uppercase tracking-[0.06em] transition-colors ${
                    nav === item
                      ? 'border-ch bg-ch-soft text-ch'
                      : 'border-rule bg-paper text-ink-2 hover:border-ink-3'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-3 hidden font-data text-[9px] uppercase tracking-[0.06em] text-ink-3 md:block">
              Role: admin
            </p>
          </div>

          <div className="min-w-0 flex-1 p-3">
            {nav !== 'Stream List' ? (
              <div className="flex h-[220px] items-center justify-center border border-dashed border-rule text-center font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">
                {nav} — not recreated
              </div>
            ) : (
              <div className="space-y-3">
                {GROUPS.map((group) => {
                  const isOpen = open[group.status];
                  return (
                    <div key={group.status} className="border border-rule">
                      <button
                        type="button"
                        onClick={() => setOpen((o) => ({ ...o, [group.status]: !o[group.status] }))}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between bg-paper-3 px-3 py-2 text-left font-data text-[10px] uppercase tracking-[0.08em] text-ink hover:text-ch"
                      >
                        <span>
                          {group.status} matches ({group.rows.length})
                        </span>
                        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                      </button>

                      {isOpen ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                {COLUMNS.map((c) => (
                                  <th
                                    key={c}
                                    className="whitespace-nowrap border-b border-rule bg-paper px-2 py-1.5 text-left font-data text-[8.5px] font-normal uppercase tracking-[0.07em] text-ink-3"
                                  >
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {group.rows.map((r) => (
                                <tr key={r.id} className="bg-paper">
                                  <td className="whitespace-nowrap border-b border-rule-soft px-2 py-2 font-data text-[9.5px] text-ink">
                                    {r.ai ? (
                                      <span title="AI-powered match" className="mr-1 text-ch">
                                        ✦
                                      </span>
                                    ) : null}
                                    {r.company}
                                  </td>
                                  <td className="border-b border-rule-soft px-2 py-2 font-data text-[9.5px] text-ink-2">
                                    {r.input}
                                  </td>
                                  <td className="border-b border-rule-soft px-2 py-2">
                                    <StatusPill state={r.state} />
                                  </td>
                                  <td className="border-b border-rule-soft px-2 py-2 font-data text-[9.5px] text-ch underline underline-offset-2">
                                    View
                                  </td>
                                  <td className="border-b border-rule-soft px-2 py-2 font-data text-[9.5px] text-ch underline underline-offset-2">
                                    Logs
                                  </td>
                                  <td className="whitespace-nowrap border-b border-rule-soft px-2 py-2 font-data text-[9.5px] text-ink">
                                    {r.match}
                                  </td>
                                  <td className="whitespace-nowrap border-b border-rule-soft px-2 py-2 font-data text-[9.5px] tabular-nums text-ink-2">
                                    {r.when}
                                  </td>
                                  <td className="border-b border-rule-soft px-2 py-2">
                                    <span className="flex flex-wrap gap-1">
                                      {ACTIONS[r.state].map((a) => (
                                        <span
                                          key={a}
                                          className="border border-rule px-1 py-0.5 font-data text-[8.5px] uppercase tracking-[0.04em] text-ink-2"
                                        >
                                          {a}
                                        </span>
                                      ))}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Recreation of the stream dashboard — nav, health strip, status groups,
        columns and per-status actions taken from the app&apos;s own config and
        components. Company and fixture names are invented; health and row data
        are sample values.
      </figcaption>
    </figure>
  );
}
