/**
 * Four spreadsheets in, two styled workbooks out — and the two places where that
 * sentence hides all the work.
 *
 * Every box, count, threshold and row number below is read off
 * `jackson_intermittent_pipeline.py` (2,128 lines), the desktop `app.py` that
 * drives it, the client's transcribed rules in `CONTEXT.md`, and the parity
 * JSON the pipeline itself writes. Nothing here is a plausible-looking guess.
 *
 * The drawing argues three things, in three registers:
 *
 *   1. The analysis is only possible at a grain the source data does not have.
 *   2. One severity formula is applied to two units. It is right for hours and
 *      two days too generous for days.
 *   3. The output workbook is not written. It is inherited.
 *
 * ---- register 1: the grain ladder ---------------------------------------
 *
 * The four feeds and their row counts are the measured 2026-06 snapshot
 * (CONTEXT.md §"Source files"): HRDATA 13,888 · Daily_Absence 14,873 ·
 * Leave_Details 1,738 · work_schedule 6,947. Feeds are drawn as stacked-sheet
 * shapes and computed frames as plain boxes, because the difference is real —
 * a feed is a workbook someone uploads, a frame is something this code derives.
 *
 * `build_daily_absence_detail` joins all four down to one row per absence day,
 * which is the grain at which "how many *events* was that?" can finally be
 * asked. Event counting is not row counting: per CONTEXT.md, an isolated
 * absence is one event, but a continuous run longer than the certified
 * per-event duration splits into several — certified 3 D and six consecutive
 * days taken is 2 events, opening on day 1 and again on day 4. The stride strip
 * draws exactly that example.
 *
 * `build_period_violations` then buckets those days by the certification's own
 * window (`_period_bucket_start`) and sums time and events per bucket. Two
 * filters on the way in are worth drawing because they silently shrink scope:
 * only APPROVED absences count, and only single-unit certifications
 * (`Certified Period == 1`) are analysed at all — "2 events per 2 M" is
 * dropped, deliberately, to match the reference workbook (lines 588-591).
 *
 * ---- register 2: the threshold ------------------------------------------
 *
 * This is the register the diagram exists for. Three lines of source:
 *
 *   L394  Certified Duration  = # Certified Events * Duration Period
 *   L634  TIME_YELLOW_LIMIT   = Certified Duration + (2 * Duration Period)
 *   L646  event yellow        = TOTAL_ROLLED_EVENTS <= # Certified Events + 2
 *
 * The client's rule, transcribed in CONTEXT.md, is "Yellow = exceeds by 2 or
 * less, Red = more than 2 over", with hours called out as an explicit
 * exception: "Hours: NOT +2/+3. Yellow = cert + (durationHrs x 2)."
 *
 * Line 634 applies the hours form to both units. Check it against the two
 * worked examples the client gave:
 *
 *   7 events/year x 8 H  ->  cert 56 H.  Spec yellow limit 56 + 8*2 = 72 H.
 *                            Code: 56 + 2*8 = 72 H.   AGREES.
 *   6 events/year x 2 D  ->  cert 12 D.  Spec yellow limit 12 + 2   = 14 D.
 *                            Code: 12 + 2*2 = 16 D.   TWO DAYS TOO WIDE.
 *
 * So a days-certified leave landing on 15 or 16 days against a 12-day
 * allowance is reported Yellow where the client's rule says Red. The bands are
 * drawn to scale and the disputed span is hatched. The divergence appears only
 * when the certified duration per event is more than one day — at 1 D the two
 * formulas coincide, which is why it survives casual checking.
 *
 * This is derived by reading the code against the transcribed spec. It has not
 * been demonstrated by a run that produced a wrong cell, and the caption says
 * so.
 *
 * The event band needs no such caveat: `+ 2` is flat, matches the spec, and is
 * drawn as agreeing.
 *
 * ---- register 3: the inherited workbook ---------------------------------
 *
 * `write_outputs` (L1884) does not build a spreadsheet. It `shutil.copy2`s the
 * analyst's own styled workbook and fills values into the copy, so every
 * border, fill, number format, column width, autofilter and conditional format
 * arrives 1:1 without being re-specified. Consequences, all transcribed:
 *
 *   - The 12 period/flag sheets are live PivotTables. They are NOT pasted over;
 *     only their source sheet is filled, and they rebuild on open via
 *     refreshOnLoad (L1924-1941). Pasting static values would cap them at the
 *     template's old extent.
 *   - The violation formulas on those sheets are extended to this month's leaf
 *     count (`_extend_period_formulas`), because the pivot grows.
 *   - openpyxl drops <col> widths and leaves filter and conditional-format
 *     ranges pointing at the old extent, so the saved file is passed through
 *     `_postprocess_xml` which repairs them in the raw XML (L1966-1968).
 *   - "All combined" opens with two filters pre-applied and non-matching rows
 *     hidden, so the analyst lands on open leaves with violations (L1954-1965).
 *
 * The parity ledger is the pipeline's own `intermittent_fmla_validation_*.json`
 * from the run that had the reference workbooks present: four of six checked
 * sheets reproduce the reference row count exactly, Summary by Position is 3
 * rows short (1,019 vs 1,022) and Utilization by Emp is 1 short (827 vs 828).
 * The 11-vs-13 column gap is trailing blank columns in the reference and is
 * not counted as a mismatch.
 *
 * The unfilled ledger row is the honest part: the monthly production run has no
 * reference workbook to compare against, so `build_validation` returns
 * `{"analysis": {}, "utilization": {}}` and the run self-checks nothing. That is
 * drawn as an empty slot rather than omitted.
 *
 * ---- motion --------------------------------------------------------------
 *
 * One marker walks the days ruler, because the pipeline really does accumulate
 * absence time day by day within a bucket. Under prefers-reduced-motion it does
 * not slow down, it stops, parked inside the disputed band — the one span on the
 * figure worth looking at.
 */

