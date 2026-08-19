/**
 * The same accommodation data measured three ways, and the four denominators
 * that are still wrong afterwards.
 *
 * Every figure below is transcribed from `ADA_Analysis_Documentation.md` and
 * `ADA_Notebook_Validation_Report.md` — the methodology write-up and the
 * independent recompute that followed it. The employer names in those documents
 * are replaced here with their industry; nothing else is altered.
 *
 * ---- why this diagram has no animation ----------------------------------
 *
 * Nothing in this analysis happens in sequence. There is no scan, no queue, no
 * arrival of work over time — it is one aggregation read three ways. Animating
 * a morph between the panels would be decoration rather than representation, so
 * the figure is static. The project's own rule is that motion must mean
 * something; the honest application of that rule here is to have none.
 *
 * ---- register 1: the same cohorts, three measurements -------------------
 *
 * Panel A is raw item share, which is what a pivot table gives you by default:
 * 800 of 925 accommodation items came from women, 86.5%. Read alone it says
 * women request accommodations roughly six times as often as men.
 *
 * Panel B divides each cohort by *its own* population — 4,473 women and 1,012
 * men — rather than by the combined total. 17.89 vs 12.35 items per 100. The
 * gap is real and it is about 1.4x, not 6x. Almost the whole of panel A was the
 * workforce being 81.5% female.
 *
 * That normalisation is the analysis's central design decision, and it is
 * applied consistently: whenever a chart splits by gender, the numerator and
 * the denominator are filtered to the same gender, the same segment and the
 * same period.
 *
 * Panel C is why it matters beyond shrinking a number. Job restructuring runs
 * 5.14 per 100 for men against 1.05 for women — the per-capita direction is the
 * opposite of the raw counts, and no amount of staring at panel A would show it.
 * The same happens at title level: one licensed sales title reads 14.19 (M) vs
 * 2.80 (F) despite holding four times more women.
 *
 * MIN_POP = 10 is drawn as a floor because it is load-bearing rather than
 * cosmetic. A (segment x gender) cell with three employees and three items is a
 * rate of 100 per 100; suppressed in the chart, still printed in the audit
 * table underneath.
 *
 * ---- register 2: the arithmetic is right, the labels are not ------------
 *
 * The validation pass recomputed every published figure independently from the
 * cleaned feeds. All 39 checked numbers reproduced exactly — not one incidence
 * count, population or ratio off by a single unit or 0.01. Quarterly sums equal
 * yearly sums; H1 + H2 item counts equal full-year counts on every row.
 *
 * What did not survive was the meaning of four of them, and this is the register
 * the diagram exists for:
 *
 *   1. NUMERATOR GRAIN. "# of Acco Item incidences" counts task *rows*, not
 *      accommodation requests. 3,706 task rows resolve to 262 distinct
 *      accommodations — median 11 rows each, max 84. The banking client's 2025
 *      figure is 524 rows against 42 actual accommodations. If "incidence" was
 *      meant to be "a request was raised", the headline metric overstates by
 *      roughly 12x on that row and 10-25x depending on the year.
 *   2. POPULATION DEFINITION. The denominator is employees whose demographic
 *      record was *created* in the period — an HRIS export timestamp, not
 *      employment. Population therefore moves with export cadence rather than
 *      headcount.
 *   3. UNWEIGHTED AVERAGE. The reference lines average two client ratios with
 *      equal weight: 83.9 / 40.94 / 64.91. Population-weighted, the same three
 *      figures are 57.97 / 31.58 / 48.62. A client with a seventh of the
 *      headcount is pulling the "average" up by 26 points.
 *   4. PARTIAL PERIODS. The retail client has no records before 2024-08, and
 *      the snapshot's last task is 2026-03-19. Both years are plotted beside
 *      full ones without a coverage footnote.
 *
 * The three per-100 figures in register 1 are unaffected by all four — they are
 * item-level, all-time and same-gender on both sides of the division. The
 * defects are in the year-wise and semiannual tables. The drawing keeps them in
 * separate registers for exactly that reason, and the caption says so rather
 * than leaving a reader to assume the whole analysis is compromised.
 */

const W = 1240;
const H = 710;

/* ---- register 1: three panels ------------------------------------------ */

const P_Y = 96;
const P_H = 178;

/** Panel geometry. Three equal columns with a gutter. */
const P_W = 372;
const P_GAP = 26;
const P_X = [28, 28 + P_W + P_GAP, 28 + 2 * (P_W + P_GAP)];

const BAR_H = 30;
const BAR_X0 = 96;
const BAR_MAX = 250;

