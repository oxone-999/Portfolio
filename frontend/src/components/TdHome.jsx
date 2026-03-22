import React from "react";
import skillsData from "../assets/skills";
import { motion } from "framer-motion";

export default function TdHome({ role, setRole }) {
  const toggleRole = () => {
    setRole(role === "SDE" ? "3D Artist" : "SDE");
  };

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden theme-3d bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-background-dark"
    >
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 size-64 bg-primary/20 rounded-full floating-shape pointer-events-none"></div>
      <div className="absolute top-1/2 right-[-5%] size-96 bg-teal-accent/10 rounded-full floating-shape pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 size-72 bg-primary/15 rounded-full floating-shape pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 hero-gradient">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for new projects
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-primary/40 mb-8 leading-tight">
            Game Developer <br/> & 3D Artist
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary/70 font-light leading-relaxed mb-12">
            Crafting immersive digital ecosystems with organic aesthetics, precision modeling, and high-fidelity lighting environments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-primary/0">
             <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-background-dark font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform border border-primary">
                <span className="material-symbols-outlined">play_circle</span>
                View Showreel
             </button>
             <button className="w-full sm:w-auto glass-card text-white font-bold px-8 py-4 rounded-xl hover:bg-primary/10 transition-colors">
                Explore Works
             </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 border-l-4 border-l-primary group hover:bg-primary/10 transition-colors">
            <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
            </div>
            <div>
              <p className="text-primary/60 text-sm font-bold uppercase tracking-widest">Digital Assets</p>
              <p className="text-4xl font-bold text-white mt-1">50+</p>
            </div>
          </div>
          <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 border-l-4 border-l-primary group hover:bg-primary/10 transition-colors">
            <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">language</span>
            </div>
            <div>
              <p className="text-primary/60 text-sm font-bold uppercase tracking-widest">Worlds Created</p>
              <p className="text-4xl font-bold text-white mt-1">10+</p>
            </div>
          </div>
          <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 border-l-4 border-l-primary group hover:bg-primary/10 transition-colors">
            <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">camera_video</span>
            </div>
            <div>
              <p className="text-primary/60 text-sm font-bold uppercase tracking-widest">Frames Rendered</p>
              <p className="text-4xl font-bold text-white mt-1">5M+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Project Showcase</h2>
              <p className="text-primary/60 max-w-md">Selected works across game design, character modeling, and environment art.</p>
            </div>
            <div className="flex gap-2">
              <button className="size-12 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all text-white">
                <span className="material-symbols-outlined">west</span>
              </button>
              <button className="size-12 rounded-full bg-primary text-background-dark flex items-center justify-center hover:bg-teal-accent transition-all">
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass-card">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-60 z-10"></div>
              <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600" alt="Cyberpunk city environment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Game Development</span>
                <h3 className="text-2xl font-bold text-white mb-4">Neo-Tokyo 2088</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white backdrop-blur-md">Unreal Engine 5</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white backdrop-blur-md">Real-time</span>
                </div>
              </div>
            </div>

            <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass-card">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-60 z-10"></div>
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600" alt="Organic abstract 3D shape" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Maya & ZBrush</span>
                <h3 className="text-2xl font-bold text-white mb-4">Organic Synthesis</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white backdrop-blur-md">Substance</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white backdrop-blur-md">Procedural</span>
                </div>
              </div>
            </div>

            <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass-card">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-60 z-10"></div>
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600" alt="Hard surface modeling project" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">3D Modeling</span>
                <h3 className="text-2xl font-bold text-white mb-4">Heavy Mech Unit</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white backdrop-blur-md">Hard Surface</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white backdrop-blur-md">V-Ray</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-primary">view_in_ar</span>
            <p className="text-primary font-bold">Anuj Verma © 2024</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm font-medium text-primary/60">
            <a className="hover:text-primary transition-colors cursor-pointer">ArtStation</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Behance</a>
            <a className="hover:text-primary transition-colors cursor-pointer">LinkedIn</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Twitter</a>
          </div>
          <button className="size-12 rounded-xl bg-teal-surface flex items-center justify-center border border-primary/20 text-primary hover:bg-teal-accent hover:text-white transition-all">
            <span className="material-symbols-outlined">arrow_upward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