const W = 1240;
const H = 790;

/* ---- register 1: feeds -> daily grain -> buckets ------------------------ */

/** The 2026-06 snapshot, per CONTEXT.md. [label, rows, key column drawn]. */
const FEEDS = [
  ['HRDATA', '13,888', 'EMPLOYEEID'],
  ['Daily_Absence', '14,873', 'ABSENCE_DATE'],
  ['Leave_Details', '1,738', 'FREQUENCY'],
  ['work_schedule', '6,947', 'SUN..SAT_HOURS'],
];

const FEED_X = 28;
const FEED_Y = 74;
const FEED_W = 168;
const FEED_H = 34;
const FEED_GAP = 10;

const GRAIN_X = 268;
const BUCKET_X = 520;

/** The six period sheets actually built: certification window x duration unit. */
const COMBOS = [
  ['1-Year', 'Days'],
  ['1-Year', 'Hrs'],
  ['1-Month', 'Days'],
  ['1-Month', 'Hrs'],
  ['1-Week', 'Days'],
  ['1-Week', 'Hrs'],
];

/* ---- the event-stride strip -------------------------------------------- */

const STRIDE_X = 812;
const STRIDE_Y = 108;
const STRIDE_CELL = 26;
/** Certified 3 D, six consecutive days taken. Events open on day 1 and day 4. */
const STRIDE_CERT = 3;
const STRIDE_DAYS = 6;

/* ---- register 2: the two rulers ---------------------------------------- */

const RULER_X = 196;
const RULER_W = 780;

const DAYS_Y = 366;
const HRS_Y = 492;
const RULER_H = 30;

/** 6 events/year x 2 D. Both numbers come from the client's own example. */
const D_MAX = 20;
const D_CERT = 12;
const D_SPEC = 14; // cert + 2            — the client's rule
const D_CODE = 16; // cert + 2*duration   — line 634

/** 7 events/year x 8 H. Here the two formulas land on the same number. */
const H_MAX = 88;
const H_CERT = 56;
const H_LIMIT = 72; // 56 + 8*2, spec and code agree

