/**
 * Event Exchange — topology morph.
 *
 * Cycles through seven real compositions of the same framework. Nodes keep
 * their identity across states and transition between positions, so the
 * shape is seen to *reflow* rather than cut between slides.
 *
 * Topics render as circles, workers as boxes — a topic is a buffer, not a
 * process, and the shape difference encodes that rather than decorating it.
 *
 * Every state is something the config actually permits, confirmed against
 * the repo: PRODUCE_TOPIC is a set — one worker publishes to several distinct
 * topics at once. CONSUME_TOPIC splits on commas — one worker reads several
 * distinct topics and merges them into one stream. CONSUMER_GROUP is the
 * mechanism behind parallel workers sharing partitions. A `router` worker
 * exists for rule-based branching. Chained processors work because a relay's
 * output topic is just another relay's input topic.
 *
 * The two "combine" states show the topic-set mechanism from both ends: one
 * merges multiple named topics into a processor early, the other lets each
 * topic keep its own processor and merges only at the sender. Deliberately
 * not modelled: Kafka partitions within a single topic — a different
 * mechanism (exclusive per-consumer-group assignment, not a named route),
 * and not what was asked for here.
 *
 * Inlined rather than referenced as an <img>, because `prefers-reduced-motion`
 * does not reach an <img>-embedded SVG — it renders in an isolated context
 * that never sees the host's motion preference. Inlining also lets it read
 * the site's own theme tokens, and DOMPurify would strip <svg> from the
 * sanitised case-study body anyway.
 */
import { useEffect, useState } from 'react';

const W = 1240;
const H = 320;

const COL_PITCH = 170;
const COL_CX = (i) => 105 + i * COL_PITCH; // column CENTRE x — workers and topics share it

const NODE_W = 130;
const NODE_H = 44;
const TOPIC_R = 28;

const MID_Y = 168;
const SLOT_Y = (slot) => MID_Y + slot * 68;

