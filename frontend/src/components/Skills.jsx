import React from "react";
import { motion } from "framer-motion";
import Styles from "../styles/skills.module.css";
import skillsData from "../assets/skills.js";
import { useParams } from "react-router-dom";

function Skills() {
  const { role } = useParams();
  console.log(role);
  const { sdeSkills, tdSkills } = skillsData;
  const skills = role === "SDE" ? sdeSkills : tdSkills;

  const skillsProficiency = {
    React: 90,
    MongoDB: 80,
    Python: 80,
    HTML: 100,
    CSS: 100,
    JavaScript: 80,
    Git: 80,
    Docker: 85,
    Jenkins: 70,
    Redis: 80,
    "Node.js": 80,
    kafka: 80,
    MariaDB: 70,
    Airflow: 80,
    Kibana: 80,
    ElasticSearch: 80,
    PySpark: 80,
    Blender: 95,
    Unity: 85,
    "C#": 70,
    "Unreal Engine": 50,
    Maya: 50,
    Zbrush: 75,
    "Substance Painter": 80,
    Photoshop: 80,
    Illustrator: 80,
    "After Effects": 70,
    "Premiere Pro": 80,
    "DaVinci Resolve": 60,
    "Marvelous Designer": 75,
    "Kubernetes": 70,
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
