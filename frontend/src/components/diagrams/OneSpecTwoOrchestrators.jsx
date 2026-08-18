/**
 * One spec, two orchestrators — and the single seam where the abstraction leaked.
 *
 * All identifiers here are genericised: the real platform, its image registry
 * and its label prefix carry an employer/product brand, so `eventx_` becomes
 * `flow_` and the stack label reads `stack=`. The underscore-versus-dash
 * divergence the drawing turns on is preserved exactly, because that is the
 * structural fact — only the branded prefix is changed.
 *
 * Every box, name and count below is read off the repo, not proposed:
 * `deployers/deployer.interface.ts` (231 lines), `swarm.deployer.ts` (892),
 * `k8s.deployer.ts` (1,575), `translator.service.ts` (592),
 * `reconciler.worker.ts` (340) and the decision log in MEMORY.md §13.
 *
 * The drawing argues two things, and the second is the reason it exists.
 *
 * ---- register 1: the abstraction that holds ------------------------------
 *
 * A flow authored in the browser is a DAG of minions joined by Kafka topics.
 * Topics render as circles and minions as boxes, following the convention
 * established in EventExchangePipeline: the shape difference is real structure,
 * because a topic buffers and a worker processes.
 *
 * `SwarmTranslator` turns that DAG into ONE `ComposeSpec` — an in-memory
 * Compose-shaped structure that is never written to disk. `K8sTranslator
 * extends SwarmTranslator` and emits the same output; the K8s deployer
 * interprets it natively rather than receiving a different spec. That is the
 * load-bearing design claim, so the spec is drawn as a single object with two
 * readers, not as two parallel pipelines.
 *
 * Each deployer maps it to its own primitives:
 *   Swarm  — Service via the Docker Engine API (dockerode), `traefik.*` labels
 *            applied directly by the Docker provider, stack identity by the
 *            label `com.docker.stack.namespace`.
 *   K8s    — Deployment + Service + Secret + Traefik IngressRoute/Middleware
 *            custom resources, stack identity by a `stack=<name>` label inside
 *            one shared namespace (not a namespace per stack).
 *
 * Both restart in place. Swarm issues `service update --force` honouring
 * `UpdateConfig{Order: start-first}`; K8s bumps a pod-template restart
 * annotation so an otherwise-unchanged replace still rolls a new ReplicaSet.
 * Neither deletes and recreates — that was the original Swarm idiom and it
 * deadlocked on K8s, where Deployment deletion is async.
 *
 * ---- register 2: the seam -----------------------------------------------
 *
 * The abstraction holds for deploying. It leaked on *identity*, in exactly one
 * place, and the leak is worth more than the architecture.
 *
 * A service's name is written by two different sanitizers:
 *   DB   `${stackName}_${sanitize(name)}`  with `[^a-z0-9_-] -> _`   underscores kept
 *   K8s  `metadata.name`                   with `[^a-z0-9-]  -> -`   DNS-1123, dashes only
 *
 * Because `stackName` always contains `flow_<id>`, the underscore is always
 * present, so on Kubernetes the two forms NEVER match. Not sometimes — never.
 * On Swarm they are identical, which is why it shipped.
 *
 * Three independent read paths key off that name, and all three broke while
 * every write path kept working. That asymmetry is the point of the lower
 * register, so the three consumers are drawn hanging off the same name:
 *
 *   1. log stream    — label selector matched zero pods, so the live console
 *                      was simply empty
 *   2. reconciler    — the `minion_instance` row match always missed, forcing
 *                      every healthy K8s minion to `shutdown` / 0 replicas
 *                      while the flow-level status, read straight from the
 *                      deployer, still said `running`. The UI showed a
 *                      contradictory "degraded" banner over a working flow.
 *   3. task history  — a Map keyed by one form and looked up by the other
 *                      returned nothing, so history was permanently empty
 *
 * The fix is drawn as a two-stage gate rather than a rename: `serviceNameMatches()`
 * tries exact equality FIRST — leaving the Swarm path untouched and unrisked —
 * then falls back to canonical DNS-1123 equality. Renaming either side was
 * rejected: the DB form is already seeded in production rows, and the deployer
 * form is also the logs and metrics target.
 *
 * ---- motion --------------------------------------------------------------
 *
 * One pip rides the authoring path into the spec and out to both deployers,
 * because a saved flow really does fan out to whichever target its project
 * names. Under prefers-reduced-motion it does not slow down — it stops, parked
 * on the divergence, which is the one place on the figure worth looking at.
 */

const W = 1240;
const H = 700;

/* ---- register 1: the authored DAG --------------------------------------- */