/** node: [id, type, column, slot, label] */
const TOPOLOGIES = [
  {
    id: 'linear',
    name: 'Linear',
    caption: 'One of each. The baseline pipeline.',
    nodes: [
      ['R', 'worker', 0, 0, 'receiver'],
      ['T1', 'topic', 1, 0, 'RECEIVED'],
      ['P1', 'worker', 2, 0, 'processor'],
      ['T2', 'topic', 3, 0, 'PROCESSED'],
      ['S1', 'worker', 4, 0, 'sender'],
    ],
    edges: [['R', 'T1'], ['T1', 'P1'], ['P1', 'T2'], ['T2', 'S1']],
  },
  {
    id: 'fanout',
    name: 'Parallel processors',
    caption: 'One consumer group, partitions split between workers.',
    nodes: [
      ['R', 'worker', 0, 0, 'receiver'],
      ['T1', 'topic', 1, 0, 'RECEIVED'],
      ['P1', 'worker', 2, -1, 'processor'],
      ['P2', 'worker', 2, 0, 'processor'],
      ['P3', 'worker', 2, 1, 'processor'],
      ['T2', 'topic', 3, 0, 'PROCESSED'],
      ['S1', 'worker', 4, 0, 'sender'],
    ],
    edges: [
      ['R', 'T1'],
      ['T1', 'P1'], ['T1', 'P2'], ['T1', 'P3'],
      ['P1', 'T2'], ['P2', 'T2'], ['P3', 'T2'],
      ['T2', 'S1'],
    ],
  },
  {
    id: 'wide',
    name: 'Both tiers parallel',
    caption: 'Processing and delivery scale independently.',
    nodes: [
      ['R', 'worker', 0, 0, 'receiver'],
      ['T1', 'topic', 1, 0, 'RECEIVED'],
      ['P1', 'worker', 2, -1, 'processor'],
      ['P2', 'worker', 2, 0, 'processor'],
      ['P3', 'worker', 2, 1, 'processor'],
      ['T2', 'topic', 3, 0, 'PROCESSED'],
      ['S1', 'worker', 4, -1, 'sender'],
      ['S2', 'worker', 4, 0, 'sender'],
      ['S3', 'worker', 4, 1, 'sender'],
    ],
    edges: [
      ['R', 'T1'],
      ['T1', 'P1'], ['T1', 'P2'], ['T1', 'P3'],
      ['P1', 'T2'], ['P2', 'T2'], ['P3', 'T2'],
      ['T2', 'S1'], ['T2', 'S2'], ['T2', 'S3'],
    ],
  },
  {
    id: 'combine-early',
    name: 'Combine multiple topics',
    caption:
      'One receiver publishes to two distinct topics at once (PRODUCE_TOPIC is a set); one processor reads both and merges them (CONSUME_TOPIC splits on commas).',
    nodes: [
      ['R', 'worker', 0, 0, 'receiver'],
      ['TA', 'topic', 1, -1, 'ALERTS'],
      ['TB', 'topic', 1, 1, 'ARCHIVE'],
      ['P1', 'worker', 2, 0, 'processor'],
      ['T2', 'topic', 3, 0, 'PROCESSED'],
      ['S1', 'worker', 4, 0, 'sender'],
    ],
    edges: [
      ['R', 'TA'], ['R', 'TB'],
      ['TA', 'P1'], ['TB', 'P1'],
      ['P1', 'T2'], ['T2', 'S1'],
    ],
  },
  {
    id: 'combine-late',
    name: 'Merge at delivery',
    caption:
      'Each topic keeps its own processor; the topics stay distinct until one sender consumes both.',
    nodes: [
      ['R', 'worker', 0, 0, 'receiver'],
      ['T1', 'topic', 1, 0, 'RECEIVED'],
      ['PA', 'worker', 2, -1, 'processor'],
      ['PB', 'worker', 2, 1, 'processor'],
      ['TC', 'topic', 3, -1, 'OUT_A'],
      ['TD', 'topic', 3, 1, 'OUT_B'],
      ['S1', 'worker', 4, 0, 'sender'],
    ],
    edges: [
      ['R', 'T1'],
      ['T1', 'PA'], ['T1', 'PB'],
      ['PA', 'TC'], ['PB', 'TD'],
      ['TC', 'S1'], ['TD', 'S1'],
    ],
  },
  {
    id: 'chain',
    name: 'Chained processors',
    caption: 'One stage’s output topic is the next stage’s input.',
    nodes: [
      ['R', 'worker', 0, 0, 'receiver'],
      ['T1', 'topic', 1, 0, 'RECEIVED'],
      ['P1', 'worker', 2, 0, 'processor'],
      ['T2', 'topic', 3, 0, 'STAGE 2'],
      ['P2', 'worker', 4, 0, 'processor'],
      ['T3', 'topic', 5, 0, 'PROCESSED'],
      ['S1', 'worker', 6, 0, 'sender'],
    ],
    edges: [
      ['R', 'T1'], ['T1', 'P1'], ['P1', 'T2'],
      ['T2', 'P2'], ['P2', 'T3'], ['T3', 'S1'],
    ],
  },
  {
    id: 'router',
    name: 'Rule-based branching',
    caption: 'A router splits one stream across topics by rule.',
    nodes: [
      ['R', 'worker', 0, 0, 'receiver'],
      ['T1', 'topic', 1, 0, 'RECEIVED'],
      ['P1', 'worker', 2, 0, 'router'],
      ['TA', 'topic', 3, -1, 'ALERTS'],
      ['T2', 'topic', 3, 0, 'ARCHIVE'],
      ['TC', 'topic', 3, 1, 'INDEX'],
      ['S1', 'worker', 4, -1, 'sender'],
      ['S2', 'worker', 4, 0, 'sender'],
      ['S3', 'worker', 4, 1, 'sender'],
    ],
    edges: [
      ['R', 'T1'], ['T1', 'P1'],
      ['P1', 'TA'], ['P1', 'T2'], ['P1', 'TC'],
      ['TA', 'S1'], ['T2', 'S2'], ['TC', 'S3'],
    ],
  },
];

const CYCLE_MS = 2000;

/** Every node id that appears in any state, so each keeps a stable element. */
const ALL_NODE_IDS = [...new Set(TOPOLOGIES.flatMap((t) => t.nodes.map((n) => n[0])))];

function nodeMap(topology) {
  const map = new Map();
  for (const [id, type, col, slot, label] of topology.nodes) {
    map.set(id, { id, type, cx: COL_CX(col), cy: SLOT_Y(slot), label });
  }
  return map;
}

/** A worker's connecting point sits on its box edge; a topic's on its rim. */
function resolvePoint(ref, nodes, isSource) {
  const node = nodes.get(ref);
  if (!node) return null;
  if (node.type === 'topic') {
    return { x: node.cx + (isSource ? TOPIC_R : -TOPIC_R), y: node.cy };
  }
  return { x: node.cx + (isSource ? NODE_W / 2 : -NODE_W / 2), y: node.cy };
}

