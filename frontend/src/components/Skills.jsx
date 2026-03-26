import React from 'react';
import { useSelector } from 'react-redux';
import skillsData from '../assets/skills.js';

export default function Skills() {
  const mode = useSelector((state) => state.identity.mode);
  const { sdeSkills, tdSkills } = skillsData;
  const skillsList = mode === 'SDE' ? sdeSkills : tdSkills;

  const skillsProficiency = {
    React: 90, MongoDB: 80, Python: 80, HTML: 100, CSS: 100,
    JavaScript: 80, Git: 80, Docker: 85, Jenkins: 70, Redis: 80,
    "Node.js": 80, kafka: 80, MariaDB: 70, Airflow: 80, Kibana: 80,
    ElasticSearch: 80, PySpark: 80, Blender: 95, Unity: 85, "C#": 70,
    "Unreal Engine": 50, Maya: 50, Zbrush: 75, "Substance Painter": 80,
    Photoshop: 80, Illustrator: 80, "After Effects": 70, "Premiere Pro": 80,
    "DaVinci Resolve": 60, "Marvelous Designer": 75, "Kubernetes": 70,
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter mb-4">
          Technical <span className="text-primary-dim">Arsenal</span>
        </h1>
        <p className="text-on-surface-variant font-light text-lg max-w-2xl">
          {mode === 'SDE' 
            ? "A comprehensive overview of programming languages, frameworks, and deployment technologies I leverage to build scalable systems."
            : "The creative software suite I employ to model, texture, and render high-fidelity 3D assets and environments."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skillsList?.map((skill) => {
          const profLevel = skillsProficiency[skill.name] || 50;
          return (
            <div key={skill.id} className={`bg-surface-container p-6 relative overflow-hidden group border border-outline-variant/10 ${mode === '3D' ? 'rounded-2xl' : 'rounded-sm'}`}>
              <div className="absolute top-0 left-0 h-1 bg-surface-container-highest w-full mb-4">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-in-out" 
                  style={{ width: `${profLevel}%` }}
                ></div>
              </div>

              <div className="flex flex-col items-center gap-4 mt-6">
                <div className="w-16 h-16 flex items-center justify-center p-2 bg-surface rounded-full shadow-inner border border-outline-variant/5">
                  <img
                    src={skill.url}
                    alt={skill.name}
                    className="max-w-full max-h-[80%] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    style={skill.name === "Zbrush" ? { filter: "invert(1)" } : {}}
                  />
                </div>
                <div className="text-center">
                  <span className="block font-headline font-bold text-sm tracking-wide text-on-surface mb-1">{skill.name}</span>
                  <span className="text-[10px] font-body text-primary uppercase tracking-widest">{profLevel}% Proficiency</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
