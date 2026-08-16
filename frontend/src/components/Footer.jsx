import { Link, useLocation } from 'react-router-dom';
import { href, counterpartPath, LENS_COPY, SYSTEMS, CRAFT } from '../utils/lens';
import { useLens } from '../hooks/useLens';

const LINKS = {
  [SYSTEMS]: [
    { label: 'GitHub', url: 'https://github.com/oxone-999' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/anuj-verma-b430431b1/' },
    { label: 'Email', url: 'mailto:anujverma11062002@gmail.com' },
  ],
  [CRAFT]: [
    { label: 'ArtStation', url: 'https://www.artstation.com/anujverma' },
    { label: 'Behance', url: 'https://www.behance.net/anujverma9' },
    { label: 'Email', url: 'mailto:anujverma11062002@gmail.com' },
  ],
};

export default function Footer() {
  const lens = useLens();
  const { pathname } = useLocation();
  const other = lens === SYSTEMS ? CRAFT : SYSTEMS;

  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto grid max-w-[1080px] gap-8 px-6 py-10 md:grid-cols-[132px_minmax(0,1fr)] md:gap-8">
        <span className="rail-label text-ch">Colophon</span>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div>
            <p className="font-display text-[17px] font-semibold tracking-tight text-ink">
              Anuj Verma
            </p>
            <p className="mt-1 max-w-[46ch] text-[14px] text-ink-2">
              {LENS_COPY[lens].eyebrow}. Currently at TCG Digital.
            </p>
            <p className="mt-4 font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">
              Set in Iowan Old Style, Segoe UI and Cascadia Mono · No web fonts
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {LINKS[lens].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="font-data text-[10.5px] uppercase tracking-[0.09em] text-ink-2 transition-colors hover:text-ch"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Link
              to={counterpartPath(pathname)}
              className="font-data text-[10.5px] uppercase tracking-[0.09em] text-ink-3 transition-colors hover:text-ch"
            >
              → Switch to the {LENS_COPY[other].label.toLowerCase()} lens
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1080px] flex-wrap gap-x-5 gap-y-1 border-t border-rule-soft px-6 py-4 font-data text-[10px] uppercase tracking-[0.08em] text-ink-3">
        <span>© {new Date().getFullYear()} Anuj Verma</span>
        <Link to={href(lens, '/work')} className="hover:text-ch">
          {LENS_COPY[lens].workLabel}
        </Link>
        <Link to={href(lens, '/about')} className="hover:text-ch">
          About
        </Link>
        <Link to={href(lens, '/contact')} className="hover:text-ch">
          Contact
        </Link>
      </div>
    </footer>
  );
}
