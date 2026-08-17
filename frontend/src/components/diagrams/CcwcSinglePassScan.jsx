/**
 * Twenty-four bytes, four counters, and the gate that discards three of them.
 *
 * This project is 119 lines in one file, so there is no topology to draw. What
 * there is instead is a sharp split down the middle of the program, and that
 * split is the only thing this diagram argues:
 *
 *   The scanning half is careful and correct. The reporting half throws most
 *   of its results away, and one flag can never be answered at all.
 *
 * Both registers are read off main.cpp, not invented.
 *
 * ---- upper register: the scan -------------------------------------------
 *
 * `process_stream` reads the input in 65536-byte chunks and derives all four
 * counts in one traversal of each chunk. The per-byte rules, verbatim from the
 * loop body:
 *
 *   bytes  += in.gcount()                      — every byte read, no exceptions
 *   lines  ++  if (c == '\n')
 *   chars  ++  if ((c & 0xC0) != 0x80)         — skip UTF-8 continuation bytes
 *   words  ++  if (!isspace(c) && !in_word)    — on entry to a word only
 *
 * The sample tape is 24 bytes chosen so that a single row exercises every one
 * of those rules, including the two that are easy to get wrong:
 *
 *   - `in_word` is declared *outside* the read loop, so it survives the chunk
 *     boundary. The tape puts a boundary in the middle of the word "war": the
 *     'r' at index 13 begins a fresh 64 KiB read with `in_word` still true, so
 *     it does not open a second word. This is the classic defect of a chunked
 *     rewrite of wc and the code does not have it — hence the boundary is drawn
 *     rather than hidden.
 *   - The three bytes E9 81 93 are one UTF-8 codepoint. Two of them are
 *     continuation bytes (top bits 10), so they add to `bytes` but not to
 *     `chars`, and only the lead byte opens a word. That is codepoint counting
 *     with no locale, no wide-char conversion and no allocation.
 *
 * The four totals under the tape — 24 / 22 / 6 / 1 — are hand-traced through
 * those rules for this tape. They are a worked example, like the durations in
 * SessionAttributionTimeline; the rules producing them are not.
 *
 * ---- lower register: the gate -------------------------------------------
 *
 * After the scan, main() decides what to print with a default-fill guard
 * followed by a five-rung if/else chain. Neither is drawn from a reading of
 * intent — they are transcribed:
 *
 *   if (!is_count_bytes && !is_count_words && !is_count_lines)
 *       is_count_bytes = is_count_words = is_count_lines = true;
 *
 * The guard omits `is_count_characters`. So an invocation that asked *only* for
 * -m arrives with bytes/words/lines all false, is treated as though no flag was
 * given at all, leaves with all three set, and falls into the first rung. The
 * chain's -m rung sits behind four `else if`s that require bytes, lines and
 * words to all be false — a state the guard has just made unreachable. The
 * branch is dead code in every possible invocation, which is why it is drawn
 * greyed with no inbound arrow.
 *
 * The 4x4 grid is the exhaustive enumeration of all sixteen flag subsets pushed
 * through the guard and the chain. It is not a sample: five combinations print
 * everything that was asked for, eleven silently print less, and every one of
 * the eight combinations containing -m is in the second group. Those counts are
 * derived, not measured, and the caption says so.
 *
 * ---- motion --------------------------------------------------------------
 *
 * The scan head advances one cell at a time because the read loop really does
 * advance one byte at a time — the animation represents something, rather than
 * decorating. Under prefers-reduced-motion it does not slow down, it stops, and
 * it stops parked on the chunk boundary, which is the single most informative
 * cell on the tape.
 */

const W = 1240;
const H = 604;

const X0 = 196;
const CELL = 40;
const N = 24;

/** The chunk boundary falls before this index — mid-word, deliberately. */
const BREAK = 13;

const TAPE_Y = 96;
const TAPE_H = 38;

/** The four counter rows under the tape, in the order the loop tests them. */
const ROWS = [
  ['BYTES', 'bytes'],
  ['CHARS', 'chars'],
  ['WORDS', 'words'],
  ['LINES', 'lines'],
];

const ROW_Y = 152;
const ROW_H = 20;

const TOTAL_Y = ROW_Y + ROWS.length * ROW_H + 26;

/**
 * The tape. `t` is the byte's class:
 *   ascii — ordinary single-byte non-space
 *   space — isspace() true
 *   nl    — '\n' (also isspace)
 *   lead  — UTF-8 lead byte
 *   cont  — UTF-8 continuation byte, (c & 0xC0) == 0x80
 * `w` is whether this byte opens a word, tracked with in_word across the whole
 * tape rather than reset at the boundary — which is what the code does.
 */
