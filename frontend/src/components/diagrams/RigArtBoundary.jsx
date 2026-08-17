/**
 * The line the generative model is not allowed to cross.
 *
 * This project's one transferable rule is that a generative image model should
 * supply pixels and never structure, and it was arrived at by elimination —
 * every design that let the model own something structural failed. So the
 * drawing is not a pipeline diagram with a boundary added; the boundary IS the
 * diagram, and each node's position states who owns that step.
 *
 * Above the line: code and human-authored files. Below: the model.
 *
 * Every node and label maps to real code:
 *   - shared/rig-contract.ts — the archetype selects the style reference and the
 *     costume wording that go into the prompt. Two archetypes are bone-identical
 *     and exist only for this, which is why the disc is above the line.
 *   - stages/rig-art-provider.ts + part-detector.ts — the model returns an
 *     exploded sheet of non-touching islands. It was previously asked to LOCATE
 *     parts on an assembled figure; that produced boxes that did not line up,
 *     which is the failure this layout is the answer to.
 *   - stages/blob-splitter.ts — connected-component analysis finds the islands.
 *     Deterministic, verifiable, above the line: geometry locates.
 *   - stages/part-labeller.ts — a vision model is handed regions it did not
 *     choose and asked only to name them. Below the line, and narrowly scoped.
 *   - stages/skeleton-loader.ts — the skeleton is hand-authored and full-canvas
 *     (part files are cropped; the asymmetry is load-bearing, because the
 *     skeleton is the only copy of the layout).
 *   - shared/rig-contract.ts `missingFromContract` — completeness is checked by
 *     code against the archetype, so a rig missing a required bone is rejected
 *     at import rather than discovered at render.
 *
 * The four crossings are the argument: the model is handed a prompt and returns
 * pixels, then is handed regions and returns names. It never decides layout,
 * identity, or whether a rig is complete.
 */

const W = 1240;
const H = 430;

const COL = (i) => 96 + i * 158;

const NODE_W = 146;
const NODE_H = 46;
const DISK_R = 27;

/** The boundary. Everything above is deterministic or hand-authored. */
const RULE_Y = 256;
const ABOVE_Y = 176;
const BELOW_Y = 336;

/** [id, type, col, y, label, kind] */
const NODES = [
  ['REF', 'store', 0, ABOVE_Y, 'style ref'],
  ['PROMPT', 'worker', 1, ABOVE_Y, 'prompt build', 'CODE · COSTUME WORDING'],
  ['MODEL', 'worker', 2, BELOW_Y, 'image model', 'PIXELS ONLY'],
  ['SHEET', 'store', 3, BELOW_Y, 'exploded sheet'],
  ['CC', 'worker', 4, ABOVE_Y, 'connected parts', 'GEOMETRY LOCATES'],
  ['LABEL', 'worker', 5, BELOW_Y, 'vision labeller', 'NAMES ONLY'],
  ['SKEL', 'store', 6, 100, 'skeleton'],
  ['RIG', 'worker', 6, ABOVE_Y, 'rig', 'CONTRACT-CHECKED'],
];

const FLOW = [
  ['REF', 'PROMPT'],
  ['PROMPT', 'MODEL'],
  ['MODEL', 'SHEET'],
  ['SHEET', 'CC'],
  ['CC', 'LABEL'],
  ['LABEL', 'RIG'],
  ['SKEL', 'RIG'],
];

const STORE_SUB = [
  ['REF', 'ARCHETYPE PICKS IT'],
  ['SHEET', 'NON-TOUCHING ISLANDS'],
  ['SKEL', 'OWNS LAYOUT · FULL-CANVAS'],
];

const NODE_BY_ID = new Map(
  NODES.map(([id, type, col, y, label, kind]) => [
    id,
    { id, type, cx: COL(col), cy: y, label, kind },
  ]),
);

const halfW = (n) => (n.type === 'store' ? DISK_R : NODE_W / 2);
const halfH = (n) => (n.type === 'store' ? DISK_R : NODE_H / 2);

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

/** An edge is a handover if its endpoints sit on opposite sides of the rule. */
const crosses = (from, to) => {
  const a = NODE_BY_ID.get(from).cy;
  const b = NODE_BY_ID.get(to).cy;
  return a < RULE_Y !== b < RULE_Y;
};

