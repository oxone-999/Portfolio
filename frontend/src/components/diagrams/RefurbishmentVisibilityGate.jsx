/**
 * The measurements the dashboard is not allowed to show.
 *
 * Client, plant, vendor and index names are genericised throughout — the source
 * repo names a petrochemical operator, its plant units, a permit-system vendor
 * and a plant historian product. The mechanisms, field names that carry
 * engineering meaning (`md_flag`, `flag`, `reference`), the keys and the
 * three-state truth table are verbatim, because those are the structure.
 *
 * Read off the repo, not proposed: `services/transformer_service.py`
 * (474 lines — `_kpi_cutoffs`, `_kpi_visible`, `_latest_kpi_by_reference`),
 * `utils/run_status.py`, `utils/stale_cache.py`, the six ingestion service
 * READMEs, and 182 test functions across the three tested services.
 *
 * The drawing argues one thing in two registers: a condition-monitoring
 * dashboard's hardest problem is not collecting numbers, it is knowing which
 * collected numbers still describe the machine in front of you.
 *
 * ---- register 1: the spine, and why re-running is safe -------------------
 *
 * Six scheduled ingestion services, each a daily 24-hour window, fan into two
 * stores. The interesting property is not the fan-in, it is that every one of
 * them is idempotent by construction — the destination id is derived from the
 * record's own content, so an overlapping window or a manual re-run upserts
 * the same row instead of double-counting it:
 *
 *   tag readings   `_id = "{tagName}|{timeStamp}"`
 *   log messages   `_id = "{sourceIndex}::{Id}"`
 *   permits        `_id = permit.id`
 *   incidents      upsert keyed on the incident id (UPDATE if present, else INSERT)
 *
 * That is drawn as a key on each arrow rather than a note, because it is the
 * property that makes the schedule restartable. A pipeline you cannot safely
 * re-run is a pipeline you cannot operate.
 *
 * The read path is layered one way and the constraint is absolute: the core
 * data service is the SOLE consumer of the search indices, and the dashboard
 * service never queries them directly — it composes core-data responses with
 * relational metadata. Drawn as a one-way spine so the forbidden edge (a
 * dashboard→index arrow) is conspicuous by absence.
 *
 * ---- register 2: the gate ------------------------------------------------
 *
 * This is what the figure exists for.
 *
 * When a transformer is refurbished, its earlier measurements describe a
 * machine that no longer exists. They are not stale and they are not wrong —
 * they are about something else. Plotting them beside current readings
 * produces a trend line across a discontinuity, which is worse than showing
 * nothing, because it looks like information.
 *
 * So visibility is decided per equipment from two flags, and the three
 * outcomes are drawn as three lanes on one time axis:
 *
 *   md_flag == 0                 -> HIDE EVERYTHING. Refurbishment is in
 *                                   progress, or complete but no post-work
 *                                   report has landed yet. Either way every
 *                                   record on file predates the work.
 *   md_flag == 1 and flag == 1   -> CUTOFF at the refurbishment end date.
 *                                   Only measurements on or after it show.
 *   anything else                -> NO RESTRICTION. Covers a missing flag, the
 *                                   unexpected 1/0 combination, and a 1/1 pair
 *                                   whose end date will not parse.
 *
 * That last lane is the judgement call worth drawing, so it is labelled rather
 * than left implicit: the fallback is permissive. A data gap must never
 * silently blank a transformer's dashboard — an operator seeing an empty panel
 * cannot tell "no data" from "hidden by a rule", so the code prefers showing
 * with a known provenance over hiding for an unknown reason. The opposite
 * default would be defensible; it was not chosen, and the caption says so.
 *
 * ---- the overloaded field ------------------------------------------------
 *
 * The cutoff compares against `reference`, the per-KPI lab/test date, NOT the
 * record's ingest timestamp — different KPIs in one run are measured on
 * different days. But `reference` is overloaded in the real feed: some records
 * carry a date, others carry a standards citation ("IEEE C57.104-1991 Table 4;
 * IEC 60599 for ratio interpretation"). A citation is not a date, cannot be
 * proven to post-date the refurbishment, and is therefore hidden whenever a
 * cutoff applies. That asymmetry is drawn as the struck-through point on the
 * gated lane — the one hidden point that is hidden for a type reason rather
 * than a time reason.
 *
 * ---- motion --------------------------------------------------------------
 *
 * Pips ride the six ingestion arrows, because those are the only thing on the
 * figure that genuinely moves on a schedule. Nothing animates in the gate
 * register: an earlier draft swept a marker across the time axis and it read as
 * a second vertical line competing with the cutoff, which is the one line the
 * figure is about. Under prefers-reduced-motion the pips stop rather than slow.
 */

