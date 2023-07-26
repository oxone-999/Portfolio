import React, { useEffect } from "react";
import Styles from "./Project.module.css";
import Cards from "../Cards/Cards";
import Header from "../Header/Header";
import axios from "axios";

function Project() {
  const [fetchProject, setFetchProject] = React.useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/images`);
        setFetchProject(response.data.projects);
        console.log("project", response.data.projects);
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className={Styles.Project}>
      <Header />
      <div className={Styles.prohome}>
        <div className={Styles.prohomeCards}>
          <div className={Styles.prohomeCardsWrapper}>
            {fetchProject !== null &&
              fetchProject !== undefined &&
              fetchProject &&
              fetchProject.map((item) => (
                <Cards
                  key={item._id}
                  title={item.title}
                  description={item.projectDescription}
                  id={item._id}
                  thumbnail={item.thumbnail}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
