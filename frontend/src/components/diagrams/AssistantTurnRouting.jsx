/**
 * One utterance, and the two gates that decide what happens to it.
 *
 * BOOTS's architecture is not interesting as a box diagram — it is a phone and a
 * laptop. What is interesting is that every turn passes two decisions before any
 * text is generated, and both exist because something was observed failing:
 *
 *   Gate 1 — is the brain reachable?  Decides full 7B tool-calling on the laptop
 *   vs. the on-device 1B fallback. The fallback is deliberately narrow (capture +
 *   local recall) because the 1B is documented in the code as unreliable for
 *   classification.
 *
 *   Gate 2 — might this turn need a tool?  A deterministic regex, evaluated
 *   BEFORE generating anything, because Ollama's streaming API doesn't surface
 *   tool_calls chunk-by-chunk. Chitchat streams (real TTFT win); anything that
 *   might touch stored data takes the safe non-streamed loop. The regex is
 *   deliberately biased toward "might need a tool" — the code states the reason:
 *   a missed streaming opportunity costs perceived latency, a wrongly-streamed
 *   store silently loses data.
 *
 * The honest part of the drawing is the verification backstop hanging off the
 * streamed path. A store phrased outside the regex used to stream a plausible
 * confirmation with nothing written — a SEV-1 silent data loss on the phone's
 * primary route. The fix runs the same yes/no probe after the stream completes
 * and executes the real tool call if it fires, so the write catches up to what
 * the user was already told. That edge is drawn dashed because it is a repair
 * path, not the happy path, and labelled with what it cannot do: un-send the
 * chunks already on screen.
 *
 * Latencies are measured, from PERF.md — real /agent/stream WebSocket calls and
 * a real device capture, not estimates. The 9.1 s tool-loop figure is one
 * measured reminder-creating turn; it is marked as a single observation rather
 * than an average, because that is what it is.
 */

const W = 1240;
/** Sized to content: lowest element is the on-device box at y≈383, footer at H−16. */
const H = 430;

const NODE_W = 150;
const NODE_H = 46;
const DISK_R = 27;
const GATE_R = 30;

const COL = (i) => 96 + i * 178;

/**
 * Explicit y per node rather than row multipliers — an earlier version used
 * fractional rows off a shared midline and pushed one node above the viewBox
 * entirely (caught in a browser, not by reading). Coordinates here are checked
 * against the viewBox: the highest element is the STREAM/USER row's kind label
 * at y≈96 and the lowest is the on-device box at y≈383, inside H=470 with the
 * footer legend at H−16.
 */
const NODES = [
  ['UTTER', 'store', 0, 250, 'utterance'],
  ['G1', 'gate', 1, 250, 'brain up?'],

  ['G2', 'gate', 2, 160, 'tool?'],
  ['ONDEV', 'worker', 2, 360, 'on-device 1b', 'CAPTURE + LOCAL RECALL'],

  ['STREAM', 'worker', 3, 100, 'stream tokens', 'TTFT 1.05 s · MEASURED'],
  ['LOOP', 'worker', 3, 250, 'tool loop', '9.1 s · ONE MEASURED TURN'],

  ['PROBE', 'gate', 4, 175, 'store?'],
  ['USER', 'worker', 5, 100, 'reply on screen', 'TEXT · OR SPOKEN'],
  ['DATA', 'store', 5, 290, 'sqlite + kg'],
];

/** Solid + animated: the path a turn actually takes. */
const FLOW = [
  ['UTTER', 'G1'],
  ['G1', 'G2'],
  ['G2', 'STREAM'],
  ['G2', 'LOOP'],
  ['STREAM', 'PROBE'],
  ['STREAM', 'USER'],
  ['LOOP', 'DATA'],
  ['PROBE', 'DATA'],
];

/** Dashed: degradation, not the happy path. */
const DEGRADE = [['G1', 'ONDEV']];

/** Edge labels. [from, to, text, side] */
const EDGE_LABEL = [
  ['G1', 'G2', 'reachable', 'up'],
  ['G1', 'ONDEV', 'asleep / no network', 'down'],
  ['G2', 'STREAM', 'no', 'up'],
  ['G2', 'LOOP', 'might', 'down'],
  ['PROBE', 'DATA', 'yes → forced call', 'down'],
];

