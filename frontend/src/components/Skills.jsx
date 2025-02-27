import React from "react";
import Styles from "../styles/skills.module.css";
import skillsData from "../assets/skills.js";

function Skills({ role }) {
  const { sdeSkills, tdSkills } = skillsData;
  const [skills, setSkills] = React.useState(sdeSkills);

  React.useEffect(() => {
    if (role === "SDE") {
      setSkills(sdeSkills);
    } else {
      setSkills(tdSkills);
    }
  }, [role]);

  const skillsProficiency = {
    kafka: 80,
    React: 60,
    mongodb: 85,
    python: 90,
    html: 90,
    css: 90,
    js: 90,
    git: 85,
    docker: 80,
    jenkins: 80,
    redis: 80,
    node: 85,
    blender: 80,
    unity: 80,
    csharp: 80,
    unreal: 80,
    maya: 80,
    zbrush: 80,
    substance: 80,
    photoshop: 80,
    illustrator: 80,
    aftereffects: 80,
    premiere: 80,
    davinci: 80,
    marvelous: 80
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content}>
          {skills.map((skill) => (
            <div className={Styles.skill} key={skill.id}>
              {/* <span
                style={{
                  width: `${skillsProficiency[skill.name]}%`,
                  height: "0.5rem",
                  alignSelf: "flex-start",
                  backgroundColor: "var(--primary)",
                  border: "none",
                }}
              ></span> */}
              <img
                src={skill.url}
                style={skill.name == "Zbrush" ? { filter: "invert(1)" } : {}}
              />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
