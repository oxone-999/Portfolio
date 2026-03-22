import React from "react";
import sdeProjects from "../assets/projects";
import skillsData from "../assets/skills";
import journeyData from "../assets/journey";
import { motion } from "framer-motion";

export default function SdeHome({ role, setRole }) {
  const featuredProject = sdeProjects[0];

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden theme-sde bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-background-dark"
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-8">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  System Operational
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                  Building <span className="text-primary">Scalable</span> Backend Infrastructure
                </h1>
                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  Senior Software Engineer specialized in distributed consensus, high-throughput messaging, and cloud-native systems. Currently optimizing real-time data pipelines.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-background-dark font-bold hover:brightness-110 transition-all">
                  Inspect Documentation
                </button>
                <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary/10 text-primary border border-primary/20 font-bold hover:bg-primary/20 transition-all">
                  View Core Stack
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full"></div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/20 bg-background-dark shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <span className="material-symbols-outlined text-[200px] text-primary">hub</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-primary">node_status.sh</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-primary/70 leading-tight">
                    $ nexus --health-check<br/>
                    &gt; Cluster status: HEALTHY (5/5 nodes online)<br/>
                    &gt; Latency: 0.42ms p99<br/>
                    &gt; Throughput: 1.2M req/sec
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured: {featuredProject.name}</h2>
                <p className="text-slate-400">{featuredProject.description}</p>
              </div>
              <a className="hidden sm:flex text-primary text-sm font-bold items-center gap-2 hover:underline cursor-pointer">
                RESOURCES <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>

            <div className="glass rounded-2xl p-8 flex flex-col lg:flex-row gap-8 items-center border border-primary/20">
               <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Raft Consensus Implementation</h3>
                    <p className="text-slate-400 text-sm">Custom implementation for deterministic state replication across 100+ nodes.</p>
                  </div>
                </div>
                
                <div className="code-block p-6 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre">
                  <span className="text-blue-400">const</span> <span className="text-emerald-400">cluster</span> = <span className="text-blue-400">new</span> <span className="text-yellow-400">NexusCluster</span>({`{`}
                    nodes: <span className="text-orange-400">5</span>,
                    strategy: <span className="text-emerald-400">'quorum'</span>,
                    heartbeat: <span className="text-orange-400">150</span>
                  {`}`});

                  <span className="text-slate-500">// Initialize distributed ledger</span>
                  <span className="text-emerald-400">cluster</span>.<span className="text-yellow-400">on</span>(<span className="text-emerald-400">'leader_election'</span>, (node) =&gt; {`{`}
                    <span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span>(<span className="text-emerald-400">{"`New leader: ${node.id}`"}</span>);
                  {`}`});
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {featuredProject.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{skill}</span>
                  ))}
                </div>
               </div>

               <div className="w-full lg:w-1/2">
                <div 
                  className="rounded-xl overflow-hidden border border-primary/20 shadow-inner bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800')" }}
                >
                  <div className="aspect-video bg-background-dark/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-primary/40">monitoring</span>
                  </div>
                </div>
               </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Core Stack</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {skillsData.sdeSkills.slice(0, 8).map(skill => (
                  <div key={skill.name} className="glass p-6 rounded-xl border border-primary/10 flex flex-col items-center gap-3 hover:border-primary/40 transition-all group">
                    <img src={skill.url} alt={skill.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"/>
                    <span className="font-bold text-sm text-center">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">System Logs</h2>
              <div className="flex flex-col gap-4">
                {journeyData.slice(0, 3).map((item, idx) => (
                  <div key={idx} className={`flex gap-4 p-4 border-l-2 ${idx === 0 ? 'border-primary bg-primary/5' : 'border-slate-700 bg-slate-800/20'} rounded-r-lg`}>
                    <div className={idx === 0 ? "text-primary" : "text-slate-500"}>
                      <span className="material-symbols-outlined text-sm">{idx === 0 ? 'commit' : 'merge'}</span>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-xs font-mono ${idx === 0 ? 'text-primary/80' : 'text-slate-500'}`}>{item.duration}</p>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.organization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-primary/10 py-12 px-6 lg:px-20 bg-background-dark">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-primary">terminal</span>
                <span className="font-bold text-lg">Anuj Verma</span>
              </div>
              <p className="text-sm text-slate-500">Engineering for performance and reliability.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a className="text-slate-400 hover:text-primary transition-colors cursor-pointer">GitHub</a>
              <a className="text-slate-400 hover:text-primary transition-colors cursor-pointer">LinkedIn</a>
              <a className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Twitter</a>
              <a className="text-slate-400 hover:text-primary transition-colors cursor-pointer">Email</a>
            </div>
            <p className="text-xs text-slate-600">© 2024 Systems Portfolio. All processes running.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
