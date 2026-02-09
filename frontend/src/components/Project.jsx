import { useState } from "react";
import Styles from "../styles/project.module.css";
import ProjectModal from "./ProjectModal";
import sdeProjects from "../assets/projects";
import TDProjects from "../assets/TDprojects";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

function Project() {
  const { role } = useParams();
  let projects = role === "SDE" ? sdeProjects : TDProjects;
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Function to open modal for a specific project
  const handleModalClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  // Function to close modal
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content}>
          <div className={Styles.projectList}>
            {projects.map((project) => (
              <div
                className={Styles.project}
                onClick={() => handleModalClick(project)}
                key={project.id}
              >
                <div className={Styles.header}>
                  <h6>{project.name}</h6>
                  <span
                    className={
                      project.status == "In Progress"
                        ? Styles.status_inprogress
                        : Styles.status_completed
                    }
                  >
                    {project.status}
                  </span>
                </div>
                <p>{project.description}</p>
                <div className={Styles.skills}>
                  {project.skills.map((skill) => (
                    <span key={skill} className={Styles.skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedProject && (
        <div className={Styles.modalOverlay} onClick={handleModalClose}>
          <motion.div
            className={Styles.modalContent}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={Styles.closeButton} onClick={handleModalClose}>
              ✖
            </button>
            <h2>{selectedProject.name}</h2>
            <ProjectModal content={selectedProject.content} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Project;
