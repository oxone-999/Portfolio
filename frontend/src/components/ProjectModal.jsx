import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Styles from "../styles/projectModal.module.css";
import remarkGfm from "remark-gfm";

function ProjectModal({ content }) {
  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content} dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
}

export default ProjectModal;
