import React from "react";
import Styles from "../styles/skills.module.css";
import skillsData from "../assets/skills.js";
import { useParams } from "react-router-dom";

function Skills() {
  const { role } = useParams();
  console.log(role);
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
    React: 80,
    MongoDB: 80,
    Python: 60,
    HTML: 95,
    CSS: 95,
    JavaScript: 80,
    Git: 80,
    Docker: 85,
    Jenkins: 50,
    Redis: 60,
    "Node.js": 80,
    kafka: 60,
    MariaDB: 70,
    Airflow: 50,
    Kibana: 50,
    ElasticSearch: 50,
    PySpark: 60,
    Blender: 95,
    Unity: 75,
    "C#": 70,
    "Unreal Engine": 50,
    Maya: 50,
    Zbrush: 75,
    "Substance Painter": 70,
    Photoshop: 60,
    Illustrator: 50,
    "After Effects": 70,
    "Premiere Pro": 80,
    "DaVinci Resolve": 40,
    "Marvelous Designer": 65,
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content}>
          {skills.map((skill) => (
            <div className={Styles.skill} key={skill.id}>
              <span
                style={{
                  width: `${skillsProficiency[skill.name]}%`,
                  height: "0.5rem",
                  alignSelf: "flex-start",
                  backgroundColor: "var(--primary)",
                  border: "none",
                }}
              ></span>
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
