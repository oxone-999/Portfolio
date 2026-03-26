import React from 'react';
import { useSelector } from 'react-redux';

export default function Footer() {
  const mode = useSelector((state) => state.identity.mode);

  if (mode === 'SDE') {
    // SDE Mode: Brutalist, terminal-like, monospace accents, structural borders
    return (
      <footer className="w-full py-12 px-6 border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 font-headline font-bold text-xs tracking-[0.2em] text-primary uppercase">
              <span className="w-2 h-2 bg-primary"></span>
              SYSTEM.FOOTER_
            </div>
            <p className="font-mono text-xs text-on-surface-variant/60 uppercase tracking-wider mt-2">
              <span className="text-primary/50">&gt;</span> BUILD_VER: 2026 // ANUJ VERMA
            </p>
          </div>
          
          <div className="flex flex-wrap md:justify-end gap-6 font-headline text-[10px] font-bold tracking-[0.15em] uppercase">
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300" target="_blank" rel="noreferrer" href="https://github.com/oxone-999">
              [ GitHub ]
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/anuj-verma-b430431b1/">
              [ LinkedIn ]
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300" target="_blank" rel="noreferrer" href="mailto:anujverma11062002@gmail.com">
              [ Contact ]
            </a>
            <div className="h-4 w-[1px] bg-outline-variant/30 hidden md:block"></div>
            <a className="text-on-surface-variant/50 hover:text-tertiary transition-colors duration-300" target="_blank" rel="noreferrer" href="https://www.artstation.com/anujverma">
              ArtStation
            </a>
            <a className="text-on-surface-variant/50 hover:text-tertiary transition-colors duration-300" target="_blank" rel="noreferrer" href="https://www.behance.net/anujverma9">
              Behance
            </a>
          </div>
        </div>
      </footer>
    );
  }

  // 3D Artist Mode: Cinematic, atmospheric, softer gradients, focus on visual portfolios
  return (
    <footer className="w-full py-16 px-8 relative overflow-hidden bg-surface-container-low">
      {/* Subtle atmospheric glow effect at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 relative z-10">
        <div className="text-center">
          <div className="font-headline text-xl font-medium tracking-[0.3em] text-on-surface uppercase mb-3">
            Anuj Verma
          </div>
          <div className="w-12 h-[1px] bg-primary-dim/50 mx-auto mb-3"></div>
          <p className="font-body text-xs tracking-widest text-on-surface-variant uppercase italic">
            © 2026 Crafted in Polygon
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10 font-headline text-xs tracking-widest uppercase">
          <a className="text-on-surface hover:text-white transition-all duration-500 hover:tracking-[0.2em]" target="_blank" rel="noreferrer" href="https://www.artstation.com/anujverma">
            ArtStation
          </a>
          <a className="text-on-surface hover:text-white transition-all duration-500 hover:tracking-[0.2em]" target="_blank" rel="noreferrer" href="https://www.behance.net/anujverma9">
            Behance
          </a>
          <a className="text-on-surface hover:text-white transition-all duration-500 hover:tracking-[0.2em]" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/anuj-verma-b430431b1/">
            LinkedIn
          </a>
          <a className="text-on-surface hover:text-white transition-all duration-500 hover:tracking-[0.2em]" target="_blank" rel="noreferrer" href="mailto:anujverma11062002@gmail.com">
            Contact
          </a>
          <a className="text-on-surface-variant/40 hover:text-on-surface transition-all duration-500" target="_blank" rel="noreferrer" href="https://github.com/oxone-999">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}