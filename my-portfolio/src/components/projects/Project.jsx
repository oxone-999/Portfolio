import React, { useEffect } from "react";
import Styles from "./Project.module.css";
import Cards from "../Cards/Cards";
import Header from "../Header/Header";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Corousal from "../Corousal/Corousal";

function Project() {
  const [fetchImages, setFetchImages] = React.useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/images`);
        setFetchImages(response.data.projects);
        console.log(response.data.projects);
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, []);

  return (
    <>
      <ToastContainer />
      <Header />
      <Corousal />
      <div className={Styles.prohome}>
        <div className={Styles.prohomeCards}>
          <div className={Styles.prohomeCardsWrapper}>
            {fetchImages !== null &&
              fetchImages !== undefined &&
              fetchImages &&
              fetchImages.map((item) => (
                <Cards
                  key={item.id}
                  image={item.file}
                  preview={item.preview}
                  link={item.github}
                  skills={item.skills}
                  title={item.username}
                  id={item.id}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
