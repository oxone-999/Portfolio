/**
 * How a row in a database becomes a running Spark job.
 *
 * Recon+ has no pipeline definition in code. The Airflow DAG is a *reader*: it
 * queries the metamodel for blocks, then for the parent notebooks those blocks
 * need, then for the tables each notebook owns — expanding a new set of tasks at
 * every step via Airflow dynamic task mapping. So the left half of this diagram
 * is not a dataflow at all; it is a query plan turning into a task graph.
 *
 * Every box and every read edge maps to real code:
 *   - dags/recon_plus_orchestrator.py — MetamodelQueries holds the three SQL
 *     statements; fetch_pipeline_blocks / find_parent_notebooks.expand /
 *     fetch_block_tables.expand are the three fan-out stages, each followed by
 *     flatten_lists to dedup
 *   - execute_dynamic_engine builds a LivyOperator per table, pointing at
 *     recon/execution/execute_parent.py on S3 with recon_framework_fat.zip as
 *     py_files and recon_env.tar.gz as the archive — that is why the framework
 *     ships through object storage rather than being installed on the cluster
 *   - recon/parent_notebooks/nb_parent_src_tgt.py — reads mapping + STTM +
 *     test-case list back out of the metamodel from *inside* Spark, fetches
 *     source and target, then dispatches checks through a ThreadPoolExecutor
 *     sized by the client's concurrency_limit
 *   - save_bulk_reports writes two Elasticsearch indices, <prefix>summary and
 *     <prefix>details, and details documents are only built for failures
 *
 * Two edge styles, because they are two different things: solid animated edges
 * carry data or control, dashed static edges are configuration reads. The
 * dashed edge from the metamodel across the gate into the Spark job is the one
 * worth noticing — it is the coupling ADR-003 names as the system's bottleneck.
 */

/**
 * Seven columns is the widest of the diagrams here, so the viewBox is kept as
 * narrow as the content allows: the SVG scales to the column width, and every
 * extra user unit shrinks the type at render size.
 */
const W = 1240;
const H = 430;

const COL_CX = (i) => 96 + i * 172;

const NODE_W = 138;
const NODE_H = 46;
const DISK_R = 27;

const MID_Y = 210;
const SLOT_Y = (slot) => MID_Y + slot * 76;

/** [id, type, column, slot, label, kind] — 'store' renders as a disc. */
const NODES = [
  ['RUN', 'worker', 0, 0, 'dag trigger', 'CLIENT + PIPELINE'],
  ['BLK', 'worker', 1, 0, 'blocks', 'EXPAND'],
  ['PAR', 'worker', 2, 0, 'parent notebooks', 'EXPAND · DEDUP'],
  ['TBL', 'worker', 3, 0, 'tables', 'ONE TASK PER TABLE'],
  ['NB', 'worker', 4, 0, 'parent notebook', 'SPARK SESSION'],
  ['POOL', 'worker', 5, 0, 'check pool', 'THREADPOOL · 6 CHECKS'],

  ['META', 'store', 2, -2, 'metamodel'],
  ['SRC', 'store', 4, -2, 'source'],
  ['ZIP', 'store', 3, 2, 'framework zip'],
  ['TGT', 'store', 4, 2, 'target'],
  ['ES', 'store', 6, 0, 'results'],
];

/** Solid, animated: data and control actually move along these. */
const FLOW = [
  ['RUN', 'BLK'],
  ['BLK', 'PAR'],
  ['PAR', 'TBL'],
  ['TBL', 'NB'],
  ['NB', 'POOL'],
  ['POOL', 'ES'],
];

/** Dashed, static: configuration and dataset reads, not pipeline stages. */
const READS = [
  ['META', 'BLK'],
  ['META', 'PAR'],
  ['META', 'TBL'],
  ['META', 'NB'],
  ['ZIP', 'NB'],
  ['SRC', 'NB'],
  ['TGT', 'NB'],
];

