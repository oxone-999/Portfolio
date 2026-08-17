/**
 * Recreation of the operator console from Edge_I_app/frontend.
 *
 * Not a screenshot and not the live app — an interactive rebuild of its actual
 * layout and state machine, restyled through this site's own design tokens
 * rather than the app's original grey/blue palette (Signal Plate rule: no
 * hardcoded colours in a component, theme lives at the token level only).
 *
 * What's real, read from the source: a header nav that flips between two
 * views (Header.jsx / appSlice `showLive`); a left rail with site info and
 * one button per camera (Home.jsx, `cameras.map`); a live view that shows a
 * per-camera WebSocket frame or a "fetching" state when none has arrived yet
 * (the exact fallback in Home.jsx); and a violations view pairing one large
 * preview with a click-to-select thumbnail strip (ImagePreview.jsx +
 * ThumbnailList.jsx). The camera's own notched button shape is recreated from
 * its clip-path in the app's App.css.
 *
 * What's substituted: camera and site identifiers are genericised — the real
 * deployment's identifiers name an actual client and don't belong in a public
 * portfolio. Frames are drawn placeholders, not real captured footage, and are
 * labelled as such rather than presented as evidence.
 */
import { useState } from 'react';
import PropTypes from 'prop-types';

const CAMERAS = ['CAM 1', 'CAM 2', 'CAM 3', 'CAM 4'];

const SAMPLE_VIOLATIONS = [
  { id: 1, camera: 'CAM 1', type: 'FACE_DETECTED', time: '14-05-2025 09:12:03' },
  { id: 2, camera: 'CAM 2', type: 'FACE_DETECTED', time: '14-05-2025 09:14:41' },
  { id: 3, camera: 'CAM 1', type: 'FACE_DETECTED', time: '14-05-2025 09:19:07' },
  { id: 4, camera: 'CAM 3', type: 'FACE_DETECTED', time: '14-05-2025 09:22:56' },
];

/** A placeholder frame — hatch pattern, never a real captured image. */
function FramePlaceholder({ label, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-rule bg-paper-3 ${className}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, var(--color-rule) 0px, var(--color-rule) 1px, transparent 1px, transparent 14px)',
      }}
    >
      <span className="border border-rule bg-paper px-2 py-1 font-data text-[9px] uppercase tracking-[0.08em] text-ink-3">
        {label}
      </span>
    </div>
  );
}

FramePlaceholder.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default function EdgeAppConsole() {
  const [tab, setTab] = useState('violations'); // 'violations' | 'live'
  const [camera, setCamera] = useState(CAMERAS[0]);
  const [selected, setSelected] = useState(SAMPLE_VIOLATIONS[0]);
  const [liveConnected, setLiveConnected] = useState(true);

  return (
    <figure className="my-8">
      <div className="border border-rule bg-paper-2">
        {/* header — Header.jsx: logo, Violations/Live toggle, logout */}
        <div className="flex items-center justify-between border-b border-rule bg-paper-3 px-4 py-2.5">
          <span className="font-display text-[15px] font-semibold text-ink">
            Site Surveillance Console
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTab('violations')}
              className={`border px-3 py-1.5 font-data text-[9.5px] uppercase tracking-[0.08em] transition-colors ${
                tab === 'violations'
                  ? 'border-ch bg-ch text-paper'
                  : 'border-rule text-ink-3 hover:border-ink-3 hover:text-ink'
              }`}
            >
              Violations
            </button>
            <button
              type="button"
              onClick={() => setTab('live')}
              className={`border px-3 py-1.5 font-data text-[9.5px] uppercase tracking-[0.08em] transition-colors ${
                tab === 'live'
                  ? 'border-ch bg-ch text-paper'
                  : 'border-rule text-ink-3 hover:border-ink-3 hover:text-ink'
              }`}
            >
              Live
            </button>
            <button
              type="button"
              className="ml-1.5 border border-rule px-3 py-1.5 font-data text-[9.5px] uppercase tracking-[0.08em] text-ink-3"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* left rail — Home.jsx: site_info block + camera-buttons */}
          <div className="w-full shrink-0 border-b border-rule bg-paper-3/60 p-4 md:w-[220px] md:border-b-0 md:border-r">
            <div className="mb-4 space-y-1 font-data text-[10px] text-ink-3">
              <p>OPERATOR: <span className="text-ink">sample.user</span></p>
              <p>REGION: <span className="text-ink">Site A</span></p>
              <p>LOCATION: <span className="text-ink">Location 1</span></p>
            </div>
            <div className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-2.5">
              {CAMERAS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCamera(c)}
                  aria-pressed={camera === c}
                  className={`border px-3.5 py-2.5 text-left font-data text-[10.5px] uppercase tracking-[0.06em] transition-colors ${
                    camera === c
                      ? 'border-ch bg-ch-soft text-ch'
                      : 'border-rule bg-paper text-ink-2 hover:border-ink-3'
                  }`}
                  style={{ clipPath: 'polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%)' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* main panel */}
          <div className="min-w-0 flex-1 p-4">
            {tab === 'live' ? (
              <div>
                <button
                  type="button"
                  onClick={() => setLiveConnected((v) => !v)}
                  className="mb-2 font-data text-[9px] uppercase tracking-[0.08em] text-ink-3 underline underline-offset-2 hover:text-ch"
                >
                  Toggle sample state
                </button>
                {liveConnected ? (
                  <FramePlaceholder
                    label={`LIVE — ${camera}`}
                    className="aspect-video w-full"
                  />
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 border border-rule bg-paper-3 text-ink-3">
                    <span
                      className="h-2 w-2 animate-pulse rounded-full bg-ch motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    <span className="font-data text-[10px] uppercase tracking-[0.08em]">
                      Fetching live stream…
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <FramePlaceholder
                  label={`${selected.type} — ${selected.camera}`}
                  className="aspect-[16/9] w-full max-w-[520px]"
                />
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-data text-[10.5px] text-ink-3">
                  <div>
                    <dt className="inline text-ink-3">Violation: </dt>
                    <dd className="inline text-ink">{selected.type}</dd>
                  </div>
                  <div>
                    <dt className="inline text-ink-3">Timestamp: </dt>
                    <dd className="inline text-ink">{selected.time}</dd>
                  </div>
                  <div>
                    <dt className="inline text-ink-3">Source: </dt>
                    <dd className="inline text-ink">{selected.camera}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {SAMPLE_VIOLATIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelected(v)}
                      aria-pressed={selected.id === v.id}
                      className="h-16 w-16 shrink-0"
                    >
                      <FramePlaceholder
                        label={v.camera}
                        className={`h-full w-full transition-colors ${
                          selected.id === v.id ? 'border-2 border-ch' : ''
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Recreation of the operator console — layout and state machine from
        Home.jsx / Header.jsx / appSlice.js. Frames are drawn placeholders,
        camera and site names genericised; violation entries are sample data,
        not a real capture.
      </figcaption>
    </figure>
  );
}
