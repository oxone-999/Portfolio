/**
 * Shared Motion presets, so every entrance/stagger on the site moves the same
 * way instead of each component inventing its own easing and distance.
 *
 * The curve is the one already used for `.depth-enter` in index.css — this is
 * a second implementation of the same motion language (JS-driven instead of a
 * CSS keyframe), not a new one, so a visitor doesn't feel two different sites.
 */

/** Matches `depth-rise`'s cubic-bezier(0.22, 0.61, 0.36, 1) exactly. */
export const EASE = [0.22, 0.61, 0.36, 1];

export const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

/** For rows/cards that should read as arriving from the reading direction. */
export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

export const STAGGER_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** A tighter stagger for longer lists (work grid, timeline), so item 30
 * doesn't arrive a full second after item 1. */
export const STAGGER_LIST = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

/**
 * Viewport config shared by every scroll-triggered reveal: fires once, a
 * little before the element is fully on screen, so it doesn't feel late.
 *
 * `amount: 'some'` — any part intersecting — rather than a fraction, and that
 * matters more than it looks. A fraction is measured against the *whole
 * container*, so a tall one can sit partly on screen and still never reach the
 * threshold. Home's selected-work list is 589px tall starting 793px down: in a
 * 1000px viewport only ~22% of it is ever visible without scrolling, so at
 * `amount: 0.25` the trigger never fired and all three rows stayed at
 * opacity 0 permanently — a blank section on the landing page.
 *
 * The negative bottom margin is what keeps it from feeling premature: the
 * element has to be 80px inside the viewport, not merely touching its edge.
 */
export const VIEWPORT_ONCE = { once: true, amount: 'some', margin: '0px 0px -80px 0px' };
