import React from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const mode = useSelector((state) => state.identity.mode);

  if (mode === 'SDE') {
    return (
      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 mb-6 text-primary font-headline font-bold text-xs tracking-[0.2em] uppercase">
                <span className="w-8 h-[1px] bg-primary"></span>
                SYSTEMS & DATA ARCHITECT
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none uppercase mb-8">
                Engineering <br /> <span className="text-primary-dim">Data at Scale</span>
              </h1>
              <p className="max-w-xl text-lg text-on-surface-variant font-light leading-relaxed">
                Architecting robust data pipelines, orchestrating cloud-native infrastructure, and designing comprehensive platforms. Transforming raw systems into scalable, resilient digital ecosystems.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-low p-8 border-l-4 border-primary">
                <div className="text-3xl font-headline font-bold mb-2">HLD / LLD</div>
                <div className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">System Design Focus</div>
              </div>
              <div className="bg-surface-container-low p-8 border-l-4 border-primary">
                <div className="text-3xl font-headline font-bold mb-2">Zero</div>
                <div className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">Single Points of Failure</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack / Bento Grid */}
        <section className="bg-surface-container-low py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
              <div>
                <h2 className="text-4xl font-headline font-bold uppercase tracking-tight mb-4">Core Infrastructure</h2>
                <p className="text-on-surface-variant max-w-md">My engineering philosophy prioritizes performance, system reliability, and modular architecture.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">KUBERNETES</span>
                <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">DOCKER</span>
                <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">APACHE SPARK</span>
                <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">ELASTICSEARCH</span>
                <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">C++ / C#</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <div className="md:col-span-2 group relative overflow-hidden bg-surface-container h-[450px]">
                <img alt="Data Pipeline Architecture" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2OTnufPYvciB7_NK2-3YaYWa9yT4F7PrVEd-T8VDLUc8Y1QpRCqKYF58NHSqFynZO836ByQSvfdPaki3HYIJUu9BZ6ZqDHkVwfIpBSb45zJzIf-xYboKWXOBKCTItF0RQ3bfGrV7U2d3tfnBAKEIqNye-_g-6ueB5A6c3U9fyMeApC6U0Qs1nHuZhOKH_CwqR7rEvWPVcMWzmuXMe-OQLGrRoTH03nNRezCU-Bo_vqPUQqCExnDC6BHW3TrANyMqUpH3a-CcXAks" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10">
                  <div className="text-primary font-headline font-bold text-xs tracking-widest uppercase mb-2">Featured Project 01</div>
                  <h3 className="text-3xl font-headline font-bold uppercase tracking-tighter mb-4">Global Risk Radar</h3>
                  <p className="text-on-surface-variant text-sm max-w-sm mb-6">A supply chain risk intelligence platform orchestrated via Apache Airflow, utilizing Spark for big data processing and Elasticsearch for rapid querying.</p>
                  <button className="px-6 py-2 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-widest hover:bg-primary-dim transition-all">View System Specs</button>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-surface-container h-[450px]">
                <img alt="Platform UI/UX" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3KL_d7QlVb1LUWMdsMEdJFfpYM4D9kbYi4FoAJJte5YU8O6fFElngsGl_aZVe9x1FMejvhQXZsbDSXRIqNVW-J7bwFaA9Nq7QzFMWJZn4CzoN2fErm09Xt6IVoWb_zvzWP3iSNH_yJc3267enEZBZH1NGthf5OgIq76f3oRhGNgx9iMH1EJ_-FNgdD2X7R02Lkam7d35RCxrnOhgx6PU9eLujL1OM_zbOxiEeBOryRcbj19uNt-6OrHWFCXWGdXl4MjAiogi3fNM" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10">
                  <div className="text-primary font-headline font-bold text-xs tracking-widest uppercase mb-2">Project 02</div>
                  <h3 className="text-2xl font-headline font-bold uppercase tracking-tighter mb-4">EventX Platform</h3>
                  <p className="text-on-surface-variant text-sm mb-4">Architecting the Master UI and comprehensive HLD/LLD structures.</p>
                  <button className="flex items-center gap-2 text-on-surface font-headline font-bold text-[10px] tracking-widest uppercase hover:text-primary transition-colors">
                    SOURCE CODE <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Expertise Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div>
              <h2 className="text-sm font-headline font-bold uppercase tracking-[0.3em] text-primary mb-12">Expertise Fields</h2>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <span className="text-4xl font-headline font-bold text-surface-container-highest">01</span>
                  <div>
                    <h4 className="text-xl font-headline font-bold uppercase mb-2">Cloud Native & DevOps</h4>
                    <p className="text-on-surface-variant text-sm font-body leading-relaxed">Designing containerized environments using Docker and Kubernetes to ensure applications auto-scale securely and efficiently.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="text-4xl font-headline font-bold text-surface-container-highest">02</span>
                  <div>
                    <h4 className="text-xl font-headline font-bold uppercase mb-2">Data Engineering</h4>
                    <p className="text-on-surface-variant text-sm font-body leading-relaxed">Building ETL pipelines with Apache Spark and Livy, ensuring high-throughput data processing and integration.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="text-4xl font-headline font-bold text-surface-container-highest">03</span>
                  <div>
                    <h4 className="text-xl font-headline font-bold uppercase mb-2">Core System Logic</h4>
                    <p className="text-on-surface-variant text-sm font-body leading-relaxed">Developing highly optimized backends and algorithms utilizing Python, C++, and multithreading principles.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-surface-container-low p-12 border border-outline-variant/10">
              <div className="absolute top-0 right-0 p-4 font-headline text-[10px] text-primary font-bold tracking-widest opacity-40">SYSTEM_LOG: spark_job_submit</div>
              <div className="space-y-4 font-mono text-xs text-on-surface-variant">
                <div className="flex gap-4"><span className="text-primary/50">101</span> <span className="text-primary/70">def</span> <span className="text-on-surface">process_risk_telemetry</span>(spark: SparkSession):</div>
                <div className="flex gap-4"><span className="text-primary/50">102</span> &nbsp;&nbsp;&nbsp;&nbsp;df = spark.read.format(<span className="text-primary/70">"kafka"</span>) \</div>
                <div className="flex gap-4"><span className="text-primary/50">103</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.option(<span className="text-primary/70">"subscribe"</span>, <span className="text-primary/70">"supply_chain_events"</span>) \</div>
                <div className="flex gap-4"><span className="text-primary/50">104</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.load()</div>
                <div className="flex gap-4"><span className="text-primary/50">105</span> </div>
                <div className="flex gap-4"><span className="text-primary/50">106</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim"># Transform and push to Elasticsearch node</span></div>
                <div className="flex gap-4"><span className="text-primary/50">107</span> &nbsp;&nbsp;&nbsp;&nbsp;processed_df = apply_agentic_rules(df)</div>
                <div className="flex gap-4"><span className="text-primary/50">108</span> &nbsp;&nbsp;&nbsp;&nbsp;processed_df.write.format(<span className="text-primary/70">"org.elasticsearch.spark.sql"</span>) \</div>
                <div className="flex gap-4"><span className="text-primary/50">109</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.option(<span className="text-primary/70">"es.nodes"</span>, <span className="text-primary/70">"k8s-es-cluster"</span>) \</div>
                <div className="flex gap-4"><span className="text-primary/50">110</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.save(<span className="text-primary/70">"global_risk_radar/metrics"</span>)</div>
                <div className="flex gap-4"><span className="text-primary/50">111</span> </div>
                <div className="flex gap-4"><span className="text-primary/50">112</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary/70">return</span> <span className="text-primary/70">True</span></div>
              </div>
              <div className="mt-12 pt-8 border-t border-outline-variant/10">
                <p className="text-xs uppercase tracking-[0.2em] font-headline font-bold mb-4 opacity-60 italic">Pipeline Throughput Optimization</p>
                <div className="h-1 w-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-primary w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 3D Artist / Game Dev Mode
  return (
    <main className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 mb-6 text-primary font-headline font-bold text-xs tracking-[0.2em] uppercase">
              <span className="w-8 h-[1px] bg-primary"></span>
              DIGITAL SCULPTOR & GAME DEV
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none uppercase mb-8">
              Crafting <br /> <span className="text-primary-dim">Interactive Depth</span>
            </h1>
            <p className="max-w-xl text-lg text-on-surface-variant font-light leading-relaxed">
              Breathing life into polygons and code. Creating immersive 3D environments, optimizing high-fidelity assets, and programming core mechanics in Unity and C#.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low p-8 border-l-4 border-primary shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
              <div className="text-3xl font-headline font-bold mb-2">Taxi Rush</div>
              <div className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">Active Unity Title</div>
            </div>
            <div className="bg-surface-container-low p-8 border-l-4 border-primary">
              <div className="text-3xl font-headline font-bold mb-2">60 FPS</div>
              <div className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">Mobile Asset Optimization</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects / Bento Grid */}
      <section className="bg-surface-container-low py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div>
              <h2 className="text-4xl font-headline font-bold uppercase tracking-tight mb-4">Interactive Worlds</h2>
              <p className="text-on-surface-variant max-w-md">Bridging the gap between aesthetic 3D artistry and high-performance game logic.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">UNITY 3D</span>
              <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">C# SCRIPTING</span>
              <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">BLENDER</span>
              <span className="px-3 py-1 bg-surface-container-highest font-headline font-bold text-[10px] tracking-widest border border-outline-variant/15 text-primary">LOW-POLY OPTIMIZATION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="md:col-span-2 group relative overflow-hidden bg-surface-container h-[450px]">
              <img alt="Taxi Rush Gameplay" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" src="http://googleusercontent.com/profile/picture/2" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <div className="text-primary font-headline font-bold text-xs tracking-widest uppercase mb-2">Featured Project 01</div>
                <h3 className="text-3xl font-headline font-bold uppercase tracking-tighter mb-4">Taxi Rush</h3>
                <p className="text-on-surface-variant text-sm max-w-sm mb-6">A mobile driving experience. Handled end-to-end development including C# vehicle physics, 3D asset modeling, and mobile-first performance tuning.</p>
                <button className="px-6 py-2 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-widest hover:bg-primary-dim transition-all">Play Demo</button>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-surface-container h-[450px]">
              <img alt="3D Asset Render" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" src="http://googleusercontent.com/profile/picture/3" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <div className="text-primary font-headline font-bold text-xs tracking-widest uppercase mb-2">Asset Portfolio</div>
                <h3 className="text-2xl font-headline font-bold uppercase tracking-tighter mb-4">Hard Surface & Prop Design</h3>
                <button className="flex items-center gap-2 text-on-surface font-headline font-bold text-[10px] tracking-widest uppercase hover:text-primary transition-colors">
                  VIEW GALLERY <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Expertise Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <h2 className="text-sm font-headline font-bold uppercase tracking-[0.3em] text-primary mb-12">Creative Engineering</h2>
            <div className="space-y-12">
              <div className="flex gap-6">
                <span className="text-4xl font-headline font-bold text-surface-container-highest">01</span>
                <div>
                  <h4 className="text-xl font-headline font-bold uppercase mb-2">Gameplay Programming</h4>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">Architecting robust C# systems in Unity, handling player state machines, physics interactions, and core game loops.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-headline font-bold text-surface-container-highest">02</span>
                <div>
                  <h4 className="text-xl font-headline font-bold uppercase mb-2">3D Modeling & Sculpting</h4>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">Creating optimized topology for game-ready assets. Balancing polygon counts with visual fidelity to ensure smooth rendering.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-headline font-bold text-surface-container-highest">03</span>
                <div>
                  <h4 className="text-xl font-headline font-bold uppercase mb-2">Mobile Optimization</h4>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">Implementing object pooling, texture atlasing, and custom shaders to maintain rigid 60FPS targets on mobile hardware.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative bg-surface-container-low p-12 border border-outline-variant/10">
            <div className="absolute top-0 right-0 p-4 font-headline text-[10px] text-primary font-bold tracking-widest opacity-40">SYSTEM_LOG: taxi_controller.cs</div>
            <div className="space-y-4 font-mono text-xs text-on-surface-variant">
              <div className="flex gap-4"><span className="text-primary/50">101</span> <span className="text-primary/70">using</span> UnityEngine;</div>
              <div className="flex gap-4"><span className="text-primary/50">102</span> </div>
              <div className="flex gap-4"><span className="text-primary/50">103</span> <span className="text-primary/70">public class</span> <span className="text-on-surface">VehicleDynamics</span> : MonoBehaviour {'{'}</div>
              <div className="flex gap-4"><span className="text-primary/50">104</span>     [SerializeField] <span className="text-primary/70">private float</span> acceleration = 15f;</div>
              <div className="flex gap-4"><span className="text-primary/50">105</span>     [SerializeField] <span className="text-primary/70">private float</span> steerAngle = 30f;</div>
              <div className="flex gap-4"><span className="text-primary/50">106</span> </div>
              <div className="flex gap-4"><span className="text-primary/50">107</span>     <span className="text-primary/70">private</span> Rigidbody rb;</div>
              <div className="flex gap-4"><span className="text-primary/50">108</span> </div>
              <div className="flex gap-4"><span className="text-primary/50">109</span>     <span className="text-primary/70">void</span> <span className="text-on-surface">FixedUpdate</span>() {'{'}</div>
              <div className="flex gap-4"><span className="text-primary/50">110</span>         <span className="text-primary-dim">// Process mobile touch input delta</span></div>
              <div className="flex gap-4"><span className="text-primary/50">111</span>         <span className="text-primary/70">float</span> inputX = InputManager.GetSteering();</div>
              <div className="flex gap-4"><span className="text-primary/50">112</span>         </div>
              <div className="flex gap-4"><span className="text-primary/50">113</span>         Vector3 move = transform.forward * acceleration;</div>
              <div className="flex gap-4"><span className="text-primary/50">114</span>         rb.AddForce(move, ForceMode.Acceleration);</div>
              <div className="flex gap-4"><span className="text-primary/50">115</span>     {'}'}</div>
              <div className="flex gap-4"><span className="text-primary/50">116</span> {'}'}</div>
            </div>
            <div className="mt-12 pt-8 border-t border-outline-variant/10">
              <p className="text-xs uppercase tracking-[0.2em] font-headline font-bold mb-4 opacity-60 italic">Physics Thread Execution</p>
              <div className="h-1 w-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-primary w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}