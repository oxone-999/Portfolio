import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Cards.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function Cards(props) {
  const admin = localStorage.getItem("admin");
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/projects/${id}`);
    console.log(props);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/api/projecs/edit/${props.id}`);
  };

  return (
    <>
      <div className={Styles.card} onClick={() => handleClick(props.id)}>
        <div className={Styles.head}>
          <div className={Styles.title}>{props.title}</div>
          <div className={Styles.reaction_button}>
            <div className={Styles.reaction_icon}>
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div className={Styles.reaction_icon}>
              <FontAwesomeIcon icon={faComment} />
            </div>
            <div className={Styles.reaction_icon}>
              <FontAwesomeIcon icon={faShare} />
            </div>
          </div>
        </div>
        <div className={Styles.cardImage}>
          {/* {admin && (
            <button className={Styles.editBtn} onClick={handleEdit}>Edit</button>
          )} */}
          <img src="./images/thumbnail.png" alt="Preview" />
        </div>
      </div>
    </>
  );
}

Cards.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Cards;
