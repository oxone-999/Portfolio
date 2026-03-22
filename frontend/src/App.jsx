import "./App.css";
import React, { useEffect } from "react";
import SdeHome from "./components/SdeHome";
import TdHome from "./components/TdHome";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [role, setRole] = React.useState("SDE");

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const isSDE = role === "SDE";

  return (
    // Wrap the entire app so the theme variables apply to the header AND the pages
    <div className={`${isSDE ? 'theme-sde' : 'theme-3d'} bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-background-dark min-h-screen flex flex-col font-display`}>
      
      {/* PERSISTENT GLOBAL HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Left: Dynamic Logo & Name */}
          <div className="flex items-center gap-3 w-auto md:w-[250px]">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 transition-colors">
              <span className="material-symbols-outlined text-primary">
                {isSDE ? "terminal" : "view_in_ar"}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Anuj Verma</h2>
          </div>
          
          {/* Center: Dynamic Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            {isSDE ? (
              <>
                <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Architecture</a>
                <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Stack</a>
                <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Logs</a>
              </>
            ) : (
              <>
                <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Portfolio</a>
                <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Projects</a>
                <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Contact</a>
              </>
            )}
          </nav>

          {/* Right: Actions & Animated Toggle */}
          <div className="flex items-center justify-end gap-4 sm:gap-6 w-auto md:w-[250px]">
            <div className="hidden sm:flex gap-2">
            {isSDE ? (
                <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-[20px]">code</span>
                </button>
            ) : (
              <button className="hidden sm:block bg-primary hover:brightness-110 text-background-dark font-bold tracking-widest py-2 px-2 w-20 rounded-xl transition-all h-10 text-sm">
                Hire Me
              </button>
            )}
            </div>

            {/* SLIDING PILL TOGGLE */}
            <div className="relative flex shrink-0 h-10 w-36 sm:w-44 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 p-1">
              
              <label className="relative flex cursor-pointer h-full grow items-center justify-center rounded-lg px-1 z-10">
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate transition-colors duration-300 ${!isSDE ? 'text-background-dark' : 'text-primary/60 hover:text-primary'}`}>
                  3D Artist
                </span>
                <input type="radio" name="role-toggle" value="3D Artist" className="hidden" onChange={() => setRole("3D Artist")} />
                {!isSDE && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-lg shadow-lg -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </label>

              <label className="relative flex cursor-pointer h-full grow items-center justify-center rounded-lg px-1 z-10">
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate transition-colors duration-300 ${isSDE ? 'text-background-dark' : 'text-primary/60 hover:text-primary'}`}>
                  SDE
                </span>
                <input type="radio" name="role-toggle" value="SDE" className="hidden" onChange={() => setRole("SDE")} />
                {isSDE && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-lg shadow-lg -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </label>
              
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT TRANSITIONS */}
      <main className="flex-1 relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {isSDE ? (
            <SdeHome key="sde" />
          ) : (
            <TdHome key="3d" />
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

export default App;