export default function RigArtBoundary() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="rab-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="The boundary between what the generative model is trusted with and what it is not. A horizontal rule divides the diagram: above it is structure, owned by code and hand-authored files; below it is pixels, owned by the generative model. A style reference, selected by the character's costume archetype, feeds a prompt builder — both above the line. The prompt crosses down to the image model, which returns an exploded sheet of non-touching part islands: pixels only. That sheet crosses back up to connected-component analysis, which locates the islands deterministically. The located regions cross down to a vision model, which is asked only to name regions it did not choose. The named parts cross back up into rig assembly, which also receives a hand-authored, full-canvas skeleton that owns all layout, and the finished rig is checked for completeness against the contract by code. Four handovers cross the line in total. The model never decides layout, identity, or whether a rig is complete."
      >
        <style>{`
          .rab-svg text { font-family: var(--font-data); }
          .rab-box  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .rab-disk { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .rab-dot  { fill: var(--color-ch); }
          .rab-rule { stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 5 4; opacity: .6; }

          .rab-t-name { fill: var(--color-ink); font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .rab-t-kind { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .rab-t-disk { fill: var(--color-ch); font-size: 9.5px; letter-spacing: .05em; text-anchor: middle; }
          /* Haloed: the skeleton's edge runs vertically through the centre of
             its own subtitle, so the stroke lets the line pass behind the text
             instead of bisecting it. */
          .rab-t-sub  {
            fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .06em;
            text-anchor: middle;
            stroke: var(--color-paper-2); stroke-width: 3px; stroke-linejoin: round;
            paint-order: stroke fill;
          }
          .rab-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .rab-t-leg  { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }
          .rab-t-band { fill: var(--color-ink-2); font-size: 8.5px; letter-spacing: .09em; }

          .rab-flow  { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .7; }
          .rab-cross { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .7; }
          .rab-pip   { fill: var(--color-ch); }

          .rab-pip-anim { animation: rab-ride 3.4s linear infinite; }
          @keyframes rab-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .rab-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="rab-t-head">
          THE LINE THE MODEL DOES NOT CROSS
        </text>
        <text x={24} y={44} className="rab-t-leg">
          a node&apos;s side of the rule is who owns that step
        </text>

        <line x1={40} y1={RULE_Y} x2={W - 40} y2={RULE_Y} className="rab-rule" />
        <text x={40} y={RULE_Y - 8} className="rab-t-band">
          STRUCTURE · CODE AND HUMAN-AUTHORED FILES
        </text>
        <text x={40} y={RULE_Y + 16} className="rab-t-band">
          PIXELS · WHAT THE MODEL IS TRUSTED WITH
        </text>

        {FLOW.map(([from, to]) => {
          const d = pathFor(from, to);
          return (
            <g key={`f:${from}${to}`}>
              <path d={d} className={crosses(from, to) ? 'rab-cross' : 'rab-flow'} />
              <circle
                r="2.5"
                className="rab-pip rab-pip-anim"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
              />
            </g>
          );
        })}

        {NODES.map(([id]) => {
          const n = NODE_BY_ID.get(id);
          return (
            <g key={id} style={{ transform: `translate(${n.cx}px, ${n.cy}px)` }}>
              {n.type === 'store' ? (
                <>
                  <circle r={DISK_R} className="rab-disk" />
                  <circle r="2.5" className="rab-dot" />
                  <text y={-DISK_R - 8} className="rab-t-disk">
                    {n.label}
                  </text>
                </>
              ) : (
                <>
                  <rect
                    x={-NODE_W / 2}
                    y={-NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    className="rab-box"
                  />
                  <text y={-4} className="rab-t-kind">
                    {n.kind}
                  </text>
                  <text y={12} className="rab-t-name">
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
            <text key={`s:${id}`} x={n.cx} y={n.cy + DISK_R + 16} className="rab-t-sub">
              {text}
            </text>
          );
        })}

        <text x={24} y={H - 16} className="rab-t-leg">
          4 HANDOVERS ACROSS THE LINE · THE MODEL NEVER DECIDES LAYOUT, IDENTITY OR COMPLETENESS
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Read from the repo, not proposed: an earlier design asked a vision model
        to locate parts on an assembled figure and the boxes did not line up,
        which is the failure this split is the answer to. Counted from the
        contract: 29 bones across 7 archetypes, 8 visemes, 12 expressions, 12
        gestures, 4 angles. The skeleton is full-canvas while part files are
        cropped — that asymmetry is deliberate, because the skeleton is the only
        copy of the layout. No render timings are shown; none were measured.
      </figcaption>
    </figure>
  );
}