const dx = (v) => RULER_X + (v / D_MAX) * RULER_W;
const hx = (v) => RULER_X + (v / H_MAX) * RULER_W;

/** Where the walking marker parks when motion is suppressed: mid-dispute. */
const PARK = dx(15) - RULER_X;

/* ---- register 3: assembly + parity ------------------------------------- */

const ASM_Y = 596;
const ASM_X = 28;
const ASM_W = 194;
const ASM_H = 38;
const ASM_GAP = 5;

/** The write path, in the order write_outputs performs it. */
const ASSEMBLY = [
  ['COPY TEMPLATE', 'shutil.copy2 of the styled workbook'],
  ['FILL SOURCES', 'non-pivot sheets only'],
  ['EXTEND FORMULAS', 'to this month’s leaf count'],
  ['REPAIR XML', 'widths · filters · CF ranges'],
];

/**
 * The pipeline's own validation JSON. [sheet, generated, reference].
 * A null pair is a row it cannot check — see the header comment.
 */
const PARITY = [
  ['Summary by Location', 10, 10],
  ['Summary by Add_Data03', 25, 25],
  ['Summary by Department', 669, 669],
  ['Leave Details', 853, 853],
  ['Summary by Position', 1019, 1022],
  ['Utilization by Emp', 827, 828],
  ['MONTHLY PRODUCTION RUN', null, null],
];

const PAR_X = 660;
const PAR_ROW = 22;

const MATCHED = PARITY.filter((r) => r[1] !== null && r[1] === r[2]).length;

