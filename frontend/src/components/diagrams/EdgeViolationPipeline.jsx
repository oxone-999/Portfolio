/**
 * Edge_I — the deployed camera-to-browser topology.
 *
 * Unlike the Event Exchange diagram, this one does not cycle: this is a single
 * fixed deployment, not a composable framework, and inventing alternate shapes
 * it never ran in would be decoration.
 *
 * Every node and edge is traceable to config in the repo (topic and camera
 * names below are genericised — the real deployment's identifiers name an
 * actual client and don't belong in a public portfolio):
 *   - four `producer-stream` services, one per camera, each with
 *     PRODUCE_TOPIC: CAM<n>,LIVE — hence two out-edges per producer
 *   - one relay with CONSUME_TOPIC: CAM1,CAM2,CAM3,CAM4
 *     and PRODUCE_TOPIC: VIOLATIONS — hence the four-way fan-in
 *   - cp_face_detector consumes VIOLATIONS, cp_live_reporter consumes
 *     LIVE — two independent consumer groups, so the live lane never
 *     waits on face detection
 *   - both post to the FastAPI app, which fans out over per-camera WebSockets
 *     and writes violations to MariaDB plus JPEGs on disk
 *
 * Topics are circles, services are boxes — a topic buffers, a service
 * processes, and the shape difference carries that rather than decorating it.
 *
 * Inlined as a component rather than an <img>-referenced SVG because
 * `prefers-reduced-motion` never reaches an embedded SVG document, so an
 * animated one would run forever regardless of the visitor's setting.
 */

const W = 1240;
const H = 450;

const COL_PITCH = 170;
const COL_CX = (i) => 100 + i * COL_PITCH;

const NODE_W = 132;
const NODE_H = 46;
const TOPIC_R = 26;

const MID_Y = 195;
const SLOT_Y = (slot) => MID_Y + slot * 60;

/**
 * [id, type, column, slot, label, kindLabel]
 *
 * The four per-camera topics carry their index inside the circle rather than a
 * name above it: the topic is named after the camera, the producer box already
 * spells that name out, and repeating it four times over stacked circles only
 * crowds them. A single column header names the family instead.
 */
const NODES = [
  ['PS1', 'worker', 0, -1.7, 'CAM 1', 'PRODUCER-STREAM'],
  ['PS2', 'worker', 0, -0.57, 'CAM 2', 'PRODUCER-STREAM'],
  ['PS3', 'worker', 0, 0.57, 'CAM 3', 'PRODUCER-STREAM'],
  ['PS4', 'worker', 0, 1.7, 'CAM 4', 'PRODUCER-STREAM'],

  ['T1', 'topic', 1, -1.7, '1'],
  ['T2', 'topic', 1, -0.57, '2'],
  ['T3', 'topic', 1, 0.57, '3'],
  ['T4', 'topic', 1, 1.7, '4'],
  ['TL', 'topic', 1, 3, 'LIVE'],

  ['CR', 'worker', 2, 0, 'face detector', 'CONSUMER-RELAY'],
  ['TV', 'topic', 3, 0, 'VIOLATIONS'],

  ['CPF', 'worker', 4, 0, 'report_face', 'CONSUMER-POST'],
  ['CPL', 'worker', 4, 3, 'report_live', 'CONSUMER-POST'],

  ['API', 'worker', 5, 1.5, 'FastAPI', 'APP BACKEND'],

  ['DB', 'worker', 6, 0, 'MariaDB + JPEG', 'STORE'],
  ['UI', 'worker', 6, 3, 'React client', 'BROWSER'],
];

/** [from, to, lane] — lane 'live' is the un-analysed passthrough stream. */
const EDGES = [
  ['PS1', 'T1'], ['PS2', 'T2'], ['PS3', 'T3'], ['PS4', 'T4'],
  ['PS1', 'TL', 'live'], ['PS2', 'TL', 'live'], ['PS3', 'TL', 'live'], ['PS4', 'TL', 'live'],

  ['T1', 'CR'], ['T2', 'CR'], ['T3', 'CR'], ['T4', 'CR'],
  ['CR', 'TV'], ['TV', 'CPF'],

  ['TL', 'CPL', 'live'],

  ['CPF', 'API'], ['CPL', 'API', 'live'],
  ['API', 'DB'], ['API', 'UI', 'live'],
];

