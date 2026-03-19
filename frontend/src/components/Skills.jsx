import React from "react";
import { motion } from "framer-motion";
import Styles from "../styles/skills.module.css";
import skillsData from "../assets/skills.js";

function Skills({ role }) {
  const { sdeSkills, tdSkills } = skillsData;
  const skills = role === "SDE" ? sdeSkills : tdSkills;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h2 className={Styles.title}>My <span className="gradient-text">Toolkit</span></h2>
        <div className={Styles.divider}></div>
      </div>

      <motion.div 
        className={Styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {skills.map((skill) => (
          <motion.div variants={itemVariants} className={`${Styles.skillCard} glass-panel`} key={skill.id}>
            <div className={Styles.iconWrapper}>
              <img
                src={skill.url}
                alt={skill.name}
                style={skill.name === "Zbrush" ? { filter: "invert(1)" } : {}}
              />
            </div>
            <span className={Styles.skillName}>{skill.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Skills;
