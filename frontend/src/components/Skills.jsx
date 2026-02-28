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
    React: 90,
    MongoDB: 80,
    Python: 80,
    HTML: 100,
    CSS: 100,
    JavaScript: 80,
    Git: 80,
    Docker: 85,
    Jenkins: 70,
    Redis: 80,
    "Node.js": 80,
    kafka: 80,
    MariaDB: 70,
    Airflow: 80,
    Kibana: 80,
    ElasticSearch: 80,
    PySpark: 80,
    Blender: 95,
    Unity: 85,
    "C#": 70,
    "Unreal Engine": 50,
    Maya: 50,
    Zbrush: 75,
    "Substance Painter": 80,
    Photoshop: 80,
    Illustrator: 80,
    "After Effects": 70,
    "Premiere Pro": 80,
    "DaVinci Resolve": 60,
    "Marvelous Designer": 75,
    "Kubernetes": 70,
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
