import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "./slider.css";
import PropTypes from "prop-types";

const Slider = ({ project }) => {
  const slideRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [openModal, setModal] = useState(false);

  const handleClickNext = () => {
    let items = slideRef.current.querySelectorAll(".item");
    slideRef.current.appendChild(items[0]);
  };

  const handleClickPrev = () => {
    let items = slideRef.current.querySelectorAll(".item");
    slideRef.current.prepend(items[items.length - 1]);
  };

  const handleModal = () => {
    setModal(true);
  };

  const close = () => {
    setModal(false);
  }

  return (
    <div className="container">
      <div className="loadbar" style={{ width: `${loadingProgress}%` }}></div>
      <div id="slide" ref={slideRef}>
        {project.images && project.images.length ? (
          project.images.map((image) => (
            <div
              className="item"
              style={{ backgroundImage: `url(${image.url})` }}
              key={image._id}
            >
              {openModal && <div className="slider_modal">
                {image.description}
                
                <button onClick={close}>close</button>
              </div>}
              <div className="content">
                {/* <div className="name">{image.name}</div> */}
                {/* <button onClick={handleModal}>See more</button> */}
              </div>
            </div>
          ))
        ) : (
          <img src="./images/thumbnail.png" alt="project" />
        )}
      </div>
      <div className="buttons">
        <button id="prev" onClick={handleClickPrev}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button id="next" onClick={handleClickNext}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
};

Slider.propTypes = {
  project: PropTypes.object.isRequired,
};

export default Slider;
