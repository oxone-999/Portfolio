import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  lensFromPath,
  counterpartPath,
  href,
  LENS_COPY,
  SYSTEMS,
  CRAFT,
} from '../utils/lens';

export default function NavBar() {
  const { pathname } = useLocation();
  const lens = lensFromPath(pathname);
  const [open, setOpen] = useState(false);

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

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-6 py-3">
        <Link
          to={href(lens, '/')}
          className="font-display text-[17px] font-semibold tracking-tight text-ink"
        >
          Anuj Verma
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* The lens switch. Changes the URL, not just a colour. */}
          <div
            className="flex border border-rule"
            role="group"
            aria-label="Portfolio lens"
          >
            <Link
              to={lens === SYSTEMS ? href(SYSTEMS, '/') : counterpartPath(pathname)}
              aria-current={lens === SYSTEMS ? 'true' : undefined}
              className={`px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-colors ${
                lens === SYSTEMS
                  ? 'bg-ch text-paper'
                  : 'text-ink-3 hover:text-ink'
              }`}
            >
              Systems
            </Link>
            <Link
              to={lens === CRAFT ? href(CRAFT, '/') : counterpartPath(pathname)}
              aria-current={lens === CRAFT ? 'true' : undefined}
              className={`px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-colors ${
                lens === CRAFT ? 'bg-ch text-paper' : 'text-ink-3 hover:text-ink'
              }`}
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

      {open ? (
        <div className="border-t border-rule bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
