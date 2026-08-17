/**
 * Where the work happens, and where the time goes.
 *
 * The point of the drawing is the gate. Everything left of it runs once, offline,
 * and takes hours: a headless browser is opened and closed for every single
 * problem page, the text is normalised, and an inverted index of tf × idf is
 * written to disk. Everything right of it runs per keystroke of the Search
 * button — and the shape of that right half is the whole performance story.
 *
 * Every box and both annotations map to real code in the repo:
 *   - parsers/<site>/<site>_parser.py collects problem URLs page by page;
 *     parsers/<site>/question_parser.py then calls openBrowser() *inside*
 *     singlePageData(), so one full Chrome launch and teardown happens per
 *     problem — 12,297 of them
 *   - TF-IDF/prepare.py cleaningData() lowercases, strips digits and
 *     punctuation, drops a hand-written stop-word list, then IDF() builds the
 *     postings and TF_IDF() multiplies through, dumping output.json (31.8 MB),
 *     doc.json (15 MB), links.json and names.json
 *   - Website/Backend/server.js spawns `python ../../TF-IDF/query.py <query>`
 *     per POST /api/search — no warm process, no cache
 *   - TF-IDF/query.py json.loads all four files on every invocation, including
 *     doc.json, which it binds to `document` and never reads again
 *   - Website/Frontend/my_app/src/App.jsx filters the returned list by
 *     substring on the URL, client-side, after the whole list is over the wire
 *
 * The two measured numbers on the right are the reason the diagram is worth
 * drawing at all: loading the index costs ~1.1 s, scoring the query costs
 * ~7 ms. The UI apologises to the user for the size of the dataset; the dataset
 * is not what they are waiting for.
 *
 * Two edge styles: solid animated edges carry data, dashed static edges are
 * reads of something built earlier. The dashed pair into the spawned process is
 * the one to notice — those two files are re-read from disk on every query.
 */

/**
 * Seven columns, matching the other wide diagram here. The viewBox stays as
 * narrow as the content allows because the SVG scales to the column width and
 * every extra user unit shrinks the type at render size.
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
  ['CRAWL', 'worker', 0, 0, 'crawl', 'ONE BROWSER PER PAGE'],
  ['CLEAN', 'worker', 1, 0, 'normalise', 'LOWERCASE · STOPWORDS'],
  ['INVERT', 'worker', 2, 0, 'invert', 'TF × IDF'],
  ['API', 'worker', 3, 0, 'search api', 'EXPRESS · POST'],
  ['PROC', 'worker', 4, 0, 'python process', 'SPAWNED PER QUERY'],
  ['SCORE', 'worker', 5, 0, 'score', 'SUM OVER QUERY TERMS'],
  ['UI', 'worker', 6, 0, 'browser', 'PLATFORM FILTER'],

  // Only the index sits above the row: it is the one artefact that crosses the
  // gate. Everything else hangs below, clear of the header.
  ['PLAT', 'store', 0, 2, 'platforms'],
  ['IDX', 'store', 3, -2, 'index'],
  ['Q', 'store', 3, 2, 'query'],
  ['CORP', 'store', 5, 2, 'corpus'],
];

/** Solid, animated: data actually moves along these. */
const FLOW = [
  ['CRAWL', 'CLEAN'],
  ['CLEAN', 'INVERT'],
  ['INVERT', 'IDX'],
  ['Q', 'API'],
  ['API', 'PROC'],
  ['PROC', 'SCORE'],
  ['SCORE', 'UI'],
];

/** Dashed, static: reads of something built earlier — re-read every query. */
const READS = [
  ['PLAT', 'CRAWL'],
  ['IDX', 'PROC'],
  ['CORP', 'PROC'],
];

/** Store subtitles: what each disc actually is. [id, text] */
const STORE_SUB = [
  ['PLAT', '3 SITES · 12,297 PROBLEMS'],
  ['IDX', '31.8 MB · 36,957 TERMS'],
  ['Q', 'KEYWORDS'],
  ['CORP', '15 MB · LOADED, UNUSED'],
];

