/**
 * Four declared paths, one that runs from a clean checkout.
 *
 * The project's identity is its agnostic architecture — engine and sink both
 * chosen at runtime — so the crossbar between the two engine boxes and the two
 * sink discs is the drawing. All four edges are real code that dispatches
 * correctly; what differs is whether anything is on the other end. Encoding that
 * as three edge states is the argument:
 *
 *   flow      solid + moving pip   runs from `docker compose up`
 *   declared  thin, static         dispatches, but needs manual Airflow setup
 *   dead      dashed, flagged      cannot connect at all
 *
 * Every box, disc and annotation maps to real code:
 *   - dags/gdelt_injestion.py fetches lastupdate.txt, picks the export.CSV.zip
 *     line, downloads and extractall()s into dags/data/raw. Nothing ever removes
 *     a file from that directory, which is the "never cleaned" annotation and the
 *     cause of the two divergent read behaviours beside it.
 *   - engines/pandas_processor.py reads glob.glob(input_path)[0] — one file, and
 *     glob does not sort, so after the first run it need not be the newest.
 *   - engines/spark_processor.py reads the whole glob, so each run re-aggregates
 *     all accumulated history and writes it under a fresh 15-minute doc_id.
 *   - sinks/elastic_sink.py passes doc_id as _id, so Elasticsearch upserts;
 *     sinks/postgres_sink.py appends with no key, and connects as admin to
 *     risk_db, neither of which docker-compose.yml ever creates. Hence both
 *     Postgres edges are drawn dead rather than merely untested.
 *   - The Spark edges are "declared" because SparkSubmitOperator uses
 *     conn_id='spark_default' and the DAG branches on an Airflow Variable, and
 *     nothing in the compose file or image provisions either one.
 *   - The centre annotation is the architectural point: the ~40 lines of filter,
 *     score and grouping exist once per engine, and have already diverged.
 *
 * The pips are the one animated element and they represent something real — a
 * batch actually moving along that path. They freeze under prefers-reduced-motion.
 */

const W = 1240;
/** Sized to the content: the lowest element is the Postgres subtitle at ~355,
 *  and the footer legend sits at H − 16. Any more than this renders as dead
 *  band, and the SVG scales to the column width so every unused unit shrinks
 *  the type. */
const H = 400;

const COL_CX = (i) => 100 + i * 186;

const NODE_W = 146;
const NODE_H = 46;
const DISK_R = 27;

const MID_Y = 214;
const ROW_GAP = 98;

/** [id, type, column, row, label, kind] — 'store' renders as a disc. */
const NODES = [
  ['FEED', 'store', 0, 0, 'gdelt feed'],
  ['DL', 'worker', 1, 0, 'download', 'PYTHONOPERATOR · UNZIP'],
  ['RAW', 'store', 2, 0, 'raw csv dir'],

  ['PANDAS', 'worker', 3, -1, 'pandas engine', 'READS glob()[0] · 1 FILE'],
  ['SPARK', 'worker', 3, 1, 'spark engine', 'READS ALL FILES'],

  ['ES', 'store', 4, -1, 'elasticsearch'],
  ['PG', 'store', 4, 1, 'postgres'],

  ['KIBANA', 'worker', 5, -1, 'kibana', 'HEATMAP · TIME SERIES'],
];

/** Runs from a clean checkout: both env vars default to this path. */
const FLOW = [
  ['FEED', 'DL'],
  ['DL', 'RAW'],
  ['RAW', 'PANDAS'],
  ['PANDAS', 'ES'],
  ['ES', 'KIBANA'],
];

/** Dispatches correctly, but the Spark connection and engine Variable are
 *  never provisioned anywhere in the repo. */
const DECLARED = [
  ['RAW', 'SPARK'],
  ['SPARK', 'ES'],
];

/** The sink connects as a user, to a database, that compose never creates. */
const DEAD = [
  ['PANDAS', 'PG'],
  ['SPARK', 'PG'],
];

