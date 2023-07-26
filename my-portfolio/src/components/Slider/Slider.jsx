import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "./slider.css";
import PropTypes from "prop-types";

const Slider = ({ project }) => {
  const slideRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleClickNext = () => {
    let items = slideRef.current.querySelectorAll(".item");
    slideRef.current.appendChild(items[0]);
  };

  const handleClickPrev = () => {
    let items = slideRef.current.querySelectorAll(".item");
    slideRef.current.prepend(items[items.length - 1]);
  };

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
              <div className="content">
                <div className="name">Name</div>
                <div className="des">Description</div>
                <button>See more</button>
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