/** Measured annotations under the per-request boxes. [id, text] */
const TIMING = [
  ['PROC', '1.1 S · INDEX LOAD'],
  ['SCORE', '7 MS · RANKING'],
  ['UI', 'UP TO 12,000 ROWS'],
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

/** The gate: left of it runs once and takes hours, right of it runs per query. */
const GATE_X = (COL_CX(2) + COL_CX(3)) / 2;

export default function CodeSearchIndexPipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="csi-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="Where the work happens and where the time goes. A dashed gate splits the pipeline in two. Left of the gate, run once and offline: a crawler opens and closes a full headless browser for each of 12,297 problem pages across three competitive-programming sites; the text is normalised by lowercasing, stripping digits and punctuation and dropping a hand-written stop-word list; and an inverted index of term frequency times inverse document frequency is written to disk as a 31.8 megabyte file covering 36,957 terms. Right of the gate, run once per search: the browser posts keywords to an Express endpoint, which spawns a fresh Python process for every query. That process re-reads the 31.8 megabyte index from disk, and also re-reads a 15 megabyte copy of the cleaned corpus it never uses, which costs about 1.1 seconds. Scoring the query against the index by summing weights over the query terms then takes about 7 milliseconds. The full ranked list — up to roughly 12,000 rows — is returned to the browser, which filters it by platform on the client side."
      >
        <style>{`
          .csi-svg text { font-family: var(--font-data); }
          .csi-box    { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .csi-disk   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .csi-dot    { fill: var(--color-ch); }
          .csi-t-name { fill: var(--color-ink); font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .csi-t-kind { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .08em; text-anchor: middle; }
          .csi-t-disk { fill: var(--color-ch); font-size: 9.5px; letter-spacing: .05em; text-anchor: middle; }
          .csi-t-sub  { fill: var(--color-ink-3); font-size: 7.5px; letter-spacing: .06em; text-anchor: middle; }
          .csi-t-time { fill: var(--color-ch); font-size: 8px; letter-spacing: .07em; text-anchor: middle; }
          .csi-t-head { fill: var(--color-ink-3); font-size: 10px; letter-spacing: .1em; }
          .csi-t-gate { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; text-anchor: end; }
          .csi-t-legend { fill: var(--color-ink-3); font-size: 8.5px; letter-spacing: .07em; }
          .csi-flow   { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .65; }
          .csi-read   { stroke: var(--color-ink-3); stroke-width: 1; fill: none; stroke-dasharray: 2 3; opacity: .5; }
          .csi-gate   { stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 2 3; opacity: .55; }
          .csi-pip    { fill: var(--color-ch); }

          .csi-pip-anim { animation: csi-ride 2.6s linear infinite; }
          @keyframes csi-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .csi-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="csi-t-head">
          CRAWL → NORMALISE → INVERT ┊ SPAWN → LOAD → SCORE → FILTER
        </text>

        {/* The legend sits under the header rather than along the bottom edge,
            where it would run into the platforms caption. */}
        <text x={24} y={44} className="csi-t-legend">
          dashed = re-read on every query ┊ solid = data moving
        </text>

        <line x1={GATE_X} y1={62} x2={GATE_X} y2={H - 36} className="csi-gate" />
        {/* Right-aligned to the left of the gate, clear of the index edge that
            crosses it. */}
        <text x={GATE_X - 8} y={52} className="csi-t-gate">
          BUILT ONCE ┊ PER REQUEST
        </text>

        {READS.map(([from, to]) => (
          <path key={`r:${from}->${to}`} d={pathFor(from, to)} className="csi-read" />
        ))}

        {FLOW.map(([from, to]) => {
          const d = pathFor(from, to);
          return (
            <g key={`f:${from}->${to}`}>
              <path d={d} className="csi-flow" />
              <circle
                r="2.5"
                className="csi-pip csi-pip-anim"
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
                  <circle r={DISK_R} className="csi-disk" />
                  <circle r="2.5" className="csi-dot" />
                  <text y={-DISK_R - 8} className="csi-t-disk">
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
                    className="csi-box"
                  />
                  <text y={-4} className="csi-t-kind">
                    {n.kind}
                  </text>
                  <text y={12} className="csi-t-name">
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
            <text key={`s:${id}`} x={n.cx} y={n.cy + DISK_R + 16} className="csi-t-sub">
              {text}
            </text>
          );
        })}

        {/* Measured, not estimated: the right half is dominated by the load, not the search. */}
        {TIMING.map(([id, text]) => {
          const n = NODE_BY_ID.get(id);
          return (
            <text key={`t:${id}`} x={n.cx} y={n.cy + NODE_H / 2 + 16} className="csi-t-time">
              {text}
            </text>
          );
        })}

      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Counted from the repo: 12,297 problems across 3 sites, 36,957 index terms,
        1,053,417 postings. Timings measured on this index — 1.1 s to load it,
        7 ms to score a query — which is why the slow part is the plumbing and not
        the search. No crawl runtime is shown because none was recorded.
      </figcaption>
    </figure>
  );
}
