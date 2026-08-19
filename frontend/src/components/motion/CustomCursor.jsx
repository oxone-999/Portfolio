import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import PropTypes from 'prop-types';
import { EASE } from '../../utils/motionVariants';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary';

/**
 * A trailing ring that follows the pointer, additive to the system cursor
 * rather than a replacement for it — this never sets `cursor: none` anywhere,
 * so nothing about pointer visibility or accessibility changes for anyone.
 * It only ever renders on a fine-pointer, motion-OK device: touch and
 * reduced-motion visitors get nothing, not a degraded version of it.
 *
 * The ring uses the channel accent, which reads on both papers, so it needs no
 * separate light/dark definition. (An earlier version claimed
 * `mix-blend-difference` was inverting the page beneath it. It wasn't: the
 * positioned parent carries a transform, which creates a stacking context and
 * therefore an isolated compositing group, so the blend only ever saw that
 * group's transparent backdrop. The claim is gone rather than the colour.)
 *
 * `routeKey` exists to fix a stuck-state bug: `mouseout` is the only thing
 * that clears `hovering`, and removing a node from the DOM does not fire it.
 * Clicking a link unmounts the page with the anchor still under the pointer,
 * so the ring stayed enlarged after essentially every navigation. On a route
 * change we re-derive the state from whatever is actually under the last known
 * pointer position.
 */
export default function CustomCursor({ routeKey }) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  /** Ask the document what's under the pointer, rather than trusting events. */
  const rederive = useCallback(() => {
    const { x: px, y: py } = posRef.current;
    if (px < 0 || py < 0) {
      setHovering(false);
      return;
    }
    const el = document.elementFromPoint(px, py);
    setHovering(Boolean(el && el.closest(INTERACTIVE_SELECTOR)));
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    setEnabled(true);

    const handleMove = (event) => {
      posRef.current = { x: event.clientX, y: event.clientY };
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const handleOver = (event) => {
      if (event.target.closest(INTERACTIVE_SELECTOR)) setHovering(true);
    };
    const handleOut = (event) => {
      if (event.target.closest(INTERACTIVE_SELECTOR)) setHovering(false);
    };
    // Pointer gone from the window entirely — no mouseout is guaranteed.
    const handleLeave = () => {
      posRef.current = { x: -100, y: -100 };
      setHovering(false);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [reduced, x, y]);

  /* After the new page has painted, re-check what the pointer is actually
     over. Two frames because the route transition remounts the content. */
  useEffect(() => {
    if (!enabled) return undefined;
    const t = setTimeout(rederive, 60);
    return () => clearTimeout(t);
  }, [routeKey, enabled, rederive]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999]"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="rounded-full border border-ch"
        style={{ x: '-50%', y: '-50%', width: 18, height: 18 }}
        animate={{ scale: hovering ? 2.2 : 1, opacity: hovering ? 1 : 0.65 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
    </motion.div>
  );
}

CustomCursor.propTypes = { routeKey: PropTypes.string };