/** [id, kind, x, y, label, sub] — kind 'box' = minion, 'topic' = Kafka topic. */
const DAG = [
  ['RCV', 'box', 160, 96, 'receiver', 'WEB-API'],
  ['T1', 'topic', 290, 96, 'topic'],
  ['REL', 'box', 400, 96, 'relay', 'PROCESSOR'],
  ['T2', 'topic', 530, 96, 'topic'],
  ['SND', 'box', 640, 96, 'sender', 'WEB-POST'],
];

const DAG_LINKS = [
  ['RCV', 'T1'],
  ['T1', 'REL'],
  ['REL', 'T2'],
  ['T2', 'SND'],
];

const NODE_W = 106;
const NODE_H = 42;
const TOPIC_R = 21;

/* ---- register 1: spec and the two deployers ----------------------------- */

const SPEC_X = 470;
const SPEC_Y = 232;
const SPEC_W = 300;
const SPEC_H = 54;

/** [x, title, sub, rows[]] */
const TARGETS = [
  [
    206,
    'SWARM DEPLOYER',
    'dockerode · 892 lines',
    [
      'Service (Engine API)',
      'traefik.* labels direct',
      'update --force · start-first',
      'label com.docker.stack.namespace',
    ],
  ],
  [
    706,
    'KUBERNETES DEPLOYER',
    '@kubernetes/client-node · 1,575 lines',
    [
      'Deployment + Service + Secret',
      'IngressRoute / Middleware CRs',
      'restart annotation · rolls ReplicaSet',
      'label stack=<name> · shared ns',
    ],
  ],
];

const TGT_Y = 344;
const TGT_W = 328;
const TGT_H = 112;

/* ---- register 2: the identity seam -------------------------------------- */

const SEAM_Y = 528;

/** The same logical service, written by two sanitizers. */
const FORMS = [
  [206, 'DB · minion_instance.docker_service_name', 'flow_1_relay-processor', '[^a-z0-9_-] to _'],
  [706, 'K8S · metadata.name', 'flow-1-relay-processor', '[^a-z0-9-] to - (DNS-1123)'],
];

/** The three read paths that keyed off the name. [x, label, symptom] */
const CONSUMERS = [
  [206, 'log stream', 'SELECTOR MATCHED 0 PODS'],
  [516, 'reconciler', 'HEALTHY MINIONS FORCED TO SHUTDOWN'],
  [900, 'task history', 'PERMANENTLY EMPTY'],
];

const DAG_BY_ID = new Map(
  DAG.map(([id, kind, x, y, label, sub]) => [id, { id, kind, x, y, label, sub }]),
);

const halfW = (n) => (n.kind === 'topic' ? TOPIC_R : NODE_W / 2);

function dagPath(from, to) {
  const a = DAG_BY_ID.get(from);
  const b = DAG_BY_ID.get(to);
  const x1 = a.x + halfW(a);
  const x2 = b.x - halfW(b);
  return `M ${x1} ${a.y} L ${x2} ${b.y}`;
}

