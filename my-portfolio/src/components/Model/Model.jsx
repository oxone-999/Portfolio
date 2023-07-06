import React from "react";
import Styles from "./Model.module.css";

const Model = (props) => {
  
  return (
    <div className={Styles.model}>
      <div className={Styles.modelHeader}>
        <h3>{props.title}</h3>
      </div>
      <div className={Styles.modelContent}></div>
    </div>
  );
};

export default Model;