const NODE_BY_ID = new Map(
  NODES.map(([id, type, col, slot, label, kind]) => [
    id,
    { id, type, cx: COL_CX(col), cy: SLOT_Y(slot), label, kind },
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

/** The gate: everything left of it is Airflow, everything right of it is Spark. */
const GATE_X = (COL_CX(3) + COL_CX(4)) / 2;

export default function ReconMetamodelPipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="rmp-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="How a configuration row becomes a running Spark job. A DAG run carries only a client id and a pipeline id. Airflow then queries the metamodel three times, expanding a new set of mapped tasks each time: first the pipeline's blocks, then the parent notebooks those blocks require, then the tables each notebook owns — one task per table. A dashed gate marks the boundary between Airflow and Spark: each table task submits a Livy batch, which pulls the framework zip and its packaged Python environment from object storage. Inside the Spark session the parent notebook reads its column mappings and check list back out of the metamodel, loads the source dataset from a file store or a relational query and the target dataset from its own store, then runs the assigned checks concurrently in a thread pool. Results are bulk-indexed to Elasticsearch as summary documents, with detail documents written only for failures."
      >
        <style>{`
          .rmp-svg text { font-family: var(--font-data); }
          .rmp-box    { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .rmp-disk   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .rmp-dot    { fill: var(--color-ch); }
          .rmp-t-name { fill: var(--color-ink); font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .rmp-t-kind { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .rmp-t-disk { fill: var(--color-ch); font-size: 9.5px; letter-spacing: .05em; text-anchor: middle; }
          .rmp-t-sub  { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .06em; text-anchor: middle; }
          .rmp-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .rmp-t-gate { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; text-anchor: middle; }
          .rmp-flow   { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .65; }
          .rmp-read   { stroke: var(--color-ink-3); stroke-width: 1; fill: none; stroke-dasharray: 2 3; opacity: .5; }
          .rmp-gate   { stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 2 3; opacity: .55; }
          .rmp-pip    { fill: var(--color-ch); }

          .rmp-pip-anim { animation: rmp-ride 2.6s linear infinite; }
          @keyframes rmp-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .rmp-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="rmp-t-head">
          METAMODEL → TASK GRAPH ┊ LIVY BATCH → CHECKS → INDEX
        </text>

        <line x1={GATE_X} y1={62} x2={GATE_X} y2={H - 36} className="rmp-gate" />
        <text x={GATE_X} y={52} className="rmp-t-gate">
          AIRFLOW ┊ SPARK
        </text>

        {READS.map(([from, to]) => (
          <path key={`r:${from}->${to}`} d={pathFor(from, to)} className="rmp-read" />
        ))}

        {FLOW.map(([from, to]) => {
          const d = pathFor(from, to);
          return (
            <g key={`f:${from}->${to}`}>
              <path d={d} className="rmp-flow" />
              <circle
                r="2.5"
                className="rmp-pip rmp-pip-anim"
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
                  <circle r={DISK_R} className="rmp-disk" />
                  <circle r="2.5" className="rmp-dot" />
                  <text y={-DISK_R - 8} className="rmp-t-disk">
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
                    className="rmp-box"
                  />
                  <text y={-4} className="rmp-t-kind">
                    {n.kind}
                  </text>
                  <text y={12} className="rmp-t-name">
                    {n.label}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Store subtitles: what each disc actually is. */}
        <text x={COL_CX(2)} y={SLOT_Y(-2) + DISK_R + 16} className="rmp-t-sub">
          MARIADB · 13 TABLES
        </text>
        <text x={COL_CX(4)} y={SLOT_Y(-2) + DISK_R + 16} className="rmp-t-sub">
          CSV IN OBJECT STORE ┊ JDBC QUERY
        </text>
        <text x={COL_CX(3)} y={SLOT_Y(2) + DISK_R + 16} className="rmp-t-sub">
          FAT ZIP + PACKAGED PYTHON
        </text>
        <text x={COL_CX(4)} y={SLOT_Y(2) + DISK_R + 16} className="rmp-t-sub">
          RECONCILED AGAINST SOURCE
        </text>
        <text x={COL_CX(6)} y={SLOT_Y(0) + DISK_R + 16} className="rmp-t-sub">
          SUMMARY + DETAILS
        </text>

        <text x={COL_CX(1)} y={H - 14} className="rmp-t-gate">
          dashed = configuration read ┊ solid = data and control
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Nothing here is hardcoded — the task graph is a query result. Counted from
        the repo: 13 metamodel tables, 6 built-in checks, 2 parent notebooks, 3
        storage adapters, 1 of 4 declared engines implemented. No throughput figure
        is shown because none was measured.
      </figcaption>
    </figure>
  );
}