export default function OneSpecTwoOrchestrators() {
  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="osto-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label="How one deployment specification drives two container orchestrators, and the single naming seam where that abstraction leaked. At the top, a flow authored in the browser is a directed graph: a receiver minion publishes to a Kafka topic, drawn as a circle, which a relay processor consumes and republishes to a second topic, which a sender consumes. One translator turns that graph into a single in-memory ComposeSpec that is never written to disk. Two deployers read the same spec: the Swarm deployer maps it to Docker Services created through the Engine API, applying Traefik labels directly and restarting in place with update --force; the Kubernetes deployer maps it to Deployments, Services, Secrets and Traefik custom resources, restarting in place by bumping a pod-template annotation that rolls a new ReplicaSet. Neither deletes and recreates. Below, the seam: the same logical service is named by two different sanitizers, one keeping underscores for the database column and one forcing DNS-1123 dashes for Kubernetes, so on Kubernetes the two names never match. Three read paths keyed off that name and all three broke while every write path kept working — the log stream selector matched zero pods, the reconciler forced healthy minions to a shutdown state producing a false degraded banner, and task history returned permanently empty. The fix is a two-stage match that tries exact equality first, leaving the Swarm path untouched, then falls back to canonical DNS-1123 equality."
      >
        <style>{`
          .osto-svg text { font-family: var(--font-data); }

          .osto-box   { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .osto-topic { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .osto-dot   { fill: var(--color-ch); }
          .osto-spec  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1.5; }
          .osto-panel { fill: var(--color-paper); stroke: var(--color-rule); stroke-width: 1; }
          .osto-seam  { fill: none; stroke: var(--color-ink-3); stroke-width: 1; stroke-dasharray: 5 4; opacity: .6; }
          .osto-form  { fill: var(--color-paper); stroke: var(--color-ink-3); stroke-width: 1; }
          .osto-gate  { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1.5; }

          .osto-t-name { fill: var(--color-ink);   font-size: 11.5px; letter-spacing: .03em; text-anchor: middle; }
          .osto-t-kind { fill: var(--color-ink-3); font-size: 7.5px;  letter-spacing: .08em; text-anchor: middle; }
          .osto-t-head { fill: var(--color-ink-3); font-size: 10px;   letter-spacing: .1em; }
          .osto-t-leg  { fill: var(--color-ink-3); font-size: 8.5px;  letter-spacing: .07em; }
          .osto-t-band { fill: var(--color-ink-2); font-size: 8.5px;  letter-spacing: .09em; }
          .osto-t-row  { fill: var(--color-ink-2); font-size: 9px;    letter-spacing: .03em; }
          .osto-t-mono { fill: var(--color-ink);   font-size: 11px;   letter-spacing: .02em; text-anchor: middle; }
          .osto-t-sym  { fill: var(--color-ink-3); font-size: 7.5px;  letter-spacing: .08em; text-anchor: middle; }
          .osto-t-ch   { fill: var(--color-ch);    font-size: 9.5px;  letter-spacing: .05em; text-anchor: middle; }

          .osto-flow { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .7; }
          .osto-thin { stroke: var(--color-ink-3); stroke-width: 1; fill: none; opacity: .55; }
          .osto-pip  { fill: var(--color-ch); }

          .osto-pip-anim { animation: osto-ride 3.6s linear infinite; }
          @keyframes osto-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .osto-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={28} className="osto-t-head">
          ONE SPEC, TWO ORCHESTRATORS — AND THE ONE SEAM THAT LEAKED
        </text>
        <text x={24} y={44} className="osto-t-leg">
          circles buffer, boxes process · identifiers genericised, the underscore/dash split is verbatim
        </text>

        {/* ---- register 1: authored DAG ---- */}
        <text x={24} y={96} className="osto-t-band">
          AUTHORED
        </text>
        <text x={24} y={110} className="osto-t-leg">
          IN BROWSER
        </text>

        {DAG_LINKS.map(([from, to]) => {
          const d = dagPath(from, to);
          return (
            <g key={`d:${from}${to}`}>
              <path d={d} className="osto-flow" />
              <circle
                r="2.5"
                className="osto-pip osto-pip-anim"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
              />
            </g>
          );
        })}

        {DAG.map(([id]) => {
          const n = DAG_BY_ID.get(id);
          return (
            <g key={id} style={{ transform: `translate(${n.x}px, ${n.y}px)` }}>
              {n.kind === 'topic' ? (
                <>
                  <circle r={TOPIC_R} className="osto-topic" />
                  <circle r="2.5" className="osto-dot" />
                  <text y={TOPIC_R + 14} className="osto-t-ch">
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
                    className="osto-box"
                  />
                  <text y={-3} className="osto-t-kind">
                    {n.sub}
                  </text>
                  <text y={13} className="osto-t-name">
                    {n.label}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* DAG -> translator -> spec */}
        <path d={`M 754 96 L 818 96 L 818 ${SPEC_Y - 40}`} className="osto-thin" />
        <text x={834} y={92} className="osto-t-row">
          save · rules statically analysed
        </text>
        <text x={834} y={106} className="osto-t-leg">
          PY AST + TS COMPILER · 1,414 LINES
        </text>

        {/* ---- the single spec ---- */}
        <rect
          x={SPEC_X}
          y={SPEC_Y}
          width={SPEC_W}
          height={SPEC_H}
          className="osto-spec"
        />
        <text x={SPEC_X + SPEC_W / 2} y={SPEC_Y + 22} className="osto-t-name">
          one ComposeSpec
        </text>
        <text x={SPEC_X + SPEC_W / 2} y={SPEC_Y + 39} className="osto-t-kind">
          IN MEMORY · NEVER WRITTEN TO DISK
        </text>
        <text x={SPEC_X + SPEC_W / 2} y={SPEC_Y - 12} className="osto-t-sym">
          K8sTranslator EXTENDS SwarmTranslator — SAME OUTPUT
        </text>

        {/* spec -> two deployers */}
        <path
          d={`M ${SPEC_X + 40} ${SPEC_Y + SPEC_H} C ${SPEC_X + 40} ${SPEC_Y + SPEC_H + 34}, 370 ${TGT_Y - 34}, 370 ${TGT_Y}`}
          className="osto-flow"
        />
        <path
          d={`M ${SPEC_X + SPEC_W - 40} ${SPEC_Y + SPEC_H} C ${SPEC_X + SPEC_W - 40} ${SPEC_Y + SPEC_H + 34}, 870 ${TGT_Y - 34}, 870 ${TGT_Y}`}
          className="osto-flow"
        />
        <text x={620} y={SPEC_Y + SPEC_H + 46} className="osto-t-sym">
          project.deploy_target PICKS ONE
        </text>

        {/* ---- the two deployers ---- */}
        {TARGETS.map(([x, title, sub, rows]) => (
          <g key={title}>
            <rect x={x} y={TGT_Y} width={TGT_W} height={TGT_H} className="osto-panel" />
            <text x={x + 14} y={TGT_Y + 20} className="osto-t-band">
              {title}
            </text>
            <text x={x + 14} y={TGT_Y + 33} className="osto-t-leg">
              {sub.toUpperCase()}
            </text>
            {rows.map((r, i) => (
              <text key={r} x={x + 14} y={TGT_Y + 54 + i * 15} className="osto-t-row">
                {r}
              </text>
            ))}
          </g>
        ))}

        <text x={24} y={TGT_Y + 20} className="osto-t-band">
          DEPLOYED
        </text>
        <text x={24} y={TGT_Y + 34} className="osto-t-leg">
          IN PLACE
        </text>
        <text x={24} y={TGT_Y + 48} className="osto-t-leg">
          NEVER
        </text>
        <text x={24} y={TGT_Y + 62} className="osto-t-leg">
          DELETE +
        </text>
        <text x={24} y={TGT_Y + 76} className="osto-t-leg">
          RECREATE
        </text>

        {/* ---- register 2: the seam ---- */}
        <line x1={40} y1={SEAM_Y - 44} x2={W - 40} y2={SEAM_Y - 44} className="osto-seam" />
        <text x={40} y={SEAM_Y - 52} className="osto-t-band">
          ABOVE · THE ABSTRACTION HOLDS. EVERY WRITE PATH WORKED.
        </text>
        <text x={40} y={SEAM_Y - 28} className="osto-t-band">
          BELOW · IDENTITY. THE SAME SERVICE, NAMED TWICE.
        </text>

        {FORMS.map(([x, head, name, rule]) => (
          <g key={head}>
            <text x={x + TGT_W / 2} y={SEAM_Y - 6} className="osto-t-sym">
              {head}
            </text>
            <rect x={x} y={SEAM_Y} width={TGT_W} height={38} className="osto-form" />
            <text x={x + TGT_W / 2} y={SEAM_Y + 24} className="osto-t-mono">
              {name}
            </text>
            <text x={x + TGT_W / 2} y={SEAM_Y + 52} className="osto-t-sym">
              {rule}
            </text>
          </g>
        ))}

        <text x={620} y={SEAM_Y + 24} className="osto-t-ch">
          never
        </text>
        <text x={620} y={SEAM_Y + 36} className="osto-t-sym">
          EQUAL ON K8S
        </text>

        {/* the three broken consumers */}
        {CONSUMERS.map(([x, label, symptom]) => (
          <g key={label}>
            <path d={`M ${x} ${SEAM_Y + 62} L ${x} ${SEAM_Y + 86}`} className="osto-thin" />
            <text x={x} y={SEAM_Y + 100} className="osto-t-ch">
              {label}
            </text>
            <text x={x} y={SEAM_Y + 114} className="osto-t-sym">
              {symptom}
            </text>
          </g>
        ))}

        {/* the fix */}
        <rect x={946} y={SEAM_Y + 66} width={268} height={54} className="osto-gate" />
        <text x={1080} y={SEAM_Y + 86} className="osto-t-name">
          serviceNameMatches()
        </text>
        <text x={1080} y={SEAM_Y + 102} className="osto-t-kind">
          EXACT FIRST · THEN DNS-1123 CANONICAL
        </text>

        <text x={24} y={H - 16} className="osto-t-leg">
          1 NAMING DIVERGENCE · 3 BROKEN READ PATHS · 0 WRITE PATHS AFFECTED — WHICH IS WHY IT SHIPPED
        </text>
      </svg>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Read from the repo, not proposed. The divergence is structural, not
        intermittent: the stack prefix always contains an underscore, so the two
        forms never match on Kubernetes and always match on Swarm. The fix
        compares exact equality first so the Swarm path is left untouched;
        renaming either side was rejected because the database form is already
        seeded in production rows and the deployer form is also the logs and
        metrics target. No throughput or latency figures are shown — none were
        measured.
      </figcaption>
    </figure>
  );
}
