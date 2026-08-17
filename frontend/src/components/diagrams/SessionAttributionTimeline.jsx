/**
 * Twenty minutes of browsing, and the twenty seconds of it the extension keeps.
 *
 * Every other diagram here draws a topology, because every other project has
 * one. This project's architecture is four lines of state in a service worker,
 * so the thing worth drawing is not its shape — it is the gap between what
 * happened and what got recorded. The drawing makes one claim: the extension
 * records the intervals bounded by two tab switches close enough together to
 * land inside a single worker lifetime, and loses everything else.
 *
 * The rules the trace obeys are read from the source, not invented:
 *   - background.js registers exactly one hot-path listener,
 *     chrome.tabs.onActivated. tabs.onUpdated, windows.onFocusChanged and
 *     chrome.idle are never registered, so in-tab navigation, focus loss and
 *     away-from-keyboard produce no event at all — drawn as the three
 *     unobserved markers.
 *   - An interval is only written to storage when an activation arrives *and*
 *     the previous domain is still held in memory *and* it differs from the new
 *     one. That is the single save condition in the file.
 *   - previousDomain / previousTime / startTime / today are module-level `let`s
 *     in a Manifest V3 service worker. Chrome's documented lifecycle terminates
 *     an idle worker after roughly thirty seconds, and a restart begins with all
 *     four unset — so a cold start cannot close the interval that preceded it.
 *
 * Trace the example through those three rules and the arithmetic is stark: of
 * the five real intervals, one is written, and it is the 20-second glance at a
 * tab rather than any of the sustained reading. The worker lane is the
 * explanation — it is alive for two slivers out of twenty minutes.
 *
 * The durations are a worked example chosen to be legible, not a capture; the
 * caption says so. What is not illustrative is the shape of the result, which
 * follows from the save condition and the eviction rule for any trace where the
 * user reads for longer than the worker lives.
 *
 * Deliberately static, unlike the pipeline diagrams here. Their animated pips
 * represent something real — a message actually travelling an edge. A timeline
 * has no flow to animate, and a sweeping playhead over one would be motion that
 * carries no information while reading as an event boundary, so there is nothing
 * for prefers-reduced-motion to switch off.
 */

import PropTypes from 'prop-types';

const W = 1240;
const H = 420;

/** The example spans 20 minutes; a 60-minute one renders the 20-second
 *  recorded interval as a sub-pixel sliver, which understates by illegibility
 *  rather than arguing. */
const SPAN = 20;
const X0 = 196;
const X1 = 1206;
const SX = (X1 - X0) / SPAN;

const x = (t) => X0 + t * SX;

/** Chrome terminates an idle MV3 worker at roughly 30 s. */
const WORKER_TTL = 0.5;

const LANE_X = 176;

const ACTUAL_Y = 76;
const ACTUAL_H = 32;
const EVENT_Y = 142;
const WORKER_Y = 198;
const WORKER_H = 24;
const REC_Y = 268;
const REC_H = 32;
const AXIS_Y = 352;

/** [from, to, label, sublabel, kind] — 'away' is time with nobody there. */
const ACTUAL = [
  [0, 5, 'github.com', 'tab activated', 'site'],
  [5, 12, 'youtube.com', 'same tab · no event', 'site'],
  [12, 15.5, 'away from keyboard', 'browser unfocused', 'away'],
  [15.5, 15.8333, '', '', 'site'],
  [15.8333, 20, 'github.com', 'tab activated', 'site'],
];

/** [t, label, observed] */
const EVENTS = [
  [0, 'tab activate', true],
  [5, 'in-tab navigate', false],
  [12, 'focus lost', false],
];

/** The two activations that land inside one worker lifetime, labelled once. */
const CLUSTER = [15.5, 15.8333];

/** Worker lifetimes: each observed event keeps it up for WORKER_TTL. */
const ALIVE = [
  [0, 0 + WORKER_TTL],
  [15.5, 15.8333 + WORKER_TTL],
];

/** The single interval that satisfies the save condition. */
const RECORDED = [[15.5, 15.8333, 'reddit.com · 20 s']];

const TICKS = [0, 5, 10, 15, 20];

/**
 * The "lost" annotations sit on top of the dashed rules they describe, so the
 * dashes would strike through the letters. Rather than size a backing rect from
 * an estimated character width — which is off by enough to clip — the text
 * paints its own halo: a thick background-coloured stroke drawn *under* the
 * fill via paint-order, which fits the glyphs exactly whatever they are.
 */
function Annotation({ cx, cy, children }) {
  return (
    <text x={cx} y={cy} className="sat-t-lost">
      {children}
    </text>
  );
}

Annotation.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired,
};

