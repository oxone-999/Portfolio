import React, { useState } from "react";
import Styles from "../styles/project.module.css";
import ProjectModal from "./ProjectModal";
import sdeProjects from "../assets/projects";

function Project({role}) {
  let projects = sdeProjects;
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
            {role=="SDE" ? projects.map((project) => (
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
            )) : (<div className={Styles.noProject}>No Projects have been added yet, please visit <a href="https://www.behance.net/anujverma9" target="_blank">Behance Portfolio</a></div>)}
          </div>
        </div>
      </div>

      {showModal && selectedProject && (
        <div className={Styles.modalOverlay} onClick={handleModalClose}>
          <div
            className={Styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={Styles.closeButton} onClick={handleModalClose}>
              ✖
            </button>
            <h2>{selectedProject.name}</h2>
            <ProjectModal content={selectedProject.content} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;
