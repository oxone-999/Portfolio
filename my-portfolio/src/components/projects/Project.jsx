import React, { useEffect } from "react";
import Styles from "./Project.module.css";
import Cards from "../Cards/Cards";
import Header from "../Header/Header";
import axios from "axios";
import Lottie from "lottie-react";
import Loading from "../../lottie/loading.json";

const apiUrl = import.meta.env.VITE_API_URL;

function Project() {
  const [fetchProject, setFetchProject] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/images`
        );
        setFetchProject(response.data.projects);
        setLoading(false);
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
          {loading ? (
            <div className={Styles.loading}>
              <Lottie animationData={Loading} loop={true} />
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
