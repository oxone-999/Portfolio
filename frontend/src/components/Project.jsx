import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Styles from "../styles/project.module.css";
import ProjectModal from "./ProjectModal";
import sdeProjects from "../assets/projects";
import { FolderGit2, ExternalLink } from "lucide-react";

function Project({ role }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const isSDE = role === "SDE";

  const handleModalClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h2 className={Styles.title}>
          {isSDE ? "Featured " : "Creative "}
          <span className="gradient-text">Works</span>
        </h2>
        <div className={Styles.divider}></div>
      </div>

      <div className={Styles.contentWrapper}>
        {isSDE ? (
          <motion.div 
            className={Styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {sdeProjects.map((project) => (
              <motion.div
                variants={itemVariants}
                className={`${Styles.projectCard} glass-panel`}
                onClick={() => handleModalClick(project)}
                key={project.id}
              >
                <div className={Styles.cardHeader}>
                  <FolderGit2 className={Styles.folderIcon} size={28} />
                  <span className={
                        project.status === "In Progress"
                          ? Styles.statusInProgress
                          : Styles.statusCompleted
                      }>
                    {project.status}
                  </span>
                </div>
                <h3 className={Styles.projectTitle}>{project.name}</h3>
                <p className={Styles.projectDesc}>{project.description}</p>
                <div className={Styles.skillsList}>
                  {project.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className={Styles.skillBadge}>{skill}</span>
                  ))}
                  {project.skills.length > 4 && <span className={Styles.skillBadge}>+{project.skills.length - 4}</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className={`${Styles.behanceWrapper} glass-panel`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className={Styles.behanceHeader}>
              <h3>3D Portfolio Showcase</h3>
              <a href="https://www.behance.net/anujverma9" target="_blank" rel="noreferrer" className={Styles.behanceLink}>
                View on Behance <ExternalLink size={16} />
              </a>
            </div>
            <div className={Styles.iframeContainer}
                 dangerouslySetInnerHTML={{
                  __html: `
                    <div style="height: 140px; padding-bottom: 0;">
                      <a href="https://www.behance.net/anujverma9?" data-iframely-url="//iframely.net/NUKyutj"></a>
                    </div>
                    <script async src="//iframely.net/embed.js"></script>
                  `,
                }}
            />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && selectedProject && (
          <motion.div 
            className={Styles.modalOverlay} 
            onClick={handleModalClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${Styles.modalContent} glass-panel`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={Styles.modalHeader}>
                <h2>{selectedProject.name}</h2>
                <button className={Styles.closeBtn} onClick={handleModalClose}>✖</button>
              </div>
              <div className={Styles.modalBody}>
                <ProjectModal content={selectedProject.content} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Project;