/**
 * [cohort, value, label under the bar]. One entry per bar, per panel.
 * `scale` is the value the bar's full width represents, chosen per panel so
 * each panel is readable — which is precisely why the panels must not be read
 * against each other by length. The numbers are printed for that reason.
 */
const PANELS = [
  {
    key: 'raw',
    tag: 'A',
    title: 'RAW ITEM SHARE',
    sub: 'what a pivot table gives you',
    unit: '% of items',
    scale: 100,
    bars: [
      ['FEMALE', 86.5, '800 items'],
      ['MALE', 13.5, '125 items'],
    ],
    read: 'READS AS 6× — AND IS MOSTLY HEADCOUNT',
    tone: 'flag',
  },
  {
    key: 'per100',
    tag: 'B',
    title: 'PER 100 OF OWN-GENDER POPULATION',
    sub: 'numerator and denominator, same cohort',
    unit: 'items / 100',
    scale: 20,
    bars: [
      ['FEMALE', 17.89, 'pop 4,473'],
      ['MALE', 12.35, 'pop 1,012'],
    ],
    read: 'THE REAL GAP IS ABOUT 1.4×',
    tone: 'good',
  },
  {
    key: 'slice',
    tag: 'C',
    title: 'ONE SLICE — JOB RESTRUCTURING',
    sub: 'per 100 of own-gender population',
    unit: 'items / 100',
    scale: 6,
    bars: [
      ['FEMALE', 1.05, ''],
      ['MALE', 5.14, ''],
    ],
    read: 'PER CAPITA, THE DIRECTION INVERTS',
    tone: 'note',
  },
];

/* ---- register 2: the ledger of what the labels claim ------------------- */

const L_Y = 396;
const L_X = 28;
const L_ROW = 52;
const L_W = 1184;

/**
 * [heading, what the label says, what the number actually is, the gap].
 * All four are from the validation report; none is inferred.
 */
const LEDGER = [
  [
    'NUMERATOR GRAIN',
    '“# of Acco Item incidences”',
    '3,706 task rows → 262 distinct accommodations · median 11 rows each, max 84',
    'BANKING 2025: 524 ROWS vs 42 ACCOMMODATIONS — c.12× OVERSTATED',
  ],
  [
    'POPULATION DEFINITION',
    '“Population”',
    'employees whose demographic record was CREATED in the period — an HRIS export timestamp',
    'MOVES WITH EXPORT CADENCE, NOT HEADCOUNT',
  ],
  [
    'UNWEIGHTED AVERAGE',
    '“Avg Jan–Jun / Jul–Dec / Full-Year”',
    'simple mean of two client ratios, equal weight regardless of headcount',
    '83.9 / 40.94 / 64.91  →  WEIGHTED 57.97 / 31.58 / 48.62',
  ],
  [
    'PARTIAL PERIODS',
    'plotted beside full years',
    'retail client has no records before 2024-08 · snapshot’s last task is 2026-03-19',
    'NO COVERAGE FOOTNOTE ON EITHER',
  ],
];

