/**
 * How one console form becomes one running pipeline stack.
 *
 * This project's whole idea is that the console never touches video. It is a
 * code generator and a process supervisor: a form submission is turned into a
 * per-stream compose file plus a tree of rewritten processor configs, and then
 * handed to the host Docker daemon. So the diagram is deliberately *not* a
 * dataflow — it is a build pipeline, ending where the previous project's
 * diagram begins.
 *
 * Every box maps to real code, read from the repo:
 *   - StreamCreationOrchestrator / StreamConfigurationProcessor build a
 *     TemplateConfig from the submitted form
 *   - TemplateFileManager copies templates/multilingual-runtime/* into a
 *     stream-scoped directory, renaming generic folders (hindi-translator →
 *     hindi-translator-<streamId>)
 *   - ProcessorConfigManager rewrites each app_config.yaml, injecting the
 *     stream-scoped topic and consumer-group names derived in pipelineWiring.ts
 *   - DockerComposeGenerator writes the compose object
 *   - ComposeOperations shells out to the Docker CLI — there is no dockerode
 *
 * The split between "writes files" and "starts containers" is real and load
 * bearing: POST /api/streams only generates, POST /api/streams/run/:id runs.
 * That's why the diagram has a gate between them.
 */

const W = 1180;
const H = 366;

const COL_CX = (i) => 118 + i * 190;

const NODE_W = 146;
const NODE_H = 46;
const DISK_R = 26;

const MID_Y = 210;
const SLOT_Y = (slot) => MID_Y + slot * 74;

/** [id, type, column, slot, label, kind] — 'store' renders as a disc. */
const NODES = [
  ['FORM', 'worker', 0, 0, 'create stream', 'CONSOLE FORM'],
  ['CFG', 'worker', 1, 0, 'config processor', 'VALIDATE → TEMPLATECONFIG'],

  ['TPL', 'worker', 2, -1, 'template copier', 'SCOPED FOLDERS'],
  ['PROC', 'worker', 2, 0, 'config rewriter', 'TOPIC NAMES'],
  ['COMP', 'worker', 2, 1, 'compose writer', 'PER-STREAM YAML'],

  ['DISK', 'store', 3, 0, 'stream dir'],
  ['RUN', 'worker', 4, 0, 'docker CLI', 'COMPOSE UP -D'],
  ['STACK', 'worker', 5, 0, 'pipeline stack', 'ONE MATCH'],
];

const EDGES = [
  ['FORM', 'CFG'],
  ['CFG', 'TPL'],
  ['CFG', 'PROC'],
  ['CFG', 'COMP'],
  ['TPL', 'DISK'],
  ['PROC', 'DISK'],
  ['COMP', 'DISK'],
  ['DISK', 'RUN'],
  ['RUN', 'STACK'],
];

const NODE_BY_ID = new Map(
  NODES.map(([id, type, col, slot, label, kind]) => [
    id,
    { id, type, cx: COL_CX(col), cy: SLOT_Y(slot), label, kind },
  ]),
);

function resolvePoint(id, isSource) {
  const n = NODE_BY_ID.get(id);
  const half = n.type === 'store' ? DISK_R : NODE_W / 2;
  return { x: n.cx + (isSource ? half : -half), y: n.cy };
}

function edgePath(p1, p2) {
  const dx = Math.max(26, (p2.x - p1.x) * 0.45);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

/** The gate between "generated" and "running" — two different API calls. */
const GATE_X = (COL_CX(3) + COL_CX(4)) / 2;

export default function ConsoleTemplatePipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="ctp-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="How one console form becomes a running pipeline. An operator submits the create-stream form; a configuration processor validates it into a template config. Three generators then run: a template copier that clones the runtime templates into stream-scoped folders, a config rewriter that injects stream-scoped Kafka topic and consumer-group names into each processor's config, and a compose writer that emits a per-stream docker-compose file. All three write into one stream directory on disk. That is where creation stops. A separate run request shells out to the host Docker CLI, which brings up the generated stack — one isolated pipeline for one match."
      >
        <style>{`
          .ctp-svg text { font-family: var(--font-data); }
          .ctp-box    { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .ctp-disk   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .ctp-dot    { fill: var(--color-ch); }
          .ctp-t-name { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .03em; text-anchor: middle; }
          .ctp-t-kind { fill: var(--color-ink-3); font-size: 7px; letter-spacing: .09em; text-anchor: middle; }
          .ctp-t-disk { fill: var(--color-ch); font-size: 8.5px; letter-spacing: .05em; text-anchor: middle; }
          .ctp-t-head { fill: var(--color-ink-3); font-size: 9.5px; letter-spacing: .1em; }
          .ctp-t-gate { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .07em; text-anchor: middle; }
          .ctp-flow   { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .65; }
          .ctp-gate   { stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 2 3; opacity: .55; }
          .ctp-pip    { fill: var(--color-ch); }

          .ctp-pip-anim { animation: ctp-ride 2.4s linear infinite; }
          @keyframes ctp-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .ctp-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="ctp-t-head">
          FORM → GENERATE → DISK ┊ RUN → ISOLATED STACK
        </text>

        {/* the gate: creation writes files, a second call starts containers */}
        <line x1={GATE_X} y1={62} x2={GATE_X} y2={H - 40} className="ctp-gate" />
        <text x={GATE_X} y={52} className="ctp-t-gate">
          POST /streams ┊ POST /streams/run/:id
        </text>

        {EDGES.map(([from, to]) => {
          const d = edgePath(resolvePoint(from, true), resolvePoint(to, false));
          return (
            <g key={`${from}->${to}`}>
              <path d={d} className="ctp-flow" />
              <circle
                r="2.5"
                className="ctp-pip ctp-pip-anim"
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
                  <circle r={DISK_R} className="ctp-disk" />
                  <circle r="2.5" className="ctp-dot" />
                  <text y={-DISK_R - 8} className="ctp-t-disk">
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
                    className="ctp-box"
                  />
                  <text y={-4} className="ctp-t-kind">
                    {n.kind}
                  </text>
                  <text y={12} className="ctp-t-name">
                    {n.label}
                  </text>
                </>
              )}
            </g>
          );
        })}

        <text x={COL_CX(5)} y={H - 16} className="ctp-t-gate">
          → hands off to the streaming pipeline
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        The console generates and supervises; it never touches a video frame.
        Counted from the repo: 5 languages derived from one list, 3 roles, one
        compose file per match.
      </figcaption>
    </figure>
  );
}