const NODE_BY_ID = new Map(
  NODES.map(([id, type, col, slot, label, kind]) => [
    id,
    { id, type, cx: COL_CX(col), cy: SLOT_Y(slot), label, kind },
  ]),
);

/** A service connects on its box edge; a topic on its rim. */
function resolvePoint(id, isSource) {
  const node = NODE_BY_ID.get(id);
  if (node.type === 'topic') {
    return { x: node.cx + (isSource ? TOPIC_R : -TOPIC_R), y: node.cy };
  }
  return { x: node.cx + (isSource ? NODE_W / 2 : -NODE_W / 2), y: node.cy };
}

function edgePath(p1, p2) {
  const dx = Math.max(28, (p2.x - p1.x) * 0.45);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

export default function EdgeViolationPipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="edge-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="Deployed topology. Four producer-stream services, one per camera, each publish every sampled frame to two Kafka topics: their own per-camera topic and a shared LIVE topic. A single consumer-relay subscribes to all four per-camera topics, runs face detection, and republishes only frames containing a detection to VIOLATIONS. One consumer-post drains VIOLATIONS, another drains LIVE, and both post into the FastAPI backend, which writes violations to MariaDB and JPEG files on disk and pushes frames to the React client over per-camera WebSockets."
      >
        <style>{`
          .edge-svg text { font-family: var(--font-data); }
          .edge-box    { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .edge-topic  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .edge-dot    { fill: var(--color-ch); }
          .edge-t-name { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .04em; text-anchor: middle; }
          .edge-t-kind { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .1em; text-anchor: middle; }
          .edge-t-topic{ fill: var(--color-ch); font-size: 8.5px; letter-spacing: .06em; text-anchor: middle; }
          .edge-t-head { fill: var(--color-ink-3); font-size: 9.5px; letter-spacing: .1em; }
          .edge-flow   { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .65; }
          .edge-flow-live { stroke-dasharray: 4 3; opacity: .45; }
          .edge-pip    { fill: var(--color-ch); }

          .edge-pip-anim { animation: edge-ride 2.2s linear infinite; }
          @keyframes edge-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }

          @media (prefers-reduced-motion: reduce) {
            .edge-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="edge-t-head">
          RTSP → KAFKA → DETECTION → BROWSER
        </text>

        <text x={COL_CX(1)} y={52} className="edge-t-topic">
          CAM 1–4
        </text>

        {EDGES.map(([from, to, lane]) => {
          const d = edgePath(resolvePoint(from, true), resolvePoint(to, false));
          return (
            <g key={`${from}->${to}`}>
              <path d={d} className={`edge-flow ${lane === 'live' ? 'edge-flow-live' : ''}`} />
              <circle
                r="2.6"
                className="edge-pip edge-pip-anim"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
              />
            </g>
          );
        })}

        {NODES.map(([id]) => {
          const n = NODE_BY_ID.get(id);
          return (
            <g key={id} style={{ transform: `translate(${n.cx}px, ${n.cy}px)` }}>
              {n.type === 'topic' ? (
                <>
                  <circle r={TOPIC_R} className="edge-topic" />
                  {n.label.length <= 2 ? (
                    <text y={4} className="edge-t-topic">
                      {n.label}
                    </text>
                  ) : (
                    <>
                      <circle r="2.6" className="edge-dot" />
                      <text y={-TOPIC_R - 8} className="edge-t-topic">
                        {n.label}
                      </text>
                    </>
                  )}
                </>
              ) : (
                <>
                  <rect
                    x={-NODE_W / 2}
                    y={-NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    className="edge-box"
                  />
                  <text y={-4} className="edge-t-kind">
                    {n.kind}
                  </text>
                  <text y={13} className="edge-t-name">
                    {n.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Solid = violation lane · dashed = live-view lane. Counted from config: 4
        producers, 6 topics, 3 consumers, 2 consumer groups.
      </figcaption>
    </figure>
  );
}
