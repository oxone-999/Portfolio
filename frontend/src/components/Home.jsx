import React from "react";
import { motion } from "framer-motion";
import Styles from "../styles/Home.module.css";
import { Server, MonitorPlay } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home({ role }) {
  const isSDE = role === "SDE";
  const navigate = useNavigate();

  return (
    <div className={Styles.heroContainer}>
      <motion.div 
        className={Styles.heroContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={role}
        transition={{ duration: 0.6 }}
      >
        <div className={Styles.badge}>
          {isSDE ? <Server size={14} /> : <MonitorPlay size={14} />}
          <span>{isSDE ? "IIT Kharagpur Alumnus" : "Creative Innovator"}</span>
        </div>
        
        <h1 className={Styles.title}>
          Hi, I am <br/>
          <span className="gradient-text">ANUJ VERMA</span>
        </h1>
        
        <h2 className={Styles.subtitle}>
          {isSDE ? "Senior Systems Architect & Developer" : "Creative Director & 3D Artist"}
        </h2>
        
        <p className={Styles.description}>
          {isSDE 
            ? "Building high-performance distributed systems, scalable architectures, and beautiful frontends with a focus on code perfection." 
            : "Crafting immersive 3D worlds, high-fidelity game assets, and stunning visual animations pushing the boundaries of digital art."}
        </p>
        
        <div className={Styles.actionBtns}>
          <button className={Styles.primaryBtn} onClick={() => navigate('/projects')}>View Projects</button>
          <button className={Styles.secondaryBtn} onClick={() => window.open('https://www.linkedin.com/in/anuj-verma-b430431b1/', '_blank')}>Contact Me</button>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