const W = 1240;
const H = 720;

/* ---- register 1: ingestion spine ---------------------------------------- */

/** [label, cadence, key drawn on the arrow] */
const SOURCES = [
  ['tag readings', 'HISTORIAN', '{tagName}|{timeStamp}'],
  ['log messages', 'SEARCH IDX', '{sourceIndex}::{Id}'],
  ['permits', 'VENDOR API', 'permit.id'],
  ['incidents', 'REST API', 'incident id · upsert'],
  ['asset monitor', 'SOURCE SQL', 'daily window'],
  ['work orders', 'ERP API', 'daily window'],
];

const SRC_X = 26;
const SRC_Y = 78;
const SRC_W = 150;
const SRC_H = 30;
const SRC_GAP = 7;

const STORE_X = 330;
const IDX_Y = 108;
const REL_Y = 208;
const STORE_R = 30;

const CORE_X = 560;
const DASH_X = 800;
const OUT_X = 1046;
const SPINE_Y = 158;
const BOX_W = 150;
const BOX_H = 48;

/* ---- register 2: the gate ------------------------------------------------ */

const AXIS_X0 = 300;
const AXIS_X1 = 1120;
const CUTOFF_X = 726;

/** Three lanes: [y, verdict, rule, sub] */
const LANES = [
  [418, 'HIDE ALL', 'md_flag == 0', 'WORK IN PROGRESS, OR NO POST-WORK REPORT YET'],
  [512, 'CUTOFF', 'md_flag == 1 · flag == 1', 'ONLY MEASUREMENTS FROM THE END DATE ON'],
  [606, 'NO RESTRICTION', 'anything else', 'MISSING FLAG · 1/0 · UNPARSEABLE END DATE'],
];

/** Measurement points along each lane. [xFrac, state] */
const POINTS = [
  // lane 0 — everything hidden
  [[0.10, 'hid'], [0.26, 'hid'], [0.42, 'hid'], [0.62, 'hid'], [0.80, 'hid']],
  // lane 1 — hidden before the cutoff, shown after; one struck point = citation
  [[0.10, 'hid'], [0.26, 'hid'], [0.42, 'hid'], [0.62, 'cite'], [0.80, 'show']],
  // lane 2 — all shown
  [[0.10, 'show'], [0.26, 'show'], [0.42, 'show'], [0.62, 'show'], [0.80, 'show']],
];

const atFrac = (f) => AXIS_X0 + (AXIS_X1 - AXIS_X0) * f;

