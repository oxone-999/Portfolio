/**
 * Live dubbing pipeline — drawn vertically, because the shape is a fan-out
 * that has to re-converge.
 *
 * The interesting property isn't the chain, it's the barrier: one commentary
 * track becomes five independent language lanes that run at different speeds
 * (an LLM translation and a TTS synthesis take as long as they take), and a
 * single segment of output cannot be muxed until *every* lane has finished
 * its copy of that segment. Drawing it left-to-right buries that; drawing the
 * lanes as parallel columns puts the split and the join on the same axis.
 *
 * Every node is traceable to the repo:
 *   - receiver buffers 4 segments before publishing (deque(maxlen=4) in the
 *     hls-receiver rules) so the transcriber gets ~24s of context
 *   - one transcriber, five translators, five TTS services — confirmed by the
 *     processor directories under final-runtime/volumes/processors
 *   - track-muxer polls a Redis hash and only proceeds when its field count
 *     equals TOTAL_TRACKS — that is the barrier
 *   - reel-generator consumes the same receiver topic, independently
 *
 * Client and broadcaster names are deliberately absent: the real deployment
 * names an actual rights-holder and four named broadcasters.
 *
 * Inlined as a component rather than an <img>-referenced SVG because
 * `prefers-reduced-motion` never reaches an embedded SVG document.
 */

const W = 1060;
const H = 900;

/** Five language lanes, plus a centre line the trunk runs down. */
const LANE_X = [116, 294, 472, 650, 828];
const CENTER_X = LANE_X[2];
const BRANCH_X = 952;

const NODE_W = 106;
const NODE_H = 40;
const TOPIC_R = 21;

const LANGS = [
  ['HI', 'hindi'],
  ['BN', 'bengali'],
  ['GU', 'gujarati'],
  ['MR', 'marathi'],
  ['ML', 'malayalam'],
];

const Y = {
  source: 62,
  receiver: 136,
  received: 200,
  transcribe: 264,
  english: 330,
  translate: 400,
  langTopic: 464,
  tts: 528,
  ttsTopic: 596,
  mux: 660,
  finished: 726,
  hls: 790,
  deliver: 856,
};

/** [id, type, x, y, label, kind] */
const NODES = [
  ['SRC', 'worker', CENTER_X, Y.source, 'live feed', 'SRT / HLS'],
  ['RCV', 'worker', CENTER_X, Y.receiver, 'receiver', 'SEGMENT + BUFFER 4'],
  ['TRCV', 'topic', CENTER_X, Y.received, 'RECEIVED'],
  ['TRX', 'worker', CENTER_X, Y.transcribe, 'transcriber', 'WHISPER'],
  ['REEL', 'worker', BRANCH_X, Y.transcribe, 'reel generator', 'HIGHLIGHTS → S3'],
  ['TENG', 'topic', CENTER_X, Y.english, 'ENGLISH_TRANSCRIPTION'],

  ...LANGS.map(([, name], i) => [`TR${i}`, 'worker', LANE_X[i], Y.translate, name, 'TRANSLATE']),
  ...LANGS.map(([code], i) => [`TT${i}`, 'topic', LANE_X[i], Y.langTopic, code]),
  ...LANGS.map((_, i) => [`TS${i}`, 'worker', LANE_X[i], Y.tts, 'tts', 'SPEECH']),

  ['TTTS', 'topic', CENTER_X, Y.ttsTopic, 'TTS'],
  ['MUX', 'worker', CENTER_X, Y.mux, 'track muxer', 'BARRIER'],
  ['TFIN', 'topic', CENTER_X, Y.finished, 'FINISHED_TRACKS'],
  ['HLS', 'worker', CENTER_X, Y.hls, 'hls generator', 'PLAYLISTS'],
  ['OUT', 'worker', CENTER_X, Y.deliver, 'delivery', 'NGINX · HLS→SRT'],
];

/** [from, to, lane] — 'side' marks the independent highlights branch. */
const EDGES = [
  ['SRC', 'RCV'],
  ['RCV', 'TRCV'],
  ['TRCV', 'TRX'],
  ['TRCV', 'REEL', 'side'],
  ['TRX', 'TENG'],
  ...LANGS.map((_, i) => ['TENG', `TR${i}`]),
  ...LANGS.map((_, i) => [`TR${i}`, `TT${i}`]),
  ...LANGS.map((_, i) => [`TT${i}`, `TS${i}`]),
  ...LANGS.map((_, i) => [`TS${i}`, 'TTTS']),
  ['TTTS', 'MUX'],
  ['MUX', 'TFIN'],
  ['TFIN', 'HLS'],
  ['HLS', 'OUT'],
];

const NODE_BY_ID = new Map(
  NODES.map(([id, type, x, y, label, kind]) => [id, { id, type, x, y, label, kind }]),
);