/** Store subtitles. [id, text] */
const STORE_SUB = [
  ['FEED', 'NEW EXPORT EVERY 15 MIN'],
  ['RAW', 'NEVER CLEANED · GROWS EVERY RUN'],
  ['ES', 'UPSERTS ON doc_id'],
  ['PG', 'APPEND ONLY · risk_db NEVER CREATED'],
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

export default function GdeltRiskRadarPipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="grr-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="The GDELT risk pipeline drawn as four declared paths of which one runs from a clean checkout. GDELT publishes a new export every fifteen minutes; an Airflow Python task downloads and unzips it into a raw CSV directory that is never cleaned and grows every run. From there the pipeline forks to two interchangeable engines: the pandas engine, which reads only the first file returned by glob, and the Spark engine, which reads all accumulated files and so re-aggregates the entire history on every run. Each engine can write to either of two sinks, giving a full four-edge crossbar. The Elasticsearch sink upserts on the document id and feeds a Kibana heatmap. Both Postgres edges are drawn as dead, because the sink connects as a user and to a database that the compose file never creates. The two Spark edges are drawn as declared but static, because the Spark connection and the Airflow variable that selects the engine are never provisioned in the repository. Only the pandas to Elasticsearch path, the default for both environment variables, is drawn as live. A central annotation records that the forty lines of filtering, scoring and grouping exist once per engine and have already diverged."
      >
        <style>{`
          .grr-svg text { font-family: var(--font-data); }
          .grr-box    { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .grr-disk   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .grr-disk-x { fill: var(--color-paper); stroke: var(--color-flag); stroke-width: 1; stroke-dasharray: 3 2; opacity: .8; }
          .grr-dot    { fill: var(--color-ch); }
          .grr-dot-x  { fill: var(--color-flag); }

          .grr-t-name { fill: var(--color-ink); font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .grr-t-kind { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .grr-t-disk { fill: var(--color-ch); font-size: 9.5px; letter-spacing: .05em; text-anchor: middle; }
          .grr-t-disk-x { fill: var(--color-flag); font-size: 9.5px; letter-spacing: .05em; text-anchor: middle; }
          .grr-t-sub  { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .06em; text-anchor: middle; }
          .grr-t-sub-x { fill: var(--color-flag); font-size: 7.5px; letter-spacing: .06em; text-anchor: middle; }
          .grr-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .grr-t-legend { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }

          .grr-t-note {
            fill: var(--color-ink-2); font-size: 8.5px; letter-spacing: .06em;
            text-anchor: middle;
            stroke: var(--color-paper-2); stroke-width: 3.5px; stroke-linejoin: round;
            paint-order: stroke fill;
          }

          .grr-flow   { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .7; }
          .grr-decl   { stroke: var(--color-ink-3); stroke-width: 1; fill: none; opacity: .5; }
          .grr-dead   { stroke: var(--color-flag); stroke-width: 1; fill: none; stroke-dasharray: 2 3; opacity: .5; }
          .grr-pip    { fill: var(--color-ch); }

          .grr-pip-anim { animation: grr-ride 3.2s linear infinite; }
          @keyframes grr-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .grr-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="grr-t-head">
          FEED → DOWNLOAD → RAW DIR → ENGINE × SINK → DASHBOARD
        </text>

        <text x={24} y={44} className="grr-t-legend">
          moving = runs from a clean checkout ┊ thin = dispatches, needs manual setup ┊ dashed = cannot connect
        </text>

        {DEAD.map(([from, to]) => (
          <path key={`x:${from}->${to}`} d={pathFor(from, to)} className="grr-dead" />
        ))}

        {DECLARED.map(([from, to]) => (
          <path key={`d:${from}->${to}`} d={pathFor(from, to)} className="grr-decl" />
        ))}

        {FLOW.map(([from, to]) => {
          const d = pathFor(from, to);
          return (
            <g key={`f:${from}->${to}`}>
              <path d={d} className="grr-flow" />
              <circle
                r="2.5"
                className="grr-pip grr-pip-anim"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
              />
            </g>
          );
        })}

        {NODES.map(([id]) => {
          const n = NODE_BY_ID.get(id);
          const dead = id === 'PG';
          return (
            <g key={id} style={{ transform: `translate(${n.cx}px, ${n.cy}px)` }}>
              {n.type === 'store' ? (
                <>
                  <circle r={DISK_R} className={dead ? 'grr-disk-x' : 'grr-disk'} />
                  <circle r="2.5" className={dead ? 'grr-dot-x' : 'grr-dot'} />
                  <text y={-DISK_R - 8} className={dead ? 'grr-t-disk-x' : 'grr-t-disk'}>
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
                    className="grr-box"
                  />
                  <text y={-4} className="grr-t-kind">
                    {n.kind}
                  </text>
                  <text y={12} className="grr-t-name">
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
            <text
              key={`s:${id}`}
              x={n.cx}
              y={n.cy + DISK_R + 16}
              className={id === 'PG' ? 'grr-t-sub-x' : 'grr-t-sub'}
            >
              {text}
            </text>
          );
        })}

        {/* The architectural point, placed in the gap the crossbar leaves open
            between the two engines. Haloed so the edges pass behind it. */}
        <text x={COL_CX(3)} y={MID_Y - 4} className="grr-t-note">
          SAME 40 LINES OF FILTER, SCORE AND GROUPING
        </text>
        <text x={COL_CX(3)} y={MID_Y + 9} className="grr-t-note">
          IMPLEMENTED TWICE — ALREADY DIVERGED
        </text>

        <text x={24} y={H - 16} className="grr-t-legend">
          4 DECLARED PIPELINES · 1 RUNS FROM A CLEAN CHECKOUT
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Counted from the repo: 368 lines of Python across 13 files, GDELT 2.0&apos;s
        61 columns mapped positionally in both engines, 2 of 20 CAMEO root codes
        filtered (14 protest, 19 fight). The three edge states are read from the
        code, not guessed: both Postgres edges connect as a user and to a database
        the compose file never creates, and the two Spark edges depend on an
        Airflow connection and variable that the repository never provisions. No
        throughput or runtime is shown because no run was ever measured.
      </figcaption>
    </figure>
  );
}
