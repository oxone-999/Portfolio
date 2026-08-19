import { motion, useReducedMotion } from 'motion/react';
import PropTypes from 'prop-types';
import { FADE_UP, VIEWPORT_ONCE } from '../../utils/motionVariants';

/**
 * A section fading/rising into place as it's scrolled to. Used for the
 * one-off reveals (a section header, a CTA) that don't need a staggered list
 * of children — see `StaggerList` for that case.
 *
 * `prefers-reduced-motion` is handled here, once, rather than in every
 * caller: reduced-motion visitors get the content with no animation at all,
 * not a slowed-down version of it — the same rule index.css already applies
 * to every CSS transition on the site.
 */
export default function Reveal({ as = 'div', className = '', delay = 0, children }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  /* The delay has to go inside the variant's own transition. Passing it as a
     `transition` prop looks equivalent but is dead code: a variant that
     defines its own `transition` (FADE_UP.visible does) overrides the prop,
     so the delay was silently ignored. */
  const variants = delay
    ? {
        ...FADE_UP,
        visible: {
          ...FADE_UP.visible,
          transition: { ...FADE_UP.visible.transition, delay },
        },
      }
    : FADE_UP;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={variants}
    >
      {children}
    </Tag>
  );
}

Reveal.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  delay: PropTypes.number,
  children: PropTypes.node,
};