function edgePath(p1, p2) {
  const dx = Math.max(24, (p2.x - p1.x) * 0.5);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

export default function EventExchangePipeline() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % TOPOLOGIES.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [auto]);

  const topology = TOPOLOGIES[index];
  const nodes = nodeMap(topology);

  const allEdgeKeys = [
    ...new Set(TOPOLOGIES.flatMap((t) => t.edges.map(([a, b]) => `${a}->${b}`))),
  ];

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="ev-svg w-full h-auto border border-rule bg-paper-2"
        role="img"
        aria-label={`Event Exchange topologies. The same framework composed seven ways: linear; one receiver fanning out to parallel processors; both processing and delivery tiers parallel; one receiver publishing to two distinct topics merged by a single processor; two topics kept separate through their own processors and merged only at the sender; processors chained in stages; and a router branching one stream across topics by rule. Currently showing: ${topology.name}. ${topology.caption}`}
      >
        <style>{`
          .ev-svg text { font-family: var(--font-data); }
          .ev-node    { transition: transform 620ms cubic-bezier(.22,.61,.36,1), opacity 380ms ease; }
          .ev-edge    { transition: opacity 380ms ease; }
          .ev-box     { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; }
          .ev-topic-c { fill: var(--color-paper); stroke: var(--color-ch); stroke-width: 1; stroke-dasharray: 3 2; }
          .ev-dot     { fill: var(--color-ch); }
          .ev-t-node  { fill: var(--color-ink); font-size: 10.5px; letter-spacing: .05em; text-anchor: middle; }
          .ev-t-kind  { fill: var(--color-ink-3); font-size: 8px; letter-spacing: .1em; text-anchor: middle; }
          .ev-t-topic { fill: var(--color-ch); font-size: 8.5px; letter-spacing: .07em; text-anchor: middle; }
          .ev-t-head  { fill: var(--color-ink-3); font-size: 9.5px; letter-spacing: .1em; }
          .ev-flow    { stroke: var(--color-ch); stroke-width: 1.25; fill: none; opacity: .7; }
          .ev-pip     { fill: var(--color-ch); }

          /* Events riding the connectors, so the shape reads as live. */
          .ev-pip-anim { animation: ev-ride 1.8s linear infinite; }
          @keyframes ev-ride {
            from { offset-distance: 0%;   opacity: 0; }
            15%  {                        opacity: 1; }
            85%  {                        opacity: 1; }
            to   { offset-distance: 100%; opacity: 0; }
          }

          @media (prefers-reduced-motion: reduce) {
            .ev-node, .ev-edge { transition: none; }
            .ev-pip-anim { animation: none; opacity: .85; }
          }
        `}</style>

        <text x={24} y={30} className="ev-t-head">
          {topology.name.toUpperCase()}
        </text>

        {/* edges */}
        {allEdgeKeys.map((key) => {
          const [aId, bId] = key.split('->');
          const active = topology.edges.some(([a, b]) => a === aId && b === bId);
          if (!active) return null;
          const p1 = resolvePoint(aId, nodes, true);
          const p2 = resolvePoint(bId, nodes, false);
          if (!p1 || !p2) return null;
          const d = edgePath(p1, p2);
          return (
            <g key={key} className="ev-edge">
              <path d={d} className="ev-flow" />
              <circle
                r="2.6"
                className="ev-pip ev-pip-anim"
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
              />
            </g>
          );
        })}

        {/* nodes — every id always present, so position transitions instead of cutting */}
        {ALL_NODE_IDS.map((id) => {
          const n = nodes.get(id);
          const present = Boolean(n);
          // Park absent nodes at their last sensible spot so they fade rather than fly.
          const cx = present ? n.cx : W / 2;
          const cy = present ? n.cy : MID_Y;
          const isTopic = present && n.type === 'topic';

          return (
            <g
              key={id}
              className="ev-node"
              style={{ transform: `translate(${cx}px, ${cy}px)`, opacity: present ? 1 : 0 }}
            >
              {isTopic ? (
                <>
                  <circle r={TOPIC_R} className="ev-topic-c" />
                  <circle r="2.6" className="ev-dot" />
                  <text y={-TOPIC_R - 8} className="ev-t-topic">
                    {present ? n.label : ''}
                  </text>
                </>
              ) : (
                <>
                  <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} className="ev-box" />
                  <text y={-3} className="ev-t-kind">
                    WORKER
                  </text>
                  <text y={12} className="ev-t-node">
                    {present ? n.label : ''}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* state control — also the accessible way out of the auto-cycle */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
        {TOPOLOGIES.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setAuto(false);
              setIndex(i);
            }}
            aria-pressed={i === index}
            className={`border px-2.5 py-1 font-data text-[9.5px] uppercase tracking-[0.08em] transition-colors ${
              i === index
                ? 'border-ch bg-ch text-paper'
                : 'border-rule text-ink-3 hover:border-ink-3 hover:text-ink'
            }`}
          >
            {t.name}
          </button>
        ))}
        {!auto ? (
          <button
            type="button"
            onClick={() => setAuto(true)}
            className="font-data text-[9.5px] uppercase tracking-[0.08em] text-ink-3 underline underline-offset-2 hover:text-ch"
          >
            Resume cycle
          </button>
        ) : null}
      </div>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        {topology.caption}
      </figcaption>
    </figure>
  );
}
