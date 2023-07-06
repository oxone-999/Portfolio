import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Cards.module.css";

function Cards(props) {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/cardDetail/${id}`);
    console.log(id);
  };

  return (
    <>
      <div className={Styles.card} onClick={() => handleClick(props.id)}>
        <div className={Styles.head}>
          <div className={Styles.title}>{props.title}</div>
          <div className={Styles.reaction_button}>
            <div className={Styles.reaction_icon}>
              <i className={`{Styles.fas} {Styles.fa_heart}`}></i>
            </div>
            <div className={Styles.reaction_icon}>
              <i className={`${Styles.fas} ${Styles.fa_comment}`}></i>
            </div>
            <div className={Styles.reaction_icon}>
              <i className={`${Styles.fas} ${Styles.fa_share}`}></i>
            </div>
          </div>
        </div>
        <div className={Styles.cardImage}>
          <img src={props.preview.url} alt="Preview" />
        </div>
      </div>
    </>
  );
}

export default Cards;
