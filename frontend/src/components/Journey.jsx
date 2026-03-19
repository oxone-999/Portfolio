import React from "react";
import { motion } from "framer-motion";
import Styles from "../styles/Journey.module.css";
import journeyData from "../assets/journey";
import { GraduationCap, Briefcase, Code } from "lucide-react";

function Journey() {
  const getIcon = (type) => {
    switch(type) {
      case "school": return <GraduationCap size={20} />;
      case "university": return <GraduationCap size={20} />;
      case "internship": return <Code size={20} />;
      case "job": return <Briefcase size={20} />;
      default: return <Briefcase size={20} />;
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h2 className={Styles.title}>The <span className="gradient-text">Journey</span></h2>
        <div className={Styles.divider}></div>
      </div>

      <div className={Styles.timeline}>
        {journeyData.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div 
              key={index} 
              className={`${Styles.timelineItem} ${isEven ? Styles.left : Styles.right}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={Styles.timelineDot}>
                {getIcon(item.type)}
              </div>
              <div className={`${Styles.timelineContent} glass-panel`}>
                <span className={Styles.duration}>{item.duration}</span>
                <h3 className={Styles.itemTitle}>{item.title}</h3>
                <h4 className={Styles.organization}>{item.organization}</h4>
                <span className={Styles.typeLabel}>{item.typeLabel}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Journey;
