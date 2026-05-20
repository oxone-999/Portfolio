import React from 'react';
import { useSelector } from 'react-redux';

export default function Marketplace() {
  const mode = useSelector((state) => state.identity.mode);

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Hero Section */}
      <header className={`mb-16 relative overflow-hidden p-12 bg-gradient-to-br from-surface-container-low to-surface ${mode === '3D' ? 'rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]' : 'rounded-sm border border-outline-variant/10'}`}>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tertiary via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 tracking-tighter leading-none text-glow">The Asset Foundry</h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mb-8 leading-relaxed font-light">
            High-fidelity 3D assets meticulously sculpted for the next generation of immersive experiences. Optimized for performance, textured for realism.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-tertiary text-on-tertiary px-8 py-3 rounded-full font-bold font-headline tracking-wide hover:shadow-[0_0_20px_rgba(111,255,232,0.5)] transition-all scale-95 active:scale-90 flex items-center gap-2">
              Browse Collection
            </button>
            <button className="px-8 py-3 rounded-full font-bold font-headline tracking-wide border border-outline-variant/20 hover:bg-white/5 transition-all text-on-surface">
              Sell Your Work
            </button>
          </div>
        </div>
      </header>

      {/* Marketplace Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto">
          <button className="px-5 py-2 rounded-full bg-tertiary/10 text-tertiary font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">All Assets</button>
          <button className="px-5 py-2 rounded-full hover:bg-white/5 text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">Characters</button>
          <button className="px-5 py-2 rounded-full hover:bg-white/5 text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">Environments</button>
          <button className="px-5 py-2 rounded-full hover:bg-white/5 text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">Materials</button>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/15 rounded-full text-sm focus:outline-none focus:border-tertiary/50 transition-colors text-on-surface" placeholder="Search 3D assets..." type="text" />
          </div>
          <button className="p-3 bg-surface-container-low border border-outline-variant/15 rounded-full hover:bg-white/5 transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* Asymmetric Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Featured Card (Large) */}
        <div className={`md:col-span-2 relative group overflow-hidden bg-surface-container-low transition-transform duration-500 hover:-translate-y-2 ${mode === '3D' ? 'rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]' : 'rounded-sm border border-outline-variant/10'}`}>
          <div className="h-96 w-full overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cyberpunk city 3D environment render" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCfhEYsTTIUMMOwL0J2lXqfaaEvcWHPxgcFOthYbo52oM3pw_I3txo7sIM2p_36JNZ16A3EF1J7Cm4RX3Hn3ALrZiXq3r53DNhamTqabYGeGEZbaTdlb_NY2AVYazrnPRqnVdkfpaFp0AMl5rlEmWyDDwilunphQN67dPm861KCNMVqNgpoD6aswDQ5Au35zS-T7Wpdc64FSBoNz9BZxrBAGgmXIGu0KODvASTAaQh7Uy2s7TBzbb_Xzw1jm7LIR2_2SPVIdpAKa4" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[10px] font-bold font-label italic uppercase tracking-wider">UE5 Optimized</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-highest/60 text-on-surface-variant text-[10px] font-bold font-label italic uppercase tracking-wider">4K Textures</span>
              </div>
              <h3 className="text-3xl font-headline font-bold text-white mb-2 uppercase tracking-tight">Neo-Saito City Pack</h3>
              <p className="text-on-surface-variant text-sm max-w-sm">Modular futuristic architecture set with high-res PBR materials.</p>
            </div>
            <div className="flex flex-col md:items-end gap-3 shrink-0">
              <span className="text-4xl font-headline font-bold text-tertiary">$129.00</span>
              <button className="bg-tertiary text-on-tertiary px-8 py-3 rounded-full font-bold font-headline text-sm hover:shadow-[0_0_15px_rgba(111,255,232,0.4)] transition-all uppercase tracking-widest">Buy Now</button>
            </div>
          </div>
        </div>

        {/* Standard Card 1 */}
        <div className={`group overflow-hidden bg-surface-container-low transition-transform duration-500 hover:-translate-y-2 ${mode === '3D' ? 'rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.3)]' : 'rounded-sm border border-outline-variant/10'}`}>
          <div className="h-64 overflow-hidden relative">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Xenomorph Larva" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjbMvmCY-wPlHsUVMGNW800s-lTLYs3LvlvJPet3NRekMAsVseAHm-UKn66D78EdJxuOVaIh152weYTwlSXBGmG-h01-DUgvXzkwo7q6BeyU9u_haoCO9TkcXmmpxItV5aRpGzM1WTWpgx_xOk35eLhXnTU70DTKOm_4bNUDyX8L3edpG_y_9VAeYFUMtWQvU9tCj7_Yi2Fih1CD1JCK7m3xnE3DYrzbutI-5LwtdoCDizU_EaXpofhTA9JFS0iHOEXYok-X0-qiU" />
            <div className="absolute top-4 right-4 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold font-label italic text-tertiary">145k Polys</div>
          </div>
          <div className="p-6">
            <h4 className="text-xl font-headline font-bold uppercase tracking-tight mb-1 text-slate-100">Xenomorph Larva</h4>
            <p className="text-on-surface-variant text-sm mb-6 font-light">Fully rigged and animated for cinematic renders.</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-headline font-bold text-tertiary">$45.00</span>
              <button className="p-3 rounded-full border border-outline-variant/15 hover:bg-tertiary hover:text-on-tertiary transition-all text-on-surface-variant group-hover:border-tertiary/50">
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
