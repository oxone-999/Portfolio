/**
 * One JSON spec becoming three tiers of source code.
 *
 * AppGen takes a data model — entities and their fields — and emits a working
 * CRUD application: a React frontend, a Node/Express backend and the MariaDB
 * schema to sit under them. The interesting thing to draw is the fan-out: a
 * single spec hits a coordinator that calls three generators, each of which
 * mixes *templated* files (built per entity from the spec) with *static* files
 * (copied verbatim), assembles a tree on disk, and zips it.
 *
 * Every box and count maps to real code in the repo:
 *   - gui_frontend/src/Components/Home.js — the spec arrives as hand-edited
 *     JSON or via the CSV import path, validated client-side only, then POSTed
 *     to /api/generate
 *   - gui_backend/execution-coordinator/executionCoordinator.js — three
 *     hardcoded awaited calls, in fixed order: node, then mariadb, then react.
 *     This is the "extensibility seam", and it is three require()s and three
 *     function calls, which is why the diagram says 1 stack rather than many
 *   - each tier's contentGenerator/ directory holds the per-file emitters
 *     (9 for node, 9 for react, 2 for mariadb = 20), while staticFiles/ holds
 *     the 19 files copied through untouched
 *   - per entity the backend emits 5 controllers and the frontend 4 pages, so
 *     the output grows linearly with the entity count
 *   - gui_backend/app-manager/app-manager.js — zips Output/{userId}/{jsonName}
 *     and schedules deletion 10 minutes later
 *
 * The dashed gate is the honest part of the drawing: generation reports success
 * unconditionally. Each generator wraps its work in a try/catch that only logs,
 * so a spec that breaks one emitter still produces a zip — just an incomplete
 * one. That is drawn as a gate rather than a failure edge because there is no
 * failure edge in the code.
 */

const W = 1240;
const H = 440;

const COL_CX = (i) => 104 + i * 176;

const NODE_W = 142;
const NODE_H = 46;
const DISK_R = 27;

const MID_Y = 216;
const ROW_GAP = 82;

/** [id, type, column, row, label, kind] — 'store' renders as a disc. */
const NODES = [
  ['SPEC', 'store', 0, 0, 'app spec'],
  ['API', 'worker', 1, 0, 'generate', 'EXPRESS · POST'],
  ['COORD', 'worker', 2, 0, 'coordinator', '3 CALLS · FIXED ORDER'],

  ['NODE', 'worker', 3, -1, 'node backend', '9 EMITTERS · 5 / ENTITY'],
  ['DB', 'worker', 3, 0, 'mariadb schema', '2 EMITTERS · DDL'],
  ['REACT', 'worker', 3, 1, 'react frontend', '9 EMITTERS · 4 / ENTITY'],

  ['TREE', 'worker', 4, 0, 'output tree', 'TEMPLATED + 19 COPIED'],
  ['ZIP', 'store', 5, 0, 'app.zip'],
  ['STATIC', 'store', 4, -2, 'static files'],
];

/** Solid, animated: the spec and the emitted code actually move along these. */
const FLOW = [
  ['SPEC', 'API'],
  ['API', 'COORD'],
  ['COORD', 'NODE'],
  ['COORD', 'DB'],
  ['COORD', 'REACT'],
  ['NODE', 'TREE'],
  ['DB', 'TREE'],
  ['REACT', 'TREE'],
  ['TREE', 'ZIP'],
];

/** Dashed, static: copied verbatim rather than generated from the spec. */
const READS = [['STATIC', 'TREE']];

/** Store subtitles. [id, text] */
const STORE_SUB = [
  ['SPEC', 'ENTITIES + FIELDS · 5 FIELDS IGNORED'],
  ['ZIP', 'DELETED AFTER 10 MIN'],
  ['STATIC', 'COPIED, NOT TEMPLATED'],
];

const NODE_BY_ID = new Map(
  NODES.map(([id, type, col, row, label, kind]) => [
    id,
    { id, type, cx: COL_CX(col), cy: MID_Y + row * ROW_GAP, label, kind },
  ]),
);

const halfW = (n) => (n.type === 'store' ? DISK_R : NODE_W / 2);
const halfH = (n) => (n.type === 'store' ? DISK_R : NODE_H / 2);

/** Leave a node from whichever face actually points at the other node. */
function anchor(from, to) {
  const a = NODE_BY_ID.get(from);
  const b = NODE_BY_ID.get(to);
  if (Math.abs(b.cy - a.cy) > Math.abs(b.cx - a.cx)) {
    return { x: a.cx, y: a.cy + Math.sign(b.cy - a.cy) * halfH(a) };
  }
  return { x: a.cx + Math.sign(b.cx - a.cx) * halfW(a), y: a.cy };
}

