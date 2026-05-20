import { useSelector } from 'react-redux';
import journeyData from '../assets/journey';

export default function Journey() {
  const mode = useSelector((state) => state.identity.mode);

  return (
    <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter mb-4">
          The <span className="text-primary-dim">Journey</span>
        </h1>
        <p className="text-on-surface-variant font-light text-lg">
          {mode === 'SDE' 
            ? "A timeline of systematic growth, academic pursuit, and professional engineering."
            : "The evolution of a digital sculptor, through various roles and creative explorations."}
        </p>
      </div>

      <div className="relative border-l border-outline-variant/30 pl-8 space-y-16">
        {journeyData.map((item, index) => (
          <div key={index} className="relative group">
            <div className="absolute -left-[37px] top-1 w-4 h-4 bg-surface rounded-full border-2 border-primary group-hover:scale-150 transition-transform duration-300"></div>
            
            <div className={`bg-surface-container-low p-8 border border-outline-variant/10 transition-colors duration-500 hover:bg-surface-container ${mode === '3D' ? 'rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.4)]' : 'rounded-sm'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="text-primary font-headline font-bold text-[10px] tracking-[0.2em] uppercase">
                  {item.duration}
                </div>
                <div className="text-on-surface-variant font-headline font-bold text-[10px] tracking-widest uppercase bg-surface-container-highest px-3 py-1 rounded-sm">
                  {item.typeLabel}
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 shrink-0 bg-surface flex items-center justify-center p-2 rounded-sm border border-outline-variant/20">
                  <img src={item.logo} alt={item.organization} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold uppercase tracking-tight mb-1 text-on-surface">{item.title}</h3>
                  <p className="text-sm font-body text-on-surface-variant">{item.organization}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
