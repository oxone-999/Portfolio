import React from "react";
import Styles from "../styles/skills.module.css";
import skillsData from "../assets/skills.js";

function Skills({role}) {
  const { sdeSkills, tdSkills } = skillsData;
  const [skills, setSkills] = React.useState(sdeSkills);

  React.useEffect(() => {
    if (role === "SDE") {
      setSkills(sdeSkills);
    } else {
      setSkills(tdSkills);
    }
  }
  , [role]);

  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content}>
          {skills.map((skill) => (
            <div className={Styles.skill} key={skill.id}>
              <img src={skill.url} style={skill.name == "Zbrush" ? {filter: "invert(1)"} : {}} />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