const TAPE = [
  { g: 't', t: 'ascii', w: true },
  { g: 'h', t: 'ascii', w: false },
  { g: 'e', t: 'ascii', w: false },
  { g: '·', t: 'space', w: false },
  { g: 'a', t: 'ascii', w: true },
  { g: 'r', t: 'ascii', w: false },
  { g: 't', t: 'ascii', w: false },
  { g: '·', t: 'space', w: false },
  { g: 'o', t: 'ascii', w: true },
  { g: 'f', t: 'ascii', w: false },
  { g: '·', t: 'space', w: false },
  { g: 'w', t: 'ascii', w: true },
  { g: 'a', t: 'ascii', w: false },
  /* ---- read #2 begins here; in_word is still true ---- */
  { g: 'r', t: 'ascii', w: false },
  { g: '·', t: 'space', w: false },
  { g: 'E9', t: 'lead', w: true },
  { g: '81', t: 'cont', w: false },
  { g: '93', t: 'cont', w: false },
  { g: '·', t: 'space', w: false },
  { g: 'e', t: 'ascii', w: true },
  { g: 'n', t: 'ascii', w: false },
  { g: 'd', t: 'ascii', w: false },
  { g: 's', t: 'ascii', w: false },
  /* The two characters, not the control character — a real newline in an SVG
     <text> collapses to whitespace and the cell would render empty. */
  { g: '\\n', t: 'nl', w: false },
];

/** Which counters tick on a given cell — the loop body, as predicates. */
const TICK = {
  bytes: () => true,
  chars: (c) => c.t !== 'cont',
  words: (c) => c.w,
  lines: (c) => c.t === 'nl',
};

const TOTALS = ROWS.map(([label, key]) => [
  label,
  TAPE.filter((c) => TICK[key](c)).length,
]);

const cx = (i) => X0 + i * CELL;

/* ---- the dispatch ladder ------------------------------------------------ */

const LAD_X = 196;
const LAD_Y = 344;
const LAD_H = 34;
const LAD_W = 402;

/** [condition, what it prints, reachable] — the if/else chain in source order. */
const RUNGS = [
  ['if (c && w && l)', 'bytes · lines · words', true],
  ['else if (c)', 'bytes', true],
  ['else if (l)', 'lines', true],
  ['else if (w)', 'words', true],
  ['else if (m)', 'chars', false],
];

/* ---- all sixteen flag subsets ------------------------------------------ */

const GRID_X = 656;
const GRID_Y = 344;
const GCW = 126;
const GCH = 34;

/** [flags as typed, rung reached, what it prints, what it swallowed] */
const COMBOS = [
  ['(none)', 'A', 'b·l·w', null],
  ['-c', 'B', 'bytes', null],
  ['-l', 'C', 'lines', null],
  ['-w', 'D', 'words', null],
  ['-c -l -w', 'A', 'b·l·w', null],
  ['-m', 'A', 'b·l·w', '-m'],
  ['-c -l', 'B', 'bytes', '-l'],
  ['-c -w', 'B', 'bytes', '-w'],
  ['-l -w', 'C', 'lines', '-w'],
  ['-c -m', 'B', 'bytes', '-m'],
  ['-l -m', 'C', 'lines', '-m'],
  ['-w -m', 'D', 'words', '-m'],
  ['-c -l -m', 'B', 'bytes', '-l -m'],
  ['-c -w -m', 'B', 'bytes', '-w -m'],
  ['-l -w -m', 'C', 'lines', '-w -m'],
  ['-c -l -w -m', 'A', 'b·l·w', '-m'],
];

const ANSWERED = COMBOS.filter((c) => !c[3]).length;

