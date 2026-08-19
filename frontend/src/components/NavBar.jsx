import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  lensFromPath,
  counterpartPath,
  href,
  LENS_COPY,
  SYSTEMS,
  CRAFT,
} from '../utils/lens';
import { EASE } from '../utils/motionVariants';

export default function NavBar() {
  const { pathname } = useLocation();
  const lens = lensFromPath(pathname);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const items = [
    { to: href(lens, '/work'), label: LENS_COPY[lens].workLabel },
    { to: href(lens, '/log'), label: 'Log' },
    { to: href(lens, '/about'), label: 'About' },
    { to: href(lens, '/contact'), label: 'Contact' },
  ];

  const linkClass = ({ isActive }) =>
    `font-data text-[10.5px] uppercase tracking-[0.1em] transition-colors ${
      isActive ? 'text-ch' : 'text-ink-3 hover:text-ink'
    }`;

  /**
   * One underline for the whole row, positioned by measuring the active link,
   * rather than one `layoutId` element per link.
   *
   * The per-link version looked simpler but had a real bug: when the active
   * element unmounts with no replacement — which happens on every route with
   * no active nav link, including `/` and any case study, since NavLink is
   * `end`-matched — Motion's shared-layout stack keeps its `lead` pointing at
   * the unmounted node. The next underline to mount then resumes from that
   * stale snapshot and springs in from where the underline sat two
   * navigations ago. Measuring sidesteps shared-layout entirely.
   */
  const rowRef = useRef(null);
  const [indicator, setIndicator] = useState(null);

  /**
   * Measures whichever element inside `ref` matches `selector`, positioned
   * relative to `ref` itself. Shared by the nav underline and the lens pill
   * below — both are "paint a highlight under whatever's actually active"
   * and both were previously hardcoded (a `layoutId` for the first, a flat
   * `w-1/2` for the second) instead of measured, which is exactly what broke
   * the lens pill: "Systems" and "3D" aren't the same width, so a highlight
   * fixed at exactly half the row clipped the wider label.
   */
  const measureInto = (ref, selector, setState) => {
    const row = ref.current;
    const active = row?.querySelector(selector);
    if (!row || !active) {
      setState(null);
      return;
    }
    const rowBox = row.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    setState({ left: box.left - rowBox.left, width: box.width });
  };

  const measure = useCallback(() => {
    measureInto(rowRef, 'a[aria-current="page"]', setIndicator);
  }, []);

  const lensRowRef = useRef(null);
  const [lensIndicator, setLensIndicator] = useState(null);
  const measureLens = useCallback(() => {
    measureInto(lensRowRef, 'a[aria-current="true"]', setLensIndicator);
  }, []);

  useEffect(() => {
    measure();
    measureLens();
  }, [measure, measureLens, pathname, lens]);

  useEffect(() => {
    const onResize = () => {
      measure();
      measureLens();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure, measureLens]);

  const NavElement = reduced ? 'nav' : motion.nav;
  const navEntrance = reduced
    ? {}
    : {
        initial: { y: -12, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.4, ease: EASE },
      };

  return (
    <NavElement
      className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-md"
      {...navEntrance}
    >
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-6 py-3">
        <Link
          to={href(lens, '/')}
          className="font-display text-[17px] font-semibold tracking-tight text-ink"
        >
          Anuj Verma
        </Link>

        <div ref={rowRef} className="relative hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end>
              {item.label}
            </NavLink>
          ))}

          {indicator ? (
            reduced ? (
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 h-px bg-ch"
                style={{ left: indicator.left, width: indicator.width }}
              />
            ) : (
              <motion.span
                aria-hidden="true"
                className="absolute -bottom-1.5 h-px bg-ch"
                /* `initial={false}` so it appears in place on first paint
                   rather than sliding in from x=0 on load. */
                initial={false}
                animate={{ left: indicator.left, width: indicator.width }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {/* The lens switch. Changes the URL, not just a colour. The active
              background is measured off the active label (see `measureLens`
              above) rather than assumed to be exactly half the row — "Systems"
              and "3D" aren't the same width, and a flat 50/50 split clipped
              the wider label behind its own highlight. */}
          <div
            ref={lensRowRef}
            className="relative flex border border-rule"
            role="group"
            aria-label="Portfolio lens"
          >
            {lensIndicator && !reduced ? (
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 bg-ch"
                initial={false}
                animate={{ left: lensIndicator.left, width: lensIndicator.width }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            ) : null}
            <Link
              to={lens === SYSTEMS ? href(SYSTEMS, '/') : counterpartPath(pathname)}
              aria-current={lens === SYSTEMS ? 'true' : undefined}
              className={`relative z-10 px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-colors ${
                lens === SYSTEMS ? 'text-paper' : 'text-ink-3 hover:text-ink'
              } ${reduced && lens === SYSTEMS ? 'bg-ch' : ''}`}
            >
              Systems
            </Link>
            <Link
              to={lens === CRAFT ? href(CRAFT, '/') : counterpartPath(pathname)}
              aria-current={lens === CRAFT ? 'true' : undefined}
              className={`relative z-10 px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-colors ${
                lens === CRAFT ? 'text-paper' : 'text-ink-3 hover:text-ink'
              } ${reduced && lens === CRAFT ? 'bg-ch' : ''}`}
            >
              3D
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="border border-rule px-2.5 py-1.5 text-ink-2 transition-colors hover:text-ink md:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              {open ? (
                <path
                  d="M2 2l10 10M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              ) : (
                <path
                  d="M1 3h12M1 7h12M1 11h12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.25, ease: EASE }}
            className="overflow-hidden border-t border-rule bg-paper md:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-4">
              {items.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} end>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </NavElement>
  );
}
