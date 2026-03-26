import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import sdeProjects from '../assets/projects';
import TDProjects from '../assets/TDProjects';

export default function Project() {
  const mode = useSelector((state) => state.identity.mode);
  const projects = mode === 'SDE' ? sdeProjects : TDProjects;
  
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter mb-4">
          Featured <span className="text-primary-dim">Projects</span>
        </h1>
        <p className="text-on-surface-variant font-light text-lg">
          {mode === 'SDE' 
            ? "High-performance systems, distributed architecture, and data orchestration."
            : "Immersive 3D environments, technical art, and digital sculptures."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className={`group flex flex-col cursor-pointer bg-surface-container-low p-6 border border-outline-variant/10 hover:border-primary/50 transition-colors ${mode === '3D' ? 'rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.3)]' : 'rounded-sm'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-headline font-bold uppercase tracking-tight text-on-surface pr-4">
                {project.name}
              </h3>
              <span className={`shrink-0 px-2 py-1 text-[9px] font-headline font-bold tracking-widest uppercase rounded-sm ${project.status === 'Completed' ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/20'}`}>
                {project.status}
              </span>
            </div>

            <p className="text-sm font-body text-on-surface-variant mb-6 flex-grow leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {project.skills?.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-surface-container-highest font-headline font-bold text-[9px] tracking-widest text-on-surface border border-outline-variant/10 rounded-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative bg-surface-container border border-outline-variant/20 w-full max-w-4xl max-h-[85vh] overflow-y-auto z-10 p-8 md:p-12 ${mode === '3D' ? 'rounded-2xl shadow-[0_48px_100px_rgba(0,0,0,0.6)]' : 'rounded-sm'}`}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <h2 className="text-3xl font-headline font-bold uppercase tracking-tight text-primary mb-8 border-b border-outline-variant/20 pb-4">
                {selectedProject.name}
              </h2>
              <div 
                className="prose prose-invert prose-p:font-body prose-p:text-on-surface-variant prose-headings:font-headline prose-headings:uppercase prose-a:text-primary hover:prose-a:text-primary-dim max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedProject.content }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