/** Bend along the dominant axis so vertical edges don't loop sideways. */
function edgePath(p1, p2) {
  if (Math.abs(p2.y - p1.y) > Math.abs(p2.x - p1.x)) {
    const dy = (p2.y - p1.y) * 0.5;
    return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy}, ${p2.x} ${p2.y - dy}, ${p2.x} ${p2.y}`;
  }
  const dx = Math.max(26, Math.abs(p2.x - p1.x) * 0.45) * Math.sign(p2.x - p1.x || 1);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

const pathFor = (from, to) => edgePath(anchor(from, to), anchor(to, from));

/** The gate: everything right of it is reported as success either way. */
const GATE_X = (COL_CX(4) + COL_CX(5)) / 2;

export default function AppSpecCodegenPipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="asc-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="One JSON specification becoming three tiers of source code. A data model describing entities and their fields — five of its declared fields are never read by any generator — is posted to an Express generate endpoint. A coordinator then calls three generators in a fixed order by direct function call: a Node backend generator with 9 file emitters producing 5 controllers per entity, a MariaDB schema generator with 2 emitters producing the DDL, and a React frontend generator with 9 emitters producing 4 pages per entity. All three write into one output tree, which also receives 19 static files copied verbatim rather than generated. The tree is zipped and offered as a download, then deleted ten minutes later. A dashed gate before the zip marks the honest limitation: each generator catches its own errors and only logs them, so an incomplete generation is still zipped and still reported as a success."
      >
        <style>{`
          .asc-svg text { font-family: var(--font-data); }
          .asc-box    { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .asc-disk   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .asc-dot    { fill: var(--color-ch); }
          .asc-t-name { fill: var(--color-ink); font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .asc-t-kind { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .asc-t-disk { fill: var(--color-ch); font-size: 9.5px; letter-spacing: .05em; text-anchor: middle; }
          .asc-t-sub  { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .06em; text-anchor: middle; }
          .asc-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .asc-t-legend { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }
          .asc-t-gate { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; text-anchor: end; }
          .asc-flow   { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .65; }
          .asc-read   { stroke: var(--color-ink-3); stroke-width: 1; fill: none; stroke-dasharray: 2 3; opacity: .5; }
          .asc-gate   { stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 2 3; opacity: .55; }
          .asc-pip    { fill: var(--color-ch); }

          .asc-pip-anim { animation: asc-ride 2.8s linear infinite; }
          @keyframes asc-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .asc-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="asc-t-head">
          SPEC → COORDINATOR → THREE GENERATORS → TREE → ZIP
        </text>

        <text x={24} y={44} className="asc-t-legend">
          dashed = copied verbatim ┊ solid = generated from the spec
        </text>

        <line x1={GATE_X} y1={62} x2={GATE_X} y2={H - 30} className="asc-gate" />
        {/* Placed at the foot of the gate line, clear of the static-files disc
            which sits high on the same column. */}
        <text x={GATE_X - 8} y={H - 16} className="asc-t-gate">
          SUCCESS REPORTED EITHER WAY
        </text>

        {READS.map(([from, to]) => (
          <path key={`r:${from}->${to}`} d={pathFor(from, to)} className="asc-read" />
        ))}

        {FLOW.map(([from, to]) => {
          const d = pathFor(from, to);
          return (
            <g key={`f:${from}->${to}`}>
              <path d={d} className="asc-flow" />
              <circle
                r="2.5"
                className="asc-pip asc-pip-anim"
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
                  <circle r={DISK_R} className="asc-disk" />
                  <circle r="2.5" className="asc-dot" />
                  <text y={-DISK_R - 8} className="asc-t-disk">
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
                    className="asc-box"
                  />
                  <text y={-4} className="asc-t-kind">
                    {n.kind}
                  </text>
                  <text y={12} className="asc-t-name">
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
            <text key={`s:${id}`} x={n.cx} y={n.cy + DISK_R + 16} className="asc-t-sub">
              {text}
            </text>
          );
        })}
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Counted from the repo: 20 generator modules across 3 tiers, 19 files
        copied verbatim, 9 files emitted per entity, 2,778 lines of hand-written
        source. One target stack is implemented of the several the README
        advertises — the coordinator is three hardcoded calls, not a registry.
        No generation timing is shown because none was measured.
      </figcaption>
    </figure>
  );
}