export default function SessionAttributionTimeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="sat-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="A twenty-minute browsing session traced against what the extension records of it. The top lane shows what actually happened: five minutes on github.com, seven minutes on youtube.com reached by typing a new address into the same tab, three and a half minutes away from the keyboard with the browser unfocused, a twenty-second glance at reddit.com in another tab, and four minutes back on github.com. The middle lane shows which Chrome events the extension observes: it registers only tab activation, so the in-tab navigation and the loss of focus produce no event at all, and the two tab activations twenty seconds apart produce two. The next lane shows the Manifest V3 background service worker, which Chrome terminates after roughly thirty seconds idle: it is alive for two short slivers and dead for the rest of the twenty minutes, and each restart begins with no memory of the interval in progress. The bottom lane shows the result: one interval is written to storage, the twenty-second visit to reddit.com, because it alone is bounded by two activations inside a single worker lifetime. Twenty seconds of twenty minutes is recorded, and the sustained reading is lost entirely."
      >
        <style>{`
          .sat-svg text { font-family: var(--font-data); }

          .sat-site   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .sat-away   { fill: none; stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 3 3; opacity: .7; }
          .sat-alive  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .sat-dead   { stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 2 4; opacity: .45; }
          .sat-rec    { fill: var(--color-ch-soft); stroke: var(--color-ch); stroke-width: 1; }
          .sat-lost   { stroke: var(--color-flag); stroke-width: 1; stroke-dasharray: 2 4; opacity: .5; }

          .sat-mark-y { fill: var(--color-ch); }
          .sat-mark-n { fill: none; stroke: var(--color-flag); stroke-width: 1; }
          .sat-rule   { stroke: var(--color-rule); stroke-width: 1; }
          .sat-lead   { stroke: var(--color-ch); stroke-width: 1; opacity: .55; }

          .sat-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .sat-t-leg  { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }
          .sat-t-lane { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .09em; text-anchor: end; }
          .sat-t-name { fill: var(--color-ink); font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .sat-t-sub  { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .06em; text-anchor: middle; }
          .sat-t-ev   { fill: var(--color-ink); font-size: 8.5px; letter-spacing: .05em; text-anchor: middle; }
          .sat-t-evn  { fill: var(--color-flag); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .sat-t-evy  { fill: var(--color-ch); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .sat-t-tick { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .06em; text-anchor: middle; }
          .sat-t-sum  { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .04em; }
          .sat-t-rec  { fill: var(--color-ch); font-size: 9.5px; letter-spacing: .05em; }
          .sat-t-lost {
            fill: var(--color-flag); font-size: 8.5px; letter-spacing: .07em;
            text-anchor: middle;
            stroke: var(--color-paper-2); stroke-width: 3.5px; stroke-linejoin: round;
            paint-order: stroke fill;
          }
        `}</style>

        <text x={24} y={28} className="sat-t-head">
          ONE SESSION · WHAT HAPPENED vs. WHAT WAS RECORDED
        </text>

        <text x={24} y={44} className="sat-t-leg">
          dashed = nothing observed, nothing stored ┊ solid = the extension saw it
        </text>

        {/* ---- lane 1: what actually happened ---------------------------- */}
        <text x={LANE_X} y={ACTUAL_Y + 20} className="sat-t-lane">
          WHAT HAPPENED
        </text>

        {ACTUAL.map(([from, to, label, sub, kind]) => (
          <g key={`a:${from}`}>
            <rect
              x={x(from)}
              y={ACTUAL_Y}
              width={x(to) - x(from)}
              height={ACTUAL_H}
              className={kind === 'away' ? 'sat-away' : 'sat-site'}
            />
            {label && (
              <>
                <text
                  x={(x(from) + x(to)) / 2}
                  y={ACTUAL_Y + 15}
                  className="sat-t-name"
                >
                  {label}
                </text>
                <text
                  x={(x(from) + x(to)) / 2}
                  y={ACTUAL_Y + 26}
                  className="sat-t-sub"
                >
                  {sub}
                </text>
              </>
            )}
          </g>
        ))}

        {/* The 20-second glance is 17px wide, so it is labelled off to the
            side rather than inside. */}
        <line
          x1={x(15.6666)}
          y1={ACTUAL_Y - 2}
          x2={x(15.6666)}
          y2={ACTUAL_Y - 12}
          className="sat-lead"
        />
        <text x={x(15.6666) - 26} y={ACTUAL_Y - 16} className="sat-t-rec">
          reddit.com
        </text>

        {/* ---- lane 2: which events Chrome emits that this code hears ---- */}
        <text x={LANE_X} y={EVENT_Y + 4} className="sat-t-lane">
          EVENTS REGISTERED
        </text>
        <line x1={X0} y1={EVENT_Y} x2={X1} y2={EVENT_Y} className="sat-rule" />

        {EVENTS.map(([t, label, observed]) => (
          <g key={`e:${t}`}>
            <path
              d={`M ${x(t)} ${EVENT_Y - 6} l 5 9 l -10 0 z`}
              className={observed ? 'sat-mark-y' : 'sat-mark-n'}
            />
            <text x={x(t)} y={EVENT_Y + 22} className="sat-t-ev">
              {label}
            </text>
            <text
              x={x(t)}
              y={EVENT_Y + 33}
              className={observed ? 'sat-t-evy' : 'sat-t-evn'}
            >
              {observed ? 'OBSERVED' : 'NOT REGISTERED'}
            </text>
          </g>
        ))}

        {CLUSTER.map((t) => (
          <path
            key={`c:${t}`}
            d={`M ${x(t)} ${EVENT_Y - 6} l 5 9 l -10 0 z`}
            className="sat-mark-y"
          />
        ))}
        <text
          x={(x(CLUSTER[0]) + x(CLUSTER[1])) / 2}
          y={EVENT_Y + 22}
          className="sat-t-ev"
        >
          tab activate &times;2
        </text>
        <text
          x={(x(CLUSTER[0]) + x(CLUSTER[1])) / 2}
          y={EVENT_Y + 33}
          className="sat-t-evy"
        >
          20 s APART
        </text>

        {/* ---- lane 3: the service worker's actual lifetime -------------- */}
        <text x={LANE_X} y={WORKER_Y + 16} className="sat-t-lane">
          SERVICE WORKER
        </text>

        <line
          x1={X0}
          y1={WORKER_Y + WORKER_H / 2}
          x2={X1}
          y2={WORKER_Y + WORKER_H / 2}
          className="sat-dead"
        />
        {ALIVE.map(([from, to]) => (
          <rect
            key={`w:${from}`}
            x={x(from)}
            y={WORKER_Y}
            width={x(to) - x(from)}
            height={WORKER_H}
            className="sat-alive"
          />
        ))}
        <Annotation cx={x(7.5)} cy={WORKER_Y + 16}>
          EVICTED · STATE GONE, INTERVAL NOT FLUSHED
        </Annotation>
        <Annotation cx={x(18.4)} cy={WORKER_Y + 16}>
          EVICTED
        </Annotation>

        {/* ---- lane 4: what reached storage ------------------------------ */}
        <text x={LANE_X} y={REC_Y + 20} className="sat-t-lane">
          WRITTEN TO STORAGE
        </text>

        <line
          x1={X0}
          y1={REC_Y + REC_H / 2}
          x2={x(15.5)}
          y2={REC_Y + REC_H / 2}
          className="sat-lost"
        />
        <line
          x1={x(15.8333)}
          y1={REC_Y + REC_H / 2}
          x2={X1}
          y2={REC_Y + REC_H / 2}
          className="sat-lost"
        />
        {RECORDED.map(([from, to, label]) => (
          <g key={`r:${from}`}>
            <rect
              x={x(from)}
              y={REC_Y}
              width={x(to) - x(from)}
              height={REC_H}
              className="sat-rec"
            />
            <line
              x1={x((from + to) / 2)}
              y1={REC_Y + REC_H + 2}
              x2={x((from + to) / 2)}
              y2={REC_Y + REC_H + 14}
              className="sat-lead"
            />
            <text
              x={x((from + to) / 2) - 96}
              y={REC_Y + REC_H + 25}
              className="sat-t-rec"
            >
              {label}
            </text>
          </g>
        ))}
        <Annotation cx={x(7)} cy={REC_Y + 20}>
          NOTHING WRITTEN — NO ACTIVATION CLOSED THESE INTERVALS
        </Annotation>

        {/* ---- the axis --------------------------------------------------- */}
        <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} className="sat-rule" />
        {TICKS.map((t) => (
          <g key={`t:${t}`}>
            <line x1={x(t)} y1={AXIS_Y} x2={x(t)} y2={AXIS_Y + 5} className="sat-rule" />
            <text x={x(t)} y={AXIS_Y + 16} className="sat-t-tick">
              {t} MIN
            </text>
          </g>
        ))}

        <text x={24} y={AXIS_Y + 16} className="sat-t-sum">
          20 s of 20 min
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        A worked example traced through the source, not a capture — the durations
        are chosen to be legible. What is not illustrative are the three rules
        producing the result: background.js registers one hot-path listener
        (tab activation) of the four transitions that end an interval; an
        interval is written only when an activation finds the previous domain
        still in memory; and all four timing variables are module-level state in
        a Manifest V3 service worker, which Chrome terminates after roughly
        thirty seconds idle. The extension has never been measured against a
        known log of real activity, so no accuracy figure is shown.
      </figcaption>
    </figure>
  );
}