export default function CcwcSinglePassScan() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="ccw-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="Two registers describing the ccwc program. The upper register draws a tape of twenty-four bytes reading 'the art of' then a word split across a chunk boundary, a three-byte UTF-8 character, the word 'ends' and a newline. Beneath the tape, four rows mark which of the four counters ticks on each byte: bytes ticks on all twenty-four; characters ticks on twenty-two, skipping the two UTF-8 continuation bytes; words ticks six times, only on the byte that enters a word; lines ticks once, on the newline. A vertical rule marks where the second sixty-four-kilobyte read begins, in the middle of the word 'war'. Because the in-word flag is declared outside the read loop it survives that boundary, so the 'r' after the break does not open a seventh word — the count is six, not seven. The lower register draws what happens to those four numbers. A guard fills in bytes, lines and words whenever none of the three was requested, but it does not mention the character flag. Below it a five-rung if-else chain prints at most one result. The fifth rung, the one that prints characters, requires bytes, lines and words to all be false, which the guard has just made impossible, so it is drawn greyed with no arrow reaching it: it is dead code in every invocation. To the right, all sixteen possible flag combinations are enumerated, each labelled with the rung it reaches and what it prints. Five print everything that was asked for. Eleven silently print less, and all eight combinations that include the character flag are among them."
      >
        <style>{`
          .ccw-svg text { font-family: var(--font-data); }

          .ccw-cell   { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }
          .ccw-cell-s { fill: var(--color-paper-3); stroke: var(--color-rule); stroke-width: 1; }
          .ccw-cell-c { fill: var(--color-paper); stroke: var(--color-flag); stroke-width: 1; stroke-dasharray: 2 3; }

          .ccw-rule   { stroke: var(--color-rule); stroke-width: 1; }
          .ccw-break  { stroke: var(--color-ch); stroke-width: 1.5; }
          .ccw-lead   { stroke: var(--color-ch); stroke-width: 1; opacity: .55; }
          .ccw-carry  { fill: none; stroke: var(--color-ch); stroke-width: 1.25; }

          .ccw-tick   { fill: var(--color-ch); }
          .ccw-tick-o { fill: none; stroke: var(--color-ink-3); stroke-width: 1; opacity: .4; }

          .ccw-box    { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }
          .ccw-box-on { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .ccw-box-ok { fill: var(--color-paper); stroke: var(--color-good); stroke-width: 1; }
          .ccw-box-no { fill: var(--color-paper); stroke: var(--color-flag); stroke-width: 1; stroke-dasharray: 2 3; }
          .ccw-box-dead {
            fill: none; stroke: var(--color-ink-3); stroke-width: 1;
            stroke-dasharray: 2 4; opacity: .45;
          }
          .ccw-guard  { fill: var(--color-flag-soft); stroke: var(--color-flag); stroke-width: 1; }

          .ccw-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .ccw-t-leg  { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }
          .ccw-t-lane { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .09em; text-anchor: end; }
          .ccw-t-byte { fill: var(--color-ink); font-size: 12px; text-anchor: middle; }
          .ccw-t-hex  { fill: var(--color-ink-3); font-size: 7.5px; text-anchor: middle; letter-spacing: .04em; }
          /* Same ink as .ccw-t-hex but left-anchored. A textAnchor attribute
             cannot override the class, since CSS beats presentation attributes. */
          .ccw-t-cell { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .04em; }
          .ccw-t-word { fill: var(--color-ch); font-size: 8.5px; letter-spacing: .07em; text-anchor: middle; }
          .ccw-t-tot  { fill: var(--color-ch); font-size: 11px; letter-spacing: .05em; text-anchor: end; }
          .ccw-t-note { fill: var(--color-ch); font-size: 8.5px; letter-spacing: .07em; }
          .ccw-t-flag { fill: var(--color-flag); font-size: 8.5px; letter-spacing: .07em; }
          .ccw-t-cond { fill: var(--color-ink); font-size: 10px; letter-spacing: .02em; }
          .ccw-t-out  { fill: var(--color-ink-3); font-size: 9px; letter-spacing: .05em; text-anchor: end; }
          .ccw-t-dead { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .02em; opacity: .6; }
          .ccw-t-rung { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .1em; text-anchor: middle; }
          .ccw-t-comb { fill: var(--color-ink); font-size: 9.5px; letter-spacing: .04em; }
          .ccw-t-drop { fill: var(--color-flag); font-size: 7.5px; letter-spacing: .06em; text-anchor: end; }
          .ccw-t-keep { fill: var(--color-good); font-size: 7.5px; letter-spacing: .06em; text-anchor: end; }
          .ccw-t-sum  { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .04em; }

          .ccw-head {
            fill: var(--color-ch-soft); stroke: var(--color-ch); stroke-width: 1;
            animation: ccw-scan 7.2s steps(${N}) infinite;
          }
          @keyframes ccw-scan {
            from { transform: translateX(0); }
            to   { transform: translateX(${N * CELL}px); }
          }

          /* Stops dead rather than slowing, parked on the chunk boundary. */
          @media (prefers-reduced-motion: reduce) {
            .ccw-head {
              animation: none;
              transform: translateX(${BREAK * CELL}px);
            }
          }
        `}</style>

        <text x={24} y={28} className="ccw-t-head">
          ONE PASS OVER THE BYTES · AND THE GATE THAT DROPS WHAT IT COUNTED
        </text>
        <text x={24} y={44} className="ccw-t-leg">
          filled mark = this counter ticked on this byte ┊ hollow = it did not
        </text>

        {/* ================= register 1: the scan ======================== */}
        <text x={24} y={TAPE_Y - 12} className="ccw-t-head">
          1 · process_stream() — 64 KiB CHUNKS, FOUR COUNTERS, ONE TRAVERSAL
        </text>

        <text x={X0 - 20} y={TAPE_Y + 24} className="ccw-t-lane">
          INPUT BYTES
        </text>

        {/* the moving scan head, drawn under the cells so borders stay crisp */}
        <rect
          className="ccw-head"
          x={X0}
          y={TAPE_Y - 4}
          width={CELL}
          height={TAPE_H + 8}
        />

        {TAPE.map((c, i) => (
          <g key={`b:${i}`}>
            <rect
              x={cx(i)}
              y={TAPE_Y}
              width={CELL}
              height={TAPE_H}
              className={
                c.t === 'cont'
                  ? 'ccw-cell-c'
                  : c.t === 'space' || c.t === 'nl'
                    ? 'ccw-cell-s'
                    : 'ccw-cell'
              }
            />
            <text x={cx(i) + CELL / 2} y={TAPE_Y + 20} className="ccw-t-byte">
              {c.g}
            </text>
            {/* The top bits are the whole evidence for the char rule, so the
                UTF-8 pair carries them rather than an index nobody counts. */}
            <text x={cx(i) + CELL / 2} y={TAPE_Y + 32} className="ccw-t-hex">
              {c.t === 'cont'
                ? '10······'
                : c.t === 'lead'
                  ? '1110····'
                  : c.t === 'nl'
                    ? '0x0A'
                    : c.t === 'space'
                      ? '0x20'
                      : ''}
            </text>
          </g>
        ))}

        {/* the four counter rows */}
        {ROWS.map(([label, key], r) => {
          const y = ROW_Y + r * ROW_H;
          return (
            <g key={`r:${key}`}>
              <text x={X0 - 20} y={y + 11} className="ccw-t-lane">
                {label}
              </text>
              <line x1={X0} y1={y + 7} x2={cx(N)} y2={y + 7} className="ccw-rule" />
              {TAPE.map((c, i) =>
                TICK[key](c) ? (
                  <circle
                    key={`t:${key}:${i}`}
                    cx={cx(i) + CELL / 2}
                    cy={y + 7}
                    r={3.4}
                    className="ccw-tick"
                  />
                ) : (
                  <circle
                    key={`t:${key}:${i}`}
                    cx={cx(i) + CELL / 2}
                    cy={y + 7}
                    r={2.2}
                    className="ccw-tick-o"
                  />
                ),
              )}
            </g>
          );
        })}

        {/* the chunk boundary, and the invariant that crosses it */}
        <line
          x1={cx(BREAK)}
          y1={TAPE_Y - 22}
          x2={cx(BREAK)}
          y2={ROW_Y + ROWS.length * ROW_H}
          className="ccw-break"
        />
        <text x={cx(BREAK) + 6} y={TAPE_Y - 40} className="ccw-t-note">
          READ #2 BEGINS — in_word LIVES OUTSIDE THE LOOP, SO IT CROSSES
        </text>

        {/* The carry arc spans the word the boundary cuts in half. */}
        <path
          d={`M ${cx(11) + 6} ${TAPE_Y - 6} Q ${cx(13)} ${TAPE_Y - 20} ${cx(14) - 6} ${TAPE_Y - 6}`}
          className="ccw-carry"
        />
        <text x={cx(12.5)} y={TAPE_Y - 24} className="ccw-t-word">
          COUNTED ONCE
        </text>

        <line
          x1={X0}
          y1={TOTAL_Y - 14}
          x2={cx(N)}
          y2={TOTAL_Y - 14}
          className="ccw-rule"
        />
        <text x={X0} y={TOTAL_Y + 2} className="ccw-t-sum">
          {TOTALS.map(([label, n]) => `${label} ${n}`).join('   ·   ')}
        </text>
        <text x={cx(N)} y={TOTAL_Y + 2} className="ccw-t-out">
          six words, not seven — the boundary costs nothing
        </text>

        {/* ================= register 2: the gate ======================== */}
        <text x={24} y={GRID_Y - 66} className="ccw-t-head">
          2 · main() — THE GUARD, THE CHAIN, AND ALL SIXTEEN WAYS TO CALL IT
        </text>

        {/* the guard */}
        <rect x={LAD_X} y={GRID_Y - 54} width={LAD_W} height={30} className="ccw-guard" />
        <text x={LAD_X + 10} y={GRID_Y - 34} className="ccw-t-cond">
          if (!c &amp;&amp; !w &amp;&amp; !l) c = w = l = true;
        </text>
        <text x={LAD_X + LAD_W + 12} y={GRID_Y - 34} className="ccw-t-flag">
          m IS NOT IN THIS TEST — SO “ONLY -m” LOOKS LIKE “NO FLAGS”
        </text>

        {/* the if/else chain */}
        {RUNGS.map(([cond, out, live], r) => {
          const y = LAD_Y + r * LAD_H;
          return (
            <g key={`g:${cond}`}>
              <rect
                x={LAD_X}
                y={y}
                width={LAD_W}
                height={LAD_H - 4}
                className={live ? 'ccw-box-on' : 'ccw-box-dead'}
              />
              <text
                x={LAD_X + 10}
                y={y + 19}
                className={live ? 'ccw-t-cond' : 'ccw-t-dead'}
              >
                {cond}
              </text>
              <text x={LAD_X + LAD_W - 10} y={y + 19} className="ccw-t-out">
                {out}
              </text>
              <text x={LAD_X - 16} y={y + 19} className="ccw-t-rung">
                {String.fromCharCode(65 + r)}
              </text>
              {live ? (
                <line
                  x1={LAD_X - 34}
                  y1={y + 15}
                  x2={LAD_X - 24}
                  y2={y + 15}
                  className="ccw-lead"
                />
              ) : null}
            </g>
          );
        })}

        {/* Two lines, kept inside the ladder's own column — one long line runs
            under the combination grid to its right. */}
        <text x={LAD_X} y={LAD_Y + RUNGS.length * LAD_H + 14} className="ccw-t-flag">
          RUNG E NEEDS c, l AND w ALL FALSE.
        </text>
        <text x={LAD_X} y={LAD_Y + RUNGS.length * LAD_H + 28} className="ccw-t-flag">
          THE GUARD HAS JUST RULED THAT OUT — NOTHING REACHES IT.
        </text>

        {/* the exhaustive grid */}
        {COMBOS.map(([flags, rung, out, dropped], i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const gx = GRID_X + col * GCW;
          const gy = GRID_Y + row * (GCH + 6);
          return (
            <g key={`c:${flags}`}>
              <rect
                x={gx}
                y={gy}
                width={GCW - 6}
                height={GCH}
                className={dropped ? 'ccw-box-no' : 'ccw-box-ok'}
              />
              <text x={gx + 7} y={gy + 14} className="ccw-t-comb">
                {flags}
              </text>
              <text x={gx + 7} y={gy + 26} className="ccw-t-cell">
                {rung} → {out}
              </text>
              <text
                x={gx + GCW - 13}
                y={gy + 26}
                className={dropped ? 'ccw-t-drop' : 'ccw-t-keep'}
              >
                {dropped ? `${dropped} LOST` : 'ANSWERED'}
              </text>
            </g>
          );
        })}

        <text x={GRID_X} y={GRID_Y + 4 * (GCH + 6) + 14} className="ccw-t-sum">
          {ANSWERED} of {COMBOS.length} print everything asked for
        </text>
        <text x={GRID_X} y={GRID_Y + 4 * (GCH + 6) + 28} className="ccw-t-flag">
          -m APPEARS IN 8 COMBINATIONS AND IS HONOURED IN NONE OF THEM
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        The tape is a worked example, chosen so twenty-four bytes exercise every
        rule in the loop; the rules and the counting order are transcribed from
        <code> process_stream</code> in main.cpp. The four totals are hand-traced
        through them, and the six-word result is the point — <code>in_word</code>
        {' '}is declared outside the read loop, so the word split by the chunk
        boundary is counted once rather than twice. The lower register is not a
        sample either: it is all sixteen flag subsets pushed through the guard and
        the <code>if/else</code> chain as written, which is where the
        five-of-sixteen and the dead <code>-m</code> rung come from. Both are
        derived by reading the source. Nothing here is a benchmark — it has never
        been timed against <code>wc</code>, and the throughput slot on this page
        is empty for that reason.
      </figcaption>
    </figure>
  );
}
