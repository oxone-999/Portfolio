import React from "react";
import { motion } from "framer-motion";
import Styles from "../styles/AboutMe.module.css";
import { Github, Linkedin, Mail } from "lucide-react";

function AboutMe() {
  return (
    <div className={Styles.container}>
      <motion.div 
        className={Styles.main}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={Styles.header}>
          <h2 className={Styles.title}>About <span className="gradient-text">Me</span></h2>
          <div className={Styles.divider}></div>
        </div>

        <div className={Styles.grid}>
          <div className={`${Styles.card} glass-panel`}>
            <p>
              Hello! I'm a graduate of IIT Kharagpur, where I pursued a Dual
              Degree (B.Tech + M.Tech) in Mining Engineering. My journey began
              long before my college days when I discovered my passion for
              coding during high school. Starting with C/C++, I developed a
              strong foundation in programming and cultivated an expertise in
              Data Structures and Algorithms (DSA).
            </p>
            <p>
              At IIT Kharagpur, I joined CGS, a creative society, as a 3D artist. 
              Over time, I grew into the role of Governor, leading projects and 
              guiding the next generation of artists.
            </p>
            <p>
              Currently, I am a Technology Consultant at TCG Digital Solutions, 
              merging my technical expertise with problem-solving skills to deliver 
              impactful solutions.
            </p>
          </div>
          
          <div className={Styles.sideCol}>
            <div className={`${Styles.profileCard} glass-panel`}>
              <div className={Styles.imageWrapper}>
                <img src="/me.jpg" alt="Anuj Verma" onError={(e) => e.target.style.display = 'none'} />
              </div>
            </div>
            
            <div className={`${Styles.socialCard} glass-panel`}>
              <a href="https://www.linkedin.com/in/anuj-verma-b430431b1/" target="_blank" rel="noreferrer" className={Styles.socialLink}>
                <Linkedin size={24} />
                <span>LinkedIn</span>
              </a>
              <a href="mailto:anujverma11062002@gmail.com" className={Styles.socialLink}>
                <Mail size={24} />
                <span>Email Me</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AboutMe;