export default function RefurbishmentVisibilityGate() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="rvg-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="How an asset-condition dashboard decides which stored measurements it is allowed to display. The upper half shows the spine: six scheduled ingestion services — tag readings from a plant historian, log messages, permits from a vendor API, incidents, asset-monitoring data from a source database and work orders from an ERP — each running a daily twenty-four-hour window and each writing with an identifier derived from the record's own content, such as tag name joined to timestamp, so that a re-run or an overlapping window upserts rather than duplicating. They fan into a search index and a relational store. A core data service is the sole consumer of the search indices; a dashboard service composes its responses with relational metadata and never queries the indices directly; the result serves the dashboard and a chat assistant. The lower half is the visibility gate, drawn as three lanes on one time axis with a vertical cutoff line. When the refurbishment flag is zero, every measurement is hidden, because refurbishment is in progress or no post-work report has arrived and all records predate the work. When both flags are one, a cutoff falls at the refurbishment end date and only measurements on or after it are shown. In every other case — a missing flag, an unexpected combination, or an end date that will not parse — no restriction applies, because a data gap must never silently blank a dashboard. On the gated lane one point after the cutoff is still struck out: the field the cutoff compares against sometimes carries a standards citation instead of a date, and a citation cannot be proven to post-date the refurbishment."
      >
        <style>{`
          .rvg-svg text { font-family: var(--font-data); }

          .rvg-box   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .rvg-src   { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }
          .rvg-store { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .rvg-dot   { fill: var(--color-ch); }

          .rvg-axis   { stroke: var(--color-ink-3); stroke-width: 1; opacity: .5; }
          .rvg-cut    { stroke: var(--color-ch); stroke-width: 1.5; }
          .rvg-cutlbl { fill: var(--color-ch); font-size: 9px; letter-spacing: .07em; text-anchor: middle; }
          .rvg-rule   { stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 5 4; opacity: .55; }

          .rvg-show { fill: var(--color-ch); stroke: none; }
          .rvg-hid  { fill: none; stroke: var(--color-ink-3); stroke-width: 1; opacity: .55; }
          .rvg-strike { stroke: var(--color-ink-3); stroke-width: 1; opacity: .8; }

          .rvg-t-name { fill: var(--color-ink);   font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .rvg-t-kind { fill: var(--color-ink-3); font-size: 7.5px;  letter-spacing: .08em; text-anchor: middle; }
          .rvg-t-src  { fill: var(--color-ink-2); font-size: 9px;    letter-spacing: .02em; }
          .rvg-t-tag  { fill: var(--color-ink-3); font-size: 7px;    letter-spacing: .06em; }
          .rvg-t-key  { fill: var(--color-ch);    font-size: 7.5px;  letter-spacing: .02em; }
          .rvg-t-head { fill: var(--color-ink-3); font-size: 10px;   letter-spacing: .1em; }
          .rvg-t-leg  { fill: var(--color-ink-3); font-size: 8.5px;  letter-spacing: .07em; }
          .rvg-t-band { fill: var(--color-ink-2); font-size: 8.5px;  letter-spacing: .09em; }
          .rvg-t-verd { fill: var(--color-ink);   font-size: 11px;   letter-spacing: .04em; }
          .rvg-t-rule { fill: var(--color-ch);    font-size: 9px;    letter-spacing: .02em; }
          .rvg-t-sub  { fill: var(--color-ink-3); font-size: 7.5px;  letter-spacing: .07em; }

          .rvg-flow { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .7; }
          .rvg-thin { stroke: var(--color-ink-3); stroke-width: 1; fill: none; opacity: .45; }
          .rvg-pip  { fill: var(--color-ch); }

          .rvg-ride { animation: rvg-move 3.8s linear infinite; }
          @keyframes rvg-move {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .rvg-ride { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="rvg-t-head">
          WHICH STORED MEASUREMENTS THE DASHBOARD MAY SHOW
        </text>
        <text x={24} y={44} className="rvg-t-leg">
          names genericised · flags, keys and the truth table are verbatim
        </text>

        {/* ---- register 1: sources ---- */}
        <text x={26} y={66} className="rvg-t-band">
          SIX DAILY INGESTIONS · 24H WINDOW EACH
        </text>

        {SOURCES.map(([label, kind, key], i) => {
          const y = SRC_Y + i * (SRC_H + SRC_GAP);
          const my = y + SRC_H / 2;
          const target = i < 3 ? IDX_Y : REL_Y;
          const d = `M ${SRC_X + SRC_W} ${my} C ${SRC_X + SRC_W + 46} ${my}, ${STORE_X - STORE_R - 46} ${target}, ${STORE_X - STORE_R} ${target}`;
          return (
            <g key={label}>
              <rect x={SRC_X} y={y} width={SRC_W} height={SRC_H} className="rvg-src" />
              <text x={SRC_X + 8} y={y + 13} className="rvg-t-src">
                {label}
              </text>
              <text x={SRC_X + 8} y={y + 24} className="rvg-t-tag">
                {kind}
              </text>
              <path d={d} className="rvg-thin" />
              <circle
                r="2.5"
                className="rvg-pip rvg-ride"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg', animationDelay: `${i * 0.5}s` }}
              />
              <text x={SRC_X + SRC_W + 10} y={my - 4} className="rvg-t-key">
                {key}
              </text>
            </g>
          );
        })}

        {/* ---- stores ---- */}
        {[
          [IDX_Y, 'search index', 'MEASUREMENTS · RUNS'],
          [REL_Y, 'relational', 'MASTERS · AUDIT'],
        ].map(([y, label, sub]) => (
          <g key={label}>
            <circle cx={STORE_X} cy={y} r={STORE_R} className="rvg-store" />
            <circle cx={STORE_X} cy={y} r="2.5" className="rvg-dot" />
            <text x={STORE_X} y={y - STORE_R - 8} className="rvg-t-kind">
              {label}
            </text>
            <text x={STORE_X} y={y + STORE_R + 14} className="rvg-t-kind">
              {sub}
            </text>
          </g>
        ))}

        {/* ---- read spine ---- */}
        <path d={`M ${STORE_X + STORE_R} ${IDX_Y} C 480 ${IDX_Y}, 490 ${SPINE_Y}, ${CORE_X - BOX_W / 2} ${SPINE_Y}`} className="rvg-flow" />
        <path d={`M ${STORE_X + STORE_R} ${REL_Y} C 640 ${REL_Y}, 700 ${SPINE_Y + 40}, ${DASH_X - BOX_W / 2} ${SPINE_Y + 18}`} className="rvg-thin" />
        <path d={`M ${CORE_X + BOX_W / 2} ${SPINE_Y} L ${DASH_X - BOX_W / 2} ${SPINE_Y}`} className="rvg-flow" />
        <path d={`M ${DASH_X + BOX_W / 2} ${SPINE_Y} L ${OUT_X - 62} ${SPINE_Y}`} className="rvg-flow" />

        {[
          [CORE_X, 'core data', 'SOLE INDEX CONSUMER'],
          [DASH_X, 'dashboard', 'NEVER QUERIES THE INDEX'],
        ].map(([x, label, sub]) => (
          <g key={label}>
            <rect x={x - BOX_W / 2} y={SPINE_Y - BOX_H / 2} width={BOX_W} height={BOX_H} className="rvg-box" />
            <text x={x} y={SPINE_Y - 4} className="rvg-t-name">
              {label}
            </text>
            <text x={x} y={SPINE_Y + 12} className="rvg-t-kind">
              {sub}
            </text>
          </g>
        ))}

        <text x={OUT_X - 52} y={SPINE_Y - 6} className="rvg-t-src">
          dashboard
        </text>
        <text x={OUT_X - 52} y={SPINE_Y + 10} className="rvg-t-src">
          chat assistant
        </text>

        <text x={CORE_X - BOX_W / 2} y={SPINE_Y + 46} className="rvg-t-sub">
          STALE-ON-ERROR: LAST GOOD RESPONSE RATHER THAN A 500
        </text>

        {/* ---- divider ---- */}
        <line x1={26} y1={330} x2={W - 26} y2={330} className="rvg-rule" />
        <text x={26} y={322} className="rvg-t-band">
          ABOVE · COLLECTING NUMBERS. RE-RUNNABLE, BECAUSE EVERY KEY IS DERIVED FROM CONTENT.
        </text>
        <text x={26} y={350} className="rvg-t-band">
          BELOW · THE HARD PART. WHICH OF THEM STILL DESCRIBE THIS MACHINE.
        </text>

        {/* ---- register 2: the gate ---- */}
        <text x={26} y={382} className="rvg-t-leg">
          A REFURBISHED TRANSFORMER&apos;S EARLIER READINGS ARE NOT STALE — THEY ARE ABOUT A DIFFERENT MACHINE
        </text>

        {/* cutoff line */}
        <line x1={CUTOFF_X} y1={400} x2={CUTOFF_X} y2={636} className="rvg-cut" />
        <text x={CUTOFF_X} y={394} className="rvg-cutlbl">
          REFURBISHMENT END DATE
        </text>

        {LANES.map(([y, verdict, rule, sub], li) => (
          <g key={verdict}>
            <line x1={AXIS_X0} y1={y} x2={AXIS_X1} y2={y} className="rvg-axis" />
            <text x={26} y={y - 4} className="rvg-t-verd">
              {verdict}
            </text>
            <text x={26} y={y + 10} className="rvg-t-rule">
              {rule}
            </text>
            <text x={26} y={y + 23} className="rvg-t-sub">
              {sub}
            </text>

            {POINTS[li].map(([f, state], pi) => {
              const x = atFrac(f);
              return (
                <g key={`${verdict}:${pi}`}>
                  <circle cx={x} cy={y} r="5" className={state === 'show' ? 'rvg-show' : 'rvg-hid'} />
                  {state === 'cite' ? (
                    <>
                      <line x1={x - 7} y1={y + 7} x2={x + 7} y2={y - 7} className="rvg-strike" />
                      <text x={x} y={y - 14} className="rvg-t-sub" textAnchor="middle">
                        CITATION, NOT A DATE
                      </text>
                    </>
                  ) : null}
                </g>
              );
            })}
          </g>
        ))}

        <text x={AXIS_X0} y={662} className="rvg-t-sub">
          FILLED = SHOWN · HOLLOW = HIDDEN · TIME RUNS LEFT TO RIGHT, MEASURED BY EACH KPI&apos;S OWN TEST DATE, NOT ITS INGEST TIME
        </text>

        <text x={24} y={H - 16} className="rvg-t-leg">
          THE THIRD LANE IS THE JUDGEMENT: WHEN THE FLAGS DO NOT RESOLVE, IT SHOWS — A DATA GAP MUST NOT SILENTLY BLANK A DASHBOARD
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Read from the repo, not proposed. The permissive fallback is a choice,
        not an oversight: hiding on unresolved flags would be equally
        defensible, and an operator cannot distinguish an empty panel from a
        suppressed one either way. The cutoff compares each KPI&apos;s own
        lab-test date rather than its ingest timestamp, because different
        measurements in one run are taken on different days — and that field
        carries a standards citation instead of a date often enough that the
        non-date case is handled explicitly. No ingestion volumes are shown;
        none were measured.
      </figcaption>
    </figure>
  );
}
