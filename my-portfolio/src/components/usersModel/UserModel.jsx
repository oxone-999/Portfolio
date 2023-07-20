import React, { useEffect } from "react";
import Styles from "./userModel.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserModel = () => {
  const { id } = useParams();
  const [project, setProject] = React.useState({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/images/${id}`
        );
        setProject(response.data.project);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProject();
  }, [id]);

  return (
    <div className={Styles.model}>
      <div className={Styles.modelHeader}>
        <div className={Styles.modelTitle}>
          <h3>{project.title}</h3>
        </div>
      </div>
      <div className={Styles.description}>
        <div className={Styles.projectDescription}>
          <p>{project.projectDescription}</p>
        </div>
      </div>
      <div className={Styles.imageDiv}>
        <div>s</div>
        <div className={Styles.corousal}>
          {project.images && project.images.length ? (
            project.images.map((image) => (
              <div className={Styles.images} key={image._id}>
                <img src={image.url} alt="project" />
              </div>
            ))
          ) : (
            <img src="./images/thumbnail.png" alt="project" />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModel;