export default function PerCapitaRateNormalisation() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="pcr-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="Two registers about an accommodation-analytics engagement. The first register shows the same two cohorts measured three ways. Panel A, raw item share: women account for 86.5 per cent of accommodation items, 800 of them, against men's 13.5 per cent, 125 items — which reads as women requesting accommodations about six times as often. Panel B divides each cohort by its own population instead, 4,473 women and 1,012 men, giving 17.89 versus 12.35 items per hundred: the real gap is about 1.4 times, so almost all of panel A was simply the workforce being 81.5 per cent female. Panel C shows why this matters beyond shrinking a number — for job restructuring the per-capita rates are 1.05 for women and 5.14 for men, so the direction of the difference inverts relative to the raw counts. A floor rule is noted: any segment-by-gender cell with fewer than ten employees is suppressed from the chart, because three items in a three-person group would otherwise plot as a rate of one hundred per hundred. The second register is a ledger of what an independent recompute found. All thirty-nine published numbers reproduced exactly — no count, population or ratio differed by a single unit — but four labels do not mean what they say. First, the headline incidence metric counts task rows rather than accommodation requests: 3,706 task rows resolve to 262 distinct accommodations, a median of eleven rows each, so the banking client's 2025 figure of 524 is really 42 accommodations, overstating by about twelve times. Second, population counts employees whose demographic record was created in the period, an HR export timestamp rather than employment, so it moves with export cadence rather than headcount. Third, the average reference lines are a simple mean of two client ratios with equal weight: 83.9, 40.94 and 64.91, where the population-weighted figures are 57.97, 31.58 and 48.62. Fourth, two partial periods are plotted beside full years without a coverage footnote — the retail client has no records before August 2024, and the snapshot's last task is 19 March 2026. The per-hundred figures in the first register are unaffected by all four, because they are item-level, all-time, and use the same cohort on both sides of the division."
      >
        <style>{`
          .pcr-svg text { font-family: var(--font-data); }

          .pcr-panel  { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }
          .pcr-row    { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }

          .pcr-bar    { fill: var(--color-ch-soft); stroke: var(--color-ch); stroke-width: 1; }
          .pcr-bar-2  { fill: var(--color-paper-3); stroke: var(--color-ink-3); stroke-width: 1; }
          .pcr-track  { fill: none; stroke: var(--color-rule); stroke-width: 1; stroke-dasharray: 2 3; }

          .pcr-rule   { stroke: var(--color-rule); stroke-width: 1; }
          .pcr-floor  { stroke: var(--color-flag); stroke-width: 1.25; stroke-dasharray: 3 3; }

          .pcr-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .pcr-t-leg  { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }
          .pcr-t-tag  { fill: var(--color-ink-3); font-size: 9px; letter-spacing: .1em; }
          .pcr-t-name { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .03em; }
          .pcr-t-sub  { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .05em; }
          .pcr-t-lane { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .08em; text-anchor: end; }
          .pcr-t-val  { fill: var(--color-ink); font-size: 12px; letter-spacing: .03em; }
          .pcr-t-den  { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .05em; }
          .pcr-t-note { fill: var(--color-ch); font-size: 8.5px; letter-spacing: .07em; }
          .pcr-t-flag { fill: var(--color-flag); font-size: 8.5px; letter-spacing: .07em; }
          .pcr-t-good { fill: var(--color-good); font-size: 8.5px; letter-spacing: .07em; }
          .pcr-t-says { fill: var(--color-ink); font-size: 10px; letter-spacing: .03em; }
          .pcr-t-is   { fill: var(--color-ink-3); font-size: 9px; letter-spacing: .03em; }
          .pcr-t-sum  { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .04em; }
        `}</style>

        <text x={24} y={28} className="pcr-t-head">
          THE SAME 925 ITEMS, MEASURED THREE WAYS · THEN WHAT THE LABELS CLAIM
        </text>
        <text x={24} y={44} className="pcr-t-leg">
          bar length is scaled per panel — read the printed figures, not the lengths, across panels
        </text>

        {/* ============ register 1: three panels ======================== */}
        <text x={24} y={P_Y - 14} className="pcr-t-head">
          1 · NORMALISATION — DIVIDE EACH COHORT BY ITS OWN POPULATION
        </text>

        {PANELS.map((p, pi) => {
          const x = P_X[pi];
          return (
            <g key={`p:${p.key}`}>
              <rect x={x} y={P_Y} width={P_W} height={P_H} className="pcr-panel" />
              <text x={x + 12} y={P_Y + 19} className="pcr-t-tag">
                {p.tag}
              </text>
              <text x={x + 30} y={P_Y + 19} className="pcr-t-name">
                {p.title}
              </text>
              <text x={x + 30} y={P_Y + 32} className="pcr-t-sub">
                {p.sub}
              </text>
              <line
                x1={x + 12}
                y1={P_Y + 42}
                x2={x + P_W - 12}
                y2={P_Y + 42}
                className="pcr-rule"
              />

              {p.bars.map(([cohort, value, den], bi) => {
                const by = P_Y + 58 + bi * (BAR_H + 22);
                const w = Math.max(2, (value / p.scale) * BAR_MAX);
                return (
                  <g key={`b:${p.key}:${cohort}`}>
                    <text x={x + BAR_X0 - 10} y={by + 19} className="pcr-t-lane">
                      {cohort}
                    </text>
                    {/* The dashed track is the panel's own full scale, so a
                        short bar is legibly short rather than ambiguous. */}
                    <rect
                      x={x + BAR_X0}
                      y={by}
                      width={BAR_MAX}
                      height={BAR_H}
                      className="pcr-track"
                    />
                    <rect
                      x={x + BAR_X0}
                      y={by}
                      width={w}
                      height={BAR_H}
                      className={bi === 0 ? 'pcr-bar' : 'pcr-bar-2'}
                    />
                    <text x={x + BAR_X0 + 8} y={by + 20} className="pcr-t-val">
                      {p.key === 'raw' ? `${value}%` : value.toFixed(2)}
                    </text>
                    {/* Under the bar, not inside it — a long bar would otherwise
                        run underneath this label and make it unreadable. */}
                    {den ? (
                      <text
                        x={x + BAR_X0 + BAR_MAX}
                        y={by + BAR_H + 11}
                        className="pcr-t-den"
                        textAnchor="end"
                      >
                        {den}
                      </text>
                    ) : null}
                  </g>
                );
              })}

              <text x={x + 12} y={P_Y + P_H - 12} className={`pcr-t-${p.tone}`}>
                {p.read}
              </text>
            </g>
          );
        })}

        {/* the suppression floor, stated once — it applies to B and C */}
        <line
          x1={P_X[1]}
          y1={P_Y + P_H + 14}
          x2={P_X[2] + P_W}
          y2={P_Y + P_H + 14}
          className="pcr-floor"
        />
        <text x={P_X[1]} y={P_Y + P_H + 28} className="pcr-t-flag">
          MIN_POP = 10 — A (SEGMENT × GENDER) CELL UNDER TEN EMPLOYEES IS SUPPRESSED
        </text>
        <text x={P_X[1]} y={P_Y + P_H + 40} className="pcr-t-leg">
          THREE ITEMS IN A THREE-PERSON GROUP WOULD OTHERWISE PLOT AS 100 PER 100.
          THE FIGURE STAYS IN THE AUDIT TABLE.
        </text>
        <text x={28} y={P_Y + P_H + 28} className="pcr-t-leg">
          WORKFORCE IS 81.5% FEMALE —
        </text>
        <text x={28} y={P_Y + P_H + 40} className="pcr-t-leg">
          WHICH IS ALMOST ALL OF PANEL A.
        </text>

        {/* ============ register 2: the ledger ========================== */}
        <text x={24} y={L_Y - 30} className="pcr-t-head">
          2 · THE ARITHMETIC RECOMPUTED EXACTLY — THE LABELS DID NOT
        </text>
        <text x={24} y={L_Y - 15} className="pcr-t-leg">
          39 of 39 published figures reproduced independently from the cleaned feeds, to 0.01 ┊
          four of them do not mean what they are called
        </text>

        {LEDGER.map(([heading, says, is, gap], i) => {
          const y = L_Y + i * L_ROW;
          return (
            <g key={`l:${heading}`}>
              <rect x={L_X} y={y} width={L_W} height={L_ROW - 6} className="pcr-row" />
              <text x={L_X + 10} y={y + 17} className="pcr-t-tag">
                {i + 1} · {heading}
              </text>
              <text x={L_X + 10} y={y + 34} className="pcr-t-says">
                SAYS {says}
              </text>
              {/* The SAYS column runs to ~330px at 10px, so the IS column
                  starts clear of its longest label rather than on top of it. */}
              <text x={L_X + 348} y={y + 17} className="pcr-t-is">
                IS {is}
              </text>
              <text x={L_X + 348} y={y + 34} className="pcr-t-flag">
                {gap}
              </text>
            </g>
          );
        })}

        {/* Stacked rather than two columns — the left line is wider than the
            gutter, so a right-hand block here collides with it. */}
        <text x={L_X} y={L_Y + LEDGER.length * L_ROW + 14} className="pcr-t-sum">
          All four sit in the year-wise and semiannual tables — not in register 1
        </text>
        <text x={L_X} y={L_Y + LEDGER.length * L_ROW + 28} className="pcr-t-leg">
          THE PER-100 FIGURES ABOVE ARE ITEM-LEVEL, ALL-TIME, AND SAME-COHORT ON BOTH SIDES OF THE
          DIVISION, SO NONE OF THE FOUR REACHES THEM.
        </text>

        {/* the gaps the source feed cannot fill — drawn, not omitted */}
        <text x={L_X} y={L_Y + LEDGER.length * L_ROW + 52} className="pcr-t-note">
          AND FOUR MORE ANALYSES SHIP AS SCAFFOLDS THAT SAY SO
        </text>
        <text x={L_X} y={L_Y + LEDGER.length * L_ROW + 66} className="pcr-t-leg">
          SALARY · TENURE · CITY · EXEMPT CLASS — THE FEED CARRIES NO SUCH COLUMN, SO THE CELL PRINTS
          “SKIPPED — NEEDS COLUMN X” RATHER THAN DRAWING SOMETHING. ALL FOUR VERIFIED AGAINST
          SYNTHETIC DATA.
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Every figure is transcribed from the engagement’s methodology document and
        the independent validation pass that followed it; employer names are
        replaced by their industry and nothing else is altered. Bar lengths are
        scaled per panel and are not comparable across panels — that is what the
        printed numbers are for. The four ledger rows are definitional findings,
        not arithmetic ones: the recompute matched all 39 published figures
        exactly, which is why the ledger is about what the labels claim rather
        than about wrong sums. None of the four affects the per-100 rates in
        register 1, and the figure is drawn in two registers so that distinction
        survives a glance.
      </figcaption>
    </figure>
  );
}