/** Vertical flow: a source connects from its underside, a target from its top. */
function resolvePoint(id, isSource) {
  const n = NODE_BY_ID.get(id);
  const half = n.type === 'topic' ? TOPIC_R : NODE_H / 2;
  return { x: n.x, y: n.y + (isSource ? half : -half) };
}

function edgePath(p1, p2) {
  const dy = Math.max(16, (p2.y - p1.y) * 0.45);
  return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy}, ${p2.x} ${p2.y - dy}, ${p2.x} ${p2.y}`;
}

export default function MultilingualStreamPipeline() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mls-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="Live dubbing pipeline, flowing top to bottom. A live SRT or HLS feed reaches a receiver that segments it and buffers four segments at a time, publishing to a RECEIVED topic. Two independent consumers read that topic: a highlight reel generator that uploads clips to S3, and an English transcriber running Whisper. The transcription fans out to five language lanes — Hindi, Bengali, Gujarati, Marathi and Malayalam — each translating, publishing to its own translation topic, then synthesising speech. All five lanes converge on a single TTS topic feeding the track muxer, which acts as a barrier: it waits until every language track for a given segment exists before muxing video, audio tracks and overlay together. The muxed result goes to the HLS generator, which writes playlists served by nginx and re-encapsulated to SRT for delivery."
      >
        <style>{`
          .mls-svg text { font-family: var(--font-data); }
          .mls-box    { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .mls-box-b  { fill: var(--color-paper); stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 3 2; }
          .mls-topic  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .mls-dot    { fill: var(--color-ch); }
          .mls-t-name { fill: var(--color-ink); font-size: 10px; letter-spacing: .03em; text-anchor: middle; }
          .mls-t-kind { fill: var(--color-ink-3); font-size: 7px; letter-spacing: .09em; text-anchor: middle; }
          /* Topic names sit exactly where lanes converge, so they get a halo
             in the plate colour and are painted over the connectors. */
          .mls-t-topic{ fill: var(--color-ch); font-size: 8px; letter-spacing: .05em; text-anchor: middle;
                        paint-order: stroke; stroke: var(--color-paper-2); stroke-width: 3px; stroke-linejoin: round; }
          .mls-t-head { fill: var(--color-ink-3); font-size: 9px; letter-spacing: .1em; }
          .mls-t-note { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .06em; }
          .mls-flow   { stroke: var(--color-ch); stroke-width: 1.2; fill: none; opacity: .6; }
          .mls-flow-side { stroke: var(--color-ink-3); stroke-dasharray: 4 3; opacity: .5; }
          .mls-pip    { fill: var(--color-ch); }
          .mls-barrier{ stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 2 3; opacity: .5; }

          .mls-pip-anim { animation: mls-ride 2.6s linear infinite; }
          @keyframes mls-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .mls-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={22} y={26} className="mls-t-head">
          INGEST → TRANSCRIBE → TRANSLATE ×5 → SPEAK → MUX → DELIVER
        </text>

        {/* the barrier line: nothing below it exists until every lane above it does */}
        <line
          x1={40}
          y1={Y.mux - 34}
          x2={W - 40}
          y2={Y.mux - 34}
          className="mls-barrier"
        />
        <text x={W - 40} y={Y.mux - 40} className="mls-t-note" textAnchor="end">
          BARRIER · ALL LANGUAGE TRACKS PRESENT
        </text>

        {EDGES.map(([from, to, lane]) => {
          const d = edgePath(resolvePoint(from, true), resolvePoint(to, false));
          return (
            <g key={`${from}->${to}`}>
              <path d={d} className={`mls-flow ${lane === 'side' ? 'mls-flow-side' : ''}`} />
              <circle
                r="2.4"
                className="mls-pip mls-pip-anim"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
              />
            </g>
          );
        })}

        {NODES.map(([id]) => {
          const n = NODE_BY_ID.get(id);
          const isSide = id === 'REEL';
          return (
            <g key={id} style={{ transform: `translate(${n.x}px, ${n.y}px)` }}>
              {n.type === 'topic' ? (
                <>
                  <circle r={TOPIC_R} className="mls-topic" />
                  {n.label.length <= 2 ? (
                    <text y={3} className="mls-t-topic">
                      {n.label}
                    </text>
                  ) : (
                    <>
                      <circle r="2.4" className="mls-dot" />
                      <text y={-TOPIC_R - 6} className="mls-t-topic">
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
                    className={isSide ? 'mls-box-b' : 'mls-box'}
                  />
                  <text y={-4} className="mls-t-kind">
                    {n.kind}
                  </text>
                  <text y={11} className="mls-t-name">
                    {n.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Solid = dubbing path · dashed = independent highlights branch. Counted
        from the deployed runtime: 5 language lanes, 13 processor services, 9
        topics in the chain.
      </figcaption>
    </figure>
  );
}
