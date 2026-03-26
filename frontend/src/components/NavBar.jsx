import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setIdentity } from '../store/identitySlice';

export default function NavBar() {
  const dispatch = useDispatch();
  const identityMode = useSelector((state) => state.identity.mode);

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? "text-primary border-b-2 border-current pb-1 transition-colors duration-300 pointer-events-none"
      : "text-zinc-400 hover:text-zinc-100 transition-colors";

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-zinc-950/60 backdrop-blur-xl no-border tonal-elevation-surface-variant shadow-none">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter text-zinc-100 font-headline uppercase">
            ANUJ VERMA
        </div>

        <div className="hidden md:flex items-center space-x-8 font-headline font-bold tracking-tight uppercase text-sm">
          <NavLink to="/" className={navLinkClasses}>Home</NavLink>
          <NavLink to="/story" className={navLinkClasses}>Story</NavLink>
          <NavLink to="/projects" className={navLinkClasses}>Projects</NavLink>
          {identityMode === '3D' && <NavLink to="/marketplace" className={navLinkClasses}>Marketplace</NavLink>}
          <NavLink to="/about" className={navLinkClasses}>About</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-highest p-1 rounded-sm border border-outline-variant/10">
            <button
              onClick={() => dispatch(setIdentity('SDE'))}
              className={`px-3 py-1 text-[10px] font-headline font-bold rounded-sm transition-all ${
                identityMode === 'SDE'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              SOFTWARE
            </button>
            <button
              onClick={() => dispatch(setIdentity('3D'))}
              className={`px-3 py-1 text-[10px] font-headline font-bold rounded-sm transition-all ${
                identityMode === '3D'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              3D ARTIST
            </button>
          </div>
          <span className="material-symbols-outlined text-zinc-400 hover:text-zinc-100 cursor-pointer">
            account_circle
          </span>
        </div>
      </div>
    </nav>
  );
}