export default function LeaveRefreshPipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="lrp-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="Three registers describing a monthly intermittent-leave reporting pipeline. The first register shows four uploaded spreadsheet feeds — an HR extract of 13,888 rows, a daily-absence extract of 14,873 rows, a leave-details extract of 1,738 rows and a work-schedule extract of 6,947 rows — joined down to one row per absence day, then bucketed into six period sheets covering one-year, one-month and one-week certification windows in either days or hours. Two filters narrow the scope on the way in: only approved absences, and only single-unit certifications, so a frequency such as two events per two months is dropped entirely. Beside it a strip shows event counting by stride: with a certified duration of three days, six consecutive absence days count as two events, opening on day one and again on day four, not as six events and not as one. The second register draws the severity threshold to scale on two rulers. On the days ruler, a certification of six events per year at two days each allows twelve days; the client's rule puts the yellow band at fourteen days and red beyond it, but the code computes the yellow limit as the certified duration plus twice the per-event duration, which gives sixteen. The two-day span between fourteen and sixteen is hatched: a leave landing there is reported yellow where the rule says red. On the hours ruler, a certification of seven events per year at eight hours each allows fifty-six hours, and the same formula gives seventy-two, which is exactly what the client's rule specifies, so the two agree. One formula, two units, correct in one. The divergence only appears when the certified duration per event exceeds one day. The third register shows that the output workbook is inherited rather than written: the analyst's own styled workbook is byte-copied, only non-pivot source sheets are filled, violation formulas are extended to the month's row count, live PivotTables rebuild when the file is opened, and the saved file is passed through a raw-XML repair pass because the spreadsheet library drops column widths and leaves filter and conditional-format ranges pointing at the old extent. Beside it a parity ledger lists six sheets checked against the analyst's reference workbook: four reproduce the row count exactly, one is three rows short and one is a single row short. A seventh row is drawn as an empty dashed slot, because the monthly production run has no reference workbook present and therefore self-checks nothing."
      >
        <style>{`
          .lrp-svg text { font-family: var(--font-data); }

          .lrp-feed   { fill: var(--color-paper-3); stroke: var(--color-rule); stroke-width: 1; }
          .lrp-box    { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }
          .lrp-box-on { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .lrp-box-em { fill: var(--color-ch-soft); stroke: var(--color-ch); stroke-width: 1; }
          .lrp-slot   {
            fill: none; stroke: var(--color-ink-3); stroke-width: 1;
            stroke-dasharray: 2 4; opacity: .5;
          }

          .lrp-rule   { stroke: var(--color-rule); stroke-width: 1; }
          .lrp-lead   { stroke: var(--color-ink-3); stroke-width: 1; opacity: .5; }
          .lrp-mark   { stroke: var(--color-ink); stroke-width: 1.25; }
          .lrp-cut    { stroke: var(--color-flag); stroke-width: 1.25; }
          .lrp-evt    { fill: none; stroke: var(--color-ch); stroke-width: 1.25; }

          .lrp-band-ok  { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }
          .lrp-band-y   { fill: var(--color-ch-soft); stroke: var(--color-ch); stroke-width: 1; }
          .lrp-band-r   { fill: var(--color-flag-soft); stroke: var(--color-flag); stroke-width: 1; }
          .lrp-band-x   { fill: url(#lrp-hatch); stroke: var(--color-flag); stroke-width: 1.25; }

          .lrp-hatch-l  { stroke: var(--color-flag); stroke-width: 1; opacity: .55; }

          .lrp-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .lrp-t-leg  { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }
          .lrp-t-lane { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .09em; text-anchor: end; }
          .lrp-t-name { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .03em; }
          .lrp-t-sub  { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .05em; }
          .lrp-t-num  { fill: var(--color-ch); font-size: 10px; letter-spacing: .04em; text-anchor: end; }
          .lrp-t-note { fill: var(--color-ch); font-size: 8.5px; letter-spacing: .07em; }
          .lrp-t-flag { fill: var(--color-flag); font-size: 8.5px; letter-spacing: .07em; }
          .lrp-t-good { fill: var(--color-good); font-size: 8.5px; letter-spacing: .07em; }
          .lrp-t-tick { fill: var(--color-ink-3); font-size: 8.5px; text-anchor: middle; }
          .lrp-t-sum  { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .04em; }
          .lrp-t-cell { fill: var(--color-ink); font-size: 9.5px; letter-spacing: .03em; }
          .lrp-t-dim  { fill: var(--color-ink-3); font-size: 9.5px; letter-spacing: .03em; }
          .lrp-t-sev  { fill: var(--color-ink); font-size: 11px; letter-spacing: .06em; text-anchor: middle; }

          .lrp-head {
            fill: var(--color-ch); opacity: .9;
            animation: lrp-walk 9s linear infinite;
          }
          @keyframes lrp-walk {
            from { transform: translateX(0); }
            to   { transform: translateX(${RULER_W}px); }
          }

          /* Stops dead, parked inside the disputed span. */
          @media (prefers-reduced-motion: reduce) {
            .lrp-head { animation: none; transform: translateX(${PARK}px); }
          }
        `}</style>

        <defs>
          <pattern
            id="lrp-hatch"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" className="lrp-hatch-l" />
          </pattern>
        </defs>

        <text x={24} y={28} className="lrp-t-head">
          ONE UPLOAD A MONTH · AND THE THREE THINGS BETWEEN IT AND A SHAREABLE WORKBOOK
        </text>
        <text x={24} y={44} className="lrp-t-leg">
          stacked edge = a workbook someone uploads ┊ plain box = a frame this code derives
        </text>

        {/* ============ register 1: the grain ladder ===================== */}
        <text x={24} y={FEED_Y - 12} className="lrp-t-head">
          1 · FOUR FEEDS → ONE ABSENCE DAY → SIX PERIOD SHEETS
        </text>

        {FEEDS.map(([name, rows, key], i) => {
          const y = FEED_Y + i * (FEED_H + FEED_GAP);
          return (
            <g key={`f:${name}`}>
              {/* The offset copy behind each feed is the "stacked sheet" cue. */}
              <rect x={FEED_X + 3} y={y - 3} width={FEED_W} height={FEED_H} className="lrp-feed" />
              <rect x={FEED_X} y={y} width={FEED_W} height={FEED_H} className="lrp-feed" />
              <text x={FEED_X + 9} y={y + 15} className="lrp-t-name">
                {name}
              </text>
              <text x={FEED_X + 9} y={y + 27} className="lrp-t-sub">
                {key}
              </text>
              <text x={FEED_X + FEED_W - 9} y={y + 15} className="lrp-t-num">
                {rows}
              </text>
              <line
                x1={FEED_X + FEED_W + 6}
                y1={y + FEED_H / 2}
                x2={GRAIN_X - 6}
                y2={y + FEED_H / 2}
                className="lrp-lead"
              />
            </g>
          );
        })}

        {/* the daily grain */}
        <rect x={GRAIN_X} y={FEED_Y + 24} width={186} height={64} className="lrp-box-em" />
        <text x={GRAIN_X + 10} y={FEED_Y + 44} className="lrp-t-name">
          Daily Absence Detail
        </text>
        <text x={GRAIN_X + 10} y={FEED_Y + 58} className="lrp-t-sub">
          one row per absence DAY
        </text>
        <text x={GRAIN_X + 10} y={FEED_Y + 72} className="lrp-t-sub">
          + # of Events, by stride
        </text>
        <text x={GRAIN_X + 10} y={FEED_Y + 84} className="lrp-t-sub">
          14,874 rows × 34 cols
        </text>

        <line
          x1={GRAIN_X + 192}
          y1={FEED_Y + 56}
          x2={BUCKET_X - 6}
          y2={FEED_Y + 56}
          className="lrp-mark"
        />

        {/* The two narrowing filters, drawn because they shrink scope silently.
            On its own band beneath the register — the gutters inside it are all
            too narrow, and this is the note most easily missed. */}
        <text x={FEED_X} y={FEED_Y + 194} className="lrp-t-flag">
          ON THE WAY IN: APPROVED ABSENCES ONLY, AND Certified Period == 1
        </text>
        <text x={FEED_X} y={FEED_Y + 208} className="lrp-t-leg">
          SO “2 EVENTS PER 2 M” IS DROPPED FROM THE VIOLATION ANALYSIS ENTIRELY, TO MATCH THE
          REFERENCE — AND AN EXCLUDED LEAVE LOOKS IDENTICAL TO A COMPLIANT ONE.
        </text>

        {/* the six period sheets */}
        {COMBOS.map(([win, unit], i) => {
          const y = FEED_Y + i * 27;
          return (
            <g key={`c:${win}${unit}`}>
              <rect x={BUCKET_X} y={y} width={132} height={22} className="lrp-box-on" />
              <text x={BUCKET_X + 8} y={y + 15} className="lrp-t-cell">
                {win} ({unit})
              </text>
            </g>
          );
        })}
        <text x={BUCKET_X} y={FEED_Y + 6 * 27 + 14} className="lrp-t-leg">
          + 6 HIDDEN “FLAG” SHEETS
        </text>

        {/* the event-stride strip */}
        <text x={STRIDE_X} y={FEED_Y - 12} className="lrp-t-head">
          EVENTS ARE NOT DAYS
        </text>
        <text x={STRIDE_X} y={STRIDE_Y - 26} className="lrp-t-leg">
          CERTIFIED DURATION 3 D · SIX CONSECUTIVE DAYS TAKEN
        </text>
        {Array.from({ length: STRIDE_DAYS }, (_, i) => {
          const opens = i % STRIDE_CERT === 0;
          return (
            <g key={`s:${i}`}>
              <rect
                x={STRIDE_X + i * STRIDE_CELL}
                y={STRIDE_Y}
                width={STRIDE_CELL}
                height={STRIDE_CELL}
                className={opens ? 'lrp-box-em' : 'lrp-box'}
              />
              <text
                x={STRIDE_X + i * STRIDE_CELL + STRIDE_CELL / 2}
                y={STRIDE_Y + 17}
                className="lrp-t-tick"
              >
                {i + 1}
              </text>
              {opens ? (
                <text
                  x={STRIDE_X + i * STRIDE_CELL + STRIDE_CELL / 2}
                  y={STRIDE_Y + STRIDE_CELL + 13}
                  className="lrp-t-tick"
                >
                  ▲
                </text>
              ) : null}
            </g>
          );
        })}
        <text x={STRIDE_X} y={STRIDE_Y + STRIDE_CELL + 32} className="lrp-t-note">
          2 EVENTS — NOT 6, NOT 1
        </text>
        <text x={STRIDE_X} y={STRIDE_Y + STRIDE_CELL + 46} className="lrp-t-leg">
          A NEW EVENT OPENS EVERY 3rd DAY OF A CONTINUOUS RUN
        </text>
        <text x={STRIDE_X} y={STRIDE_Y + STRIDE_CELL + 66} className="lrp-t-leg">
          THE MANUAL PROCESS COUNTED THIS BY EYE, PER LEAVE,
        </text>
        <text x={STRIDE_X} y={STRIDE_Y + STRIDE_CELL + 78} className="lrp-t-leg">
          ACROSS 1,738 LEAVES, EVERY MONTH.
        </text>

        {/* ============ register 2: the threshold ======================== */}
        <text x={24} y={DAYS_Y - 44} className="lrp-t-head">
          2 · ONE SEVERITY FORMULA, TWO UNITS — CORRECT IN ONE OF THEM
        </text>
        <text x={24} y={DAYS_Y - 28} className="lrp-t-leg">
          L634 TIME_YELLOW_LIMIT = Certified Duration + (2 × Duration Period) ┊ drawn to scale
        </text>

        {/* ---- days ruler: where the two rules disagree ---- */}
        <text x={RULER_X - 16} y={DAYS_Y + 12} className="lrp-t-lane">
          DAYS
        </text>
        <text x={RULER_X - 16} y={DAYS_Y + 24} className="lrp-t-lane">
          6 evt/yr × 2 D
        </text>

        <rect
          x={dx(0)}
          y={DAYS_Y}
          width={dx(D_CERT) - dx(0)}
          height={RULER_H}
          className="lrp-band-ok"
        />
        <rect
          x={dx(D_CERT)}
          y={DAYS_Y}
          width={dx(D_SPEC) - dx(D_CERT)}
          height={RULER_H}
          className="lrp-band-y"
        />
        <rect
          x={dx(D_SPEC)}
          y={DAYS_Y}
          width={dx(D_CODE) - dx(D_SPEC)}
          height={RULER_H}
          className="lrp-band-x"
        />
        <rect
          x={dx(D_CODE)}
          y={DAYS_Y}
          width={dx(D_MAX) - dx(D_CODE)}
          height={RULER_H}
          className="lrp-band-r"
        />

        <text x={(dx(0) + dx(D_CERT)) / 2} y={DAYS_Y + 20} className="lrp-t-sev">
          WITHIN CERTIFICATION
        </text>
        <text x={(dx(D_CERT) + dx(D_SPEC)) / 2} y={DAYS_Y + 20} className="lrp-t-sev">
          Y
        </text>
        <text x={(dx(D_CODE) + dx(D_MAX)) / 2} y={DAYS_Y + 20} className="lrp-t-sev">
          R
        </text>

        {/* the walking accumulator */}
        <rect
          className="lrp-head"
          x={dx(0)}
          y={DAYS_Y - 7}
          width={2.5}
          height={RULER_H + 14}
        />

        {[
          [D_CERT, 'CERT 12 D'],
          [D_SPEC, 'SPEC 14 D'],
          [D_CODE, 'CODE 16 D'],
        ].map(([v, label]) => (
          <g key={`dt:${v}`}>
            <line
              x1={dx(v)}
              y1={DAYS_Y - 12}
              x2={dx(v)}
              y2={DAYS_Y + RULER_H}
              className={v === D_CERT ? 'lrp-mark' : 'lrp-cut'}
            />
            <text x={dx(v) + 5} y={DAYS_Y - 15} className="lrp-t-tick" textAnchor="start">
              {label}
            </text>
          </g>
        ))}

        {/* the finding, stated on the figure rather than only in the caption */}
        <path
          d={`M ${dx(D_SPEC)} ${DAYS_Y + RULER_H + 16} L ${dx(D_CODE)} ${DAYS_Y + RULER_H + 16}`}
          className="lrp-cut"
        />
        <text x={dx(D_SPEC)} y={DAYS_Y + RULER_H + 32} className="lrp-t-flag">
          REPORTED Y · THE CLIENT’S RULE SAYS R
        </text>
        <text x={dx(D_SPEC)} y={DAYS_Y + RULER_H + 44} className="lrp-t-leg">
          ONLY WHEN DURATION PER EVENT &gt; 1 D — AT 1 D THE TWO FORMULAS COINCIDE
        </text>

        {/* ---- hours ruler: where the same formula is right ---- */}
        <text x={RULER_X - 16} y={HRS_Y + 12} className="lrp-t-lane">
          HOURS
        </text>
        <text x={RULER_X - 16} y={HRS_Y + 24} className="lrp-t-lane">
          7 evt/yr × 8 H
        </text>

        <rect
          x={hx(0)}
          y={HRS_Y}
          width={hx(H_CERT) - hx(0)}
          height={RULER_H}
          className="lrp-band-ok"
        />
        <rect
          x={hx(H_CERT)}
          y={HRS_Y}
          width={hx(H_LIMIT) - hx(H_CERT)}
          height={RULER_H}
          className="lrp-band-y"
        />
        <rect
          x={hx(H_LIMIT)}
          y={HRS_Y}
          width={hx(H_MAX) - hx(H_LIMIT)}
          height={RULER_H}
          className="lrp-band-r"
        />

        <text x={(hx(0) + hx(H_CERT)) / 2} y={HRS_Y + 20} className="lrp-t-sev">
          WITHIN CERTIFICATION
        </text>
        <text x={(hx(H_CERT) + hx(H_LIMIT)) / 2} y={HRS_Y + 20} className="lrp-t-sev">
          Y
        </text>
        <text x={(hx(H_LIMIT) + hx(H_MAX)) / 2} y={HRS_Y + 20} className="lrp-t-sev">
          R
        </text>

        {[
          [H_CERT, 'CERT 56 H'],
          [H_LIMIT, 'LIMIT 72 H'],
        ].map(([v, label]) => (
          <g key={`ht:${v}`}>
            <line
              x1={hx(v)}
              y1={HRS_Y - 12}
              x2={hx(v)}
              y2={HRS_Y + RULER_H}
              className="lrp-mark"
            />
            <text x={hx(v) + 5} y={HRS_Y - 15} className="lrp-t-tick" textAnchor="start">
              {label}
            </text>
          </g>
        ))}

        <text x={hx(H_CERT)} y={HRS_Y + RULER_H + 18} className="lrp-t-good">
          56 + 8×2 = 72 — SPEC AND CODE AGREE HERE
        </text>

        {/* ============ register 3: the inherited workbook =============== */}
        <text x={24} y={ASM_Y - 30} className="lrp-t-head">
          3 · THE WORKBOOK IS INHERITED, NOT WRITTEN
        </text>
        <text x={24} y={ASM_Y - 16} className="lrp-t-leg">
          write_outputs() COPIES THE ANALYST’S OWN STYLED FILE, THEN FILLS IT
        </text>

        {ASSEMBLY.map(([step, detail], i) => {
          const y = ASM_Y + i * (ASM_H + ASM_GAP);
          return (
            <g key={`a:${step}`}>
              <rect x={ASM_X} y={y} width={ASM_W} height={ASM_H} className="lrp-box-on" />
              <text x={ASM_X + 9} y={y + 17} className="lrp-t-cell">
                {step}
              </text>
              <text x={ASM_X + 9} y={y + 30} className="lrp-t-sub">
                {detail}
              </text>
              {i < ASSEMBLY.length - 1 ? (
                <line
                  x1={ASM_X + ASM_W / 2}
                  y1={y + ASM_H}
                  x2={ASM_X + ASM_W / 2}
                  y2={y + ASM_H + ASM_GAP}
                  className="lrp-lead"
                />
              ) : null}
            </g>
          );
        })}

        <text x={ASM_X + ASM_W + 22} y={ASM_Y + 14} className="lrp-t-note">
          12 PERIOD SHEETS ARE LIVE PIVOTTABLES
        </text>
        <text x={ASM_X + ASM_W + 22} y={ASM_Y + 28} className="lrp-t-leg">
          NEVER PASTED OVER — THEY REBUILD ON OPEN (refreshOnLoad).
        </text>
        <text x={ASM_X + ASM_W + 22} y={ASM_Y + 40} className="lrp-t-leg">
          PASTING STATIC VALUES WOULD CAP THEM AT THE OLD EXTENT.
        </text>
        <text x={ASM_X + ASM_W + 22} y={ASM_Y + 62} className="lrp-t-note">
          openpyxl DROPS &lt;col&gt; WIDTHS AND STALE-RANGES FILTERS
        </text>
        <text x={ASM_X + ASM_W + 22} y={ASM_Y + 76} className="lrp-t-leg">
          SO THE SAVED FILE IS REPAIRED IN RAW XML BEFORE IT SHIPS.
        </text>
        <text x={ASM_X + ASM_W + 22} y={ASM_Y + 98} className="lrp-t-note">
          “ALL COMBINED” OPENS PRE-FILTERED
        </text>
        <text x={ASM_X + ASM_W + 22} y={ASM_Y + 112} className="lrp-t-leg">
          OPEN LEAVES × VIOLATION FLAG — NON-MATCHING ROWS HIDDEN.
        </text>

        {/* the parity ledger */}
        <text x={PAR_X} y={ASM_Y - 16} className="lrp-t-head">
          PARITY vs THE ANALYST’S REFERENCE — ROWS
        </text>
        {PARITY.map(([sheet, gen, ref], i) => {
          const y = ASM_Y + i * PAR_ROW;
          const unchecked = gen === null;
          const exact = !unchecked && gen === ref;
          return (
            <g key={`p:${sheet}`}>
              <rect
                x={PAR_X}
                y={y}
                width={496}
                height={PAR_ROW - 4}
                className={unchecked ? 'lrp-slot' : 'lrp-box'}
              />
              <text x={PAR_X + 8} y={y + 12} className={unchecked ? 'lrp-t-dim' : 'lrp-t-cell'}>
                {sheet}
              </text>
              {/* The unchecked row's verdict text is wide enough to reach this
                  column, so it gives up the figures rather than collide. */}
              {unchecked ? null : (
                <text x={PAR_X + 360} y={y + 12} className="lrp-t-dim" textAnchor="end">
                  {gen} / {ref}
                </text>
              )}
              <text
                x={PAR_X + 488}
                y={y + 12}
                className={exact ? 'lrp-t-good' : 'lrp-t-flag'}
                textAnchor="end"
              >
                {unchecked
                  ? 'NO REFERENCE PRESENT — SELF-CHECKS NOTHING'
                  : exact
                    ? 'EXACT'
                    : `${Math.abs(ref - gen)} SHORT`}
              </text>
            </g>
          );
        })}
        <text x={PAR_X} y={ASM_Y + PARITY.length * PAR_ROW + 14} className="lrp-t-sum">
          {MATCHED} of {PARITY.length - 1} checked sheets reproduce the reference exactly
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Feed row counts are the measured 2026-06 snapshot. The stride strip and
        both rulers are worked examples using the client’s own certification
        figures, drawn to scale; the rules producing them are transcribed from
        <code> build_period_violations</code> and the client’s rules document, not
        inferred. The two-day gap on the days ruler is derived by reading
        <code> TIME_YELLOW_LIMIT</code> against that document — it has not been
        demonstrated by a run that produced a wrong cell, and no such run is
        claimed. The parity ledger is the pipeline’s own validation JSON from the
        one run that had reference workbooks present. The empty seventh row is the
        honest slot: the monthly production run ships with nothing to compare
        against. Runtime is not drawn anywhere on this figure because it has never
        been timed.
      </figcaption>
    </figure>
  );
}
