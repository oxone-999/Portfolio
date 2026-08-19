import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import PropTypes from 'prop-types';
import { EASE } from '../../utils/motionVariants';

/**
 * Fades/lifts the page content on every route change, and owns the
 * scroll-to-top that goes with it.
 *
 * `locationKey` is the caller's `location.pathname`, not read internally —
 * this component doesn't call `useLocation()` itself so the same `location`
 * object the caller passes to `<Routes location={...}>` is the one that
 * decides when the old page's node is captured for its exit animation.
 * Reading location independently here would risk the two falling out of step
 * by a render.
 *
 * ---- two things here are subtler than they look --------------------------
 *
 * 1. `initial={false}` is NOT set on AnimatePresence, deliberately. It reads
 *    like the right way to skip the fade on a cold load, but AnimatePresence
 *    publishes it through PresenceContext, and *every* motion component
 *    inside the routed page reads that context and blocks its own mount
 *    animation. The result was that the hero stagger, and every scroll
 *    reveal on whichever page a visitor landed on first, silently never
 *    played — the site animated only for people who clicked around, and not
 *    for anyone arriving from a link. Scoping the skip to this wrapper's own
 *    `initial` keeps the cold load calm without disarming its children.
 *
 * 2. `mode="wait"` is deliberate — the pages are in normal document flow, so
 *    letting them overlap would stack the outgoing and incoming page
 *    vertically and shove the footer down mid-transition. The cost is that
 *    exit and enter are serialised, so their durations add into the delay
 *    before a visitor sees the page they asked for. Symmetric at 0.28s each
 *    that measured ~700ms click-to-readable, which reads as sluggish, so the
 *    timing is asymmetric: a quick exit (nobody needs to watch content
 *    they've already left) and only the enter carries the easing.
 */
export default function RouteTransition({ locationKey, children }) {
  const reduced = useReducedMotion();

  /* Skips the fade on the first page painted, without touching
     PresenceContext — see note 1 above. */
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  /* Reduced-motion visitors get no wrapper at all, so they need the scroll
     reset here; everyone else gets it from onExitComplete below. */
  useEffect(() => {
    if (reduced) window.scrollTo(0, 0);
  }, [reduced, locationKey]);

  if (reduced) {
    // No wrapper element: nothing to animate, and nothing that could
    // interfere with scroll restoration or focus order for these visitors.
    return children;
  }

  return (
    <AnimatePresence
      mode="wait"
      /* Scrolling on pathname change instead would scroll the OUTGOING page,
         which is still mounted for its exit — so a click from the bottom of a
         long list visibly yanked the old page to the top before fading it.
         Waiting for the exit means the reset lands on the incoming page. */
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={locationKey}
        initial={firstRender.current ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{
          duration: 0.24,
          ease: EASE,
          exit: { duration: 0.12, ease: 'easeOut' },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

RouteTransition.propTypes = {
  locationKey: PropTypes.string.isRequired,
  children: PropTypes.node,
};
