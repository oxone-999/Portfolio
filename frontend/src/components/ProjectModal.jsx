import React from "react";
import Styles from "../styles/projectModal.module.css";

function ProjectModal({ content }) {
  // Styles handled by parent .modalBody CSS rules we injected
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default ProjectModal;
