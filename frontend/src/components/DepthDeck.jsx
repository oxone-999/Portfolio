import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Layered case-study viewer.
 *
 * The layers of a case study *are* depth — overview, architecture,
 * implementation — so the control is a depth gauge rather than a tab strip,
 * and descending reads as dropping through strata.
 *
 * Deliberately NOT scroll-driven. Hijacking the wheel to animate a zoom
 * breaks find-in-page, scroll restoration, keyboard paging and screen
 * readers, and there is no way to opt out of it. Advancing is an explicit
 * act: click, arrow key, or the descend control.
 *
 * Only the active panel is rendered visible — inactive panels are `hidden`,
 * which is what assistive tech expects of an inactive panel, and keeps them
 * out of the tab order without hacks. Each layer owns a URL hash so a
 * specific depth is linkable.
 */
export default function DepthDeck({ layers }) {
  const [active, setActive] = useState(0);
  const [entering, setEntering] = useState(false);
  const deckRef = useRef(null);
  const panelRef = useRef(null);

  // Open at whatever depth the URL asks for, so a link to #architecture lands
  // there. Runs on mount and when the project changes; later hash writes come
  // from our own navigation, so `layers` identity is the right trigger.
  const layerKeys = layers.map((l) => l.key).join(',');
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const found = layerKeys.split(',').indexOf(hash);
    setActive(found > 0 ? found : 0);
  }, [layerKeys]);

  const go = useCallback(
    (next, { focus = false } = {}) => {
      if (next < 0 || next >= layers.length || next === active) return;

      setActive(next);
      setEntering(true);
      window.history.replaceState(null, '', `#${layers[next].key}`);

      // Keep the deck head in view when descending from a long panel,
      // but never yank the page if the reader is already looking at it.
      const top = deckRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) {
        deckRef.current?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        });
      }

      if (focus) requestAnimationFrame(() => panelRef.current?.focus());
    },
    [active, layers],
  );

  useEffect(() => {
    if (!entering) return undefined;
    const t = setTimeout(() => setEntering(false), 320);
    return () => clearTimeout(t);
  }, [entering, active]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(active + 1, { focus: true });
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(active - 1, { focus: true });
    }
  };

  const layer = layers[active];
  const isLast = active === layers.length - 1;

  return (
    <div ref={deckRef} className="mt-16 scroll-mt-24">
      <div className="grid gap-6 md:grid-cols-[132px_minmax(0,1fr)] md:gap-8">
        {/* depth gauge */}
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Case study depth"
          onKeyDown={onKeyDown}
          className="flex gap-4 overflow-x-auto border-b border-rule pb-3 md:flex-col md:gap-0 md:overflow-visible md:border-b-0 md:border-t md:pb-0 md:pt-1"
        >
          {layers.map((l, i) => {
            const current = i === active;
            const passed = i < active;
            return (
              <button
                key={l.key}
                role="tab"
                type="button"
                id={`depth-tab-${l.key}`}
                aria-selected={current}
                aria-controls={`depth-panel-${l.key}`}
                tabIndex={current ? 0 : -1}
                onClick={() => go(i)}
                className="group relative shrink-0 text-left md:py-2.5"
              >
                {/* connector track — the gauge spine */}
                <span
                  aria-hidden="true"
                  className={`absolute left-[3px] hidden w-px md:block ${
                    i === 0 ? 'top-1/2 h-1/2' : i === layers.length - 1 ? 'top-0 h-1/2' : 'top-0 h-full'
                  } ${passed ? 'bg-ch' : 'bg-rule'}`}
                />
                <span className="flex items-baseline gap-2.5 md:pl-4">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[13px] hidden h-[7px] w-[7px] rounded-full transition-colors md:block ${
                      current ? 'bg-ch' : passed ? 'bg-ch/50' : 'bg-rule'
                    }`}
                  />
                  <span
                    className={`font-data text-[10px] tabular-nums tracking-[0.12em] transition-colors ${
                      current ? 'text-ch' : 'text-ink-3 group-hover:text-ink-2'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-data text-[10.5px] uppercase tracking-[0.09em] transition-colors ${
                      current ? 'text-ink' : 'text-ink-3 group-hover:text-ink-2'
                    }`}
                  >
                    {l.label}
                  </span>
                </span>
              </button>
            );
          })}

          <p className="hidden pt-3 font-data text-[10px] leading-snug text-ink-3 md:block md:pl-4">
            {layer.note}
          </p>
        </div>

        {/* panels — all present in the document, one visible */}
        <div className="min-w-0">
          {layers.map((l, i) => (
            <div
              key={l.key}
              ref={i === active ? panelRef : null}
              id={`depth-panel-${l.key}`}
              role="tabpanel"
              aria-labelledby={`depth-tab-${l.key}`}
              tabIndex={-1}
              hidden={i !== active}
              className={i === active && entering ? 'depth-enter' : undefined}
            >
              <div
                className="prose-plate"
                /* Sanitised by the caller before it reaches here. */
                dangerouslySetInnerHTML={{ __html: l.html }}
              />
            </div>
          ))}

          {!isLast ? (
            <button
              type="button"
              onClick={() => go(active + 1, { focus: true })}
              className="group mt-10 flex w-full items-center justify-between border border-rule px-5 py-4 text-left transition-colors hover:border-ch"
            >
              <span>
                <span className="block font-data text-[10px] uppercase tracking-[0.12em] text-ch">
                  Deep dive
                </span>
                <span className="mt-1 block font-display text-[19px] text-ink">
                  {layers[active + 1].label}
                </span>
                <span className="mt-0.5 block text-[13.5px] text-ink-2">
                  {layers[active + 1].note}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ml-4 shrink-0 font-data text-[18px] text-ch transition-transform group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => go(0, { focus: true })}
              className="mt-10 inline-block border-b border-rule pb-0.5 font-data text-[10.5px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:border-ch hover:text-ch"
            >
              ↑ Back to overview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

DepthDeck.propTypes = {
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      note: PropTypes.string,
      html: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
