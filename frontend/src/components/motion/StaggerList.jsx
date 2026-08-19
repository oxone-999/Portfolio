import { motion, useReducedMotion } from 'motion/react';
import PropTypes from 'prop-types';
import { FADE_UP, STAGGER_LIST, VIEWPORT_ONCE } from '../../utils/motionVariants';

/**
 * Paired with `StaggerItem`: a list whose rows arrive one after another as it
 * scrolls into view, instead of all at once. Used for the work grid and the
 * about-page timeline — anywhere a list is long enough that a stagger reads
 * as "these are individual entries" rather than as decoration.
 *
 * `layout` (from Motion's `layout` prop) is deliberately NOT the default
 * here — see StaggerItem.
 *
 * ---- callers must pass a `key` derived from the item ids ------------------
 *
 * The stagger works by this container holding the variant state and its
 * children inheriting it. With `viewport={{ once: true }}` that trigger fires
 * exactly once, and children that mount *afterwards* inherit `hidden`
 * (opacity 0) with nothing left to move them to `visible` — they are stranded
 * invisible permanently.
 *
 * That is a live hazard on this site rather than a theoretical one: the store
 * is seeded synchronously from the bundled JSON, where a project's `id` is its
 * slug, and then replaced by the Supabase rows, where `id` is the database id.
 * Every key changes on that swap, so every row unmounts and remounts — after
 * the trigger has already fired. Keying this container off the same ids means
 * the container itself remounts on the swap and re-evaluates its trigger, so
 * the new rows animate in instead of vanishing.
 */
export function StaggerGroup({ as = 'ul', className = '', children }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.ul;

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={STAGGER_LIST}
    >
      {children}
    </Tag>
  );
}

StaggerGroup.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * A row inside a `StaggerGroup`. `layout` is opt-in (not always-on) because
 * it's only useful where rows can actually reorder or be removed mid-session
 * — the filterable Work grid — and layout animation has a real perf cost on
 * lists that never reorder, like the About timeline.
 */
export function StaggerItem({
  as = 'li',
  className = '',
  layout = false,
  children,
  // Motion-only props: named explicitly so the reduced-motion branch below
  // can drop them instead of spreading them onto a plain DOM element, where
  // `exit`/`transition` objects would otherwise stringify onto the tag as
  // literal "[object Object]" attributes.
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.li;

  if (reduced) {
    const Static = as;
    return (
      <Static className={className} {...rest}>
        {children}
      </Static>
    );
  }

  return (
    <Tag
      className={className}
      variants={FADE_UP}
      layout={layout}
      initial={_initial}
      animate={_animate}
      exit={_exit}
      transition={_transition}
      {...rest}
    >
      {children}
    </Tag>
  );
}

StaggerItem.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  layout: PropTypes.bool,
  children: PropTypes.node,
  initial: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object]),
  animate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  exit: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  transition: PropTypes.object,
};