const STORE_SUB = [
  ['UTTER', 'TYPED · OR "HEY BOOTS"'],
  ['DATA', 'SOURCE OF TRUTH · ENCRYPTED'],
];

const NODE_BY_ID = new Map(
  NODES.map(([id, type, col, y, label, kind]) => [
    id,
    { id, type, cx: COL(col), cy: y, label, kind },
  ]),
);

const halfW = (n) => (n.type === 'worker' ? NODE_W / 2 : n.type === 'gate' ? GATE_R : DISK_R);
const halfH = (n) => (n.type === 'worker' ? NODE_H / 2 : n.type === 'gate' ? GATE_R : DISK_R);

function anchor(from, to) {
  const a = NODE_BY_ID.get(from);
  const b = NODE_BY_ID.get(to);
  if (Math.abs(b.cy - a.cy) > Math.abs(b.cx - a.cx)) {
    return { x: a.cx, y: a.cy + Math.sign(b.cy - a.cy) * halfH(a) };
  }
  return { x: a.cx + Math.sign(b.cx - a.cx) * halfW(a), y: a.cy };
}

function edgePath(p1, p2) {
  if (Math.abs(p2.y - p1.y) > Math.abs(p2.x - p1.x)) {
    const dy = (p2.y - p1.y) * 0.5;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy}, ${p2.x} ${p2.y - dy}, ${p2.x} ${p2.y}`;
  }
  const dx = Math.max(24, Math.abs(p2.x - p1.x) * 0.45) * Math.sign(p2.x - p1.x || 1);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

const pathFor = (from, to) => edgePath(anchor(from, to), anchor(to, from));

const midOf = (from, to) => {
  const a = anchor(from, to);
  const b = anchor(to, from);
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
};

export default function AssistantTurnRouting() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="atr-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="How one utterance is routed through the assistant. An utterance, typed or spoken via the wake word, hits the first gate: is the brain reachable? If the laptop is asleep or off-network, it degrades to the on-device one-billion-parameter model, which is deliberately limited to capture and local recall. If the brain is reachable, a second gate asks whether the turn might need a tool — a deterministic regex evaluated before any text is generated, because the streaming API cannot surface tool calls chunk by chunk. A turn judged not to need a tool streams tokens directly, with a measured time to first token of 1.05 seconds. A turn that might need a tool takes the safe non-streamed tool loop instead, measured at 9.1 seconds on one reminder-creating turn, and writes to the encrypted SQLite database and knowledge graph. After a streamed reply completes, a verification probe asks whether the message actually needed a store; if yes, a forced tool call executes so the write catches up to the confirmation the user already saw. That repair edge is drawn dashed and cannot un-send the tokens already on screen."
      >
        <style>{`
          .atr-svg text { font-family: var(--font-data); }
          .atr-box   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .atr-disk  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .atr-gate  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .atr-dot   { fill: var(--color-ch); }

          .atr-t-name  { fill: var(--color-ink); font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .atr-t-kind  { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .atr-t-gate  { fill: var(--color-ink); font-size: 9px; letter-spacing: .03em; text-anchor: middle; }
          .atr-t-disk  { fill: var(--color-ch); font-size: 9.5px; letter-spacing: .05em; text-anchor: middle; }
          .atr-t-sub   { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .06em; text-anchor: middle; }
          .atr-t-head  { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .atr-t-leg   { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }

          .atr-t-edge {
            fill: var(--color-ink-2); font-size: 8px; letter-spacing: .05em; text-anchor: middle;
            stroke: var(--color-paper-2); stroke-width: 3.5px; stroke-linejoin: round;
            paint-order: stroke fill;
          }
          .atr-t-note {
            fill: var(--color-flag); font-size: 8.5px; letter-spacing: .06em; text-anchor: middle;
            stroke: var(--color-paper-2); stroke-width: 3.5px; stroke-linejoin: round;
            paint-order: stroke fill;
          }

          .atr-flow  { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .7; }
          .atr-degr  { stroke: var(--color-ink-3); stroke-width: 1; fill: none; stroke-dasharray: 3 3; opacity: .55; }
          .atr-fix   { stroke: var(--color-flag); stroke-width: 1; fill: none; stroke-dasharray: 2 3; opacity: .6; }
          .atr-pip   { fill: var(--color-ch); }

          .atr-pip-anim { animation: atr-ride 3.4s linear infinite; }
          @keyframes atr-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .atr-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="atr-t-head">
          ONE TURN · TWO GATES BEFORE ANY TEXT IS GENERATED
        </text>
        <text x={24} y={44} className="atr-t-leg">
          solid = the path a turn takes ┊ dashed grey = degradation ┊ dashed red = repair, after the fact
        </text>

        {DEGRADE.map(([f, t]) => (
          <path key={`d:${f}${t}`} d={pathFor(f, t)} className="atr-degr" />
        ))}

        {/* The verification backstop: drawn separately so it can be red-dashed. */}
        <path d={pathFor('PROBE', 'DATA')} className="atr-fix" />

        {FLOW.filter(([f, t]) => !(f === 'PROBE' && t === 'DATA')).map(([f, t]) => {
          const d = pathFor(f, t);
          return (
            <g key={`f:${f}${t}`}>
              <path d={d} className="atr-flow" />
              <circle
                r="2.5"
                className="atr-pip atr-pip-anim"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
              />
            </g>
          );
        })}

        {NODES.map(([id]) => {
          const n = NODE_BY_ID.get(id);
          return (
            <g key={id} style={{ transform: `translate(${n.cx}px, ${n.cy}px)` }}>
              {n.type === 'store' && (
                <>
                  <circle r={DISK_R} className="atr-disk" />
                  <circle r="2.5" className="atr-dot" />
                  <text y={-DISK_R - 8} className="atr-t-disk">
                    {n.label}
                  </text>
                </>
              )}
              {n.type === 'gate' && (
                <>
                  <path
                    d={`M 0 ${-GATE_R} L ${GATE_R} 0 L 0 ${GATE_R} L ${-GATE_R} 0 Z`}
                    className="atr-gate"
                  />
                  <text y={3} className="atr-t-gate">
                    {n.label}
                  </text>
                </>
              )}
              {n.type === 'worker' && (
                <>
                  <rect
                    x={-NODE_W / 2}
                    y={-NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    className="atr-box"
                  />
                  <text y={-4} className="atr-t-kind">
                    {n.kind}
                  </text>
                  <text y={12} className="atr-t-name">
                    {n.label}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {STORE_SUB.map(([id, text]) => {
          const n = NODE_BY_ID.get(id);
          return (
            <text key={`s:${id}`} x={n.cx} y={n.cy + DISK_R + 16} className="atr-t-sub">
              {text}
            </text>
          );
        })}

        {EDGE_LABEL.map(([f, t, text, side]) => {
          const m = midOf(f, t);
          const cls = f === 'PROBE' ? 'atr-t-note' : 'atr-t-edge';
          return (
            <text key={`l:${f}${t}`} x={m.x} y={m.y + (side === 'up' ? -6 : 13)} className={cls}>
              {text}
            </text>
          );
        })}

        {/* Sits under the reply box, because that is the thing it constrains:
            the chunks are already on screen by the time the probe runs. */}
        <text x={COL(5)} y={141} className="atr-t-note">
          CANNOT UN-SEND THESE
        </text>

        <text x={24} y={H - 16} className="atr-t-leg">
          LATENCIES MEASURED ON REAL CALLS · GATE 2 IS BIASED TOWARD &quot;MIGHT NEED A TOOL&quot; ON PURPOSE
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Both latencies are measured, not estimated: 1.05 s time-to-first-token on
        a real streaming WebSocket call, and 9.1 s for one measured
        reminder-creating turn through the non-streamed tool loop — a single
        observation, not an average. The red repair edge is the fix for a
        real SEV-1: a store phrased outside gate 2&apos;s regex used to stream a
        plausible confirmation with nothing written. Gate 2 is deliberately
        over-inclusive because the two error costs are asymmetric — a missed
        stream costs latency, a wrongly-streamed store loses data.
      </figcaption>
    </figure>
  );
}
