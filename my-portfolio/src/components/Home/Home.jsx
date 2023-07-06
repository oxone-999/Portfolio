import React from "react";
import {
  BsGithub,
  BsBehance,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
} from "react-icons/bs";
import Styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={Styles.home}>
      <div className={Styles.bg}>
        <img src="/images/bg_home.png" alt="arrow" />
      </div>
      <div className={Styles.profile1}>
        <div className={Styles.profileImage}>
          <img src="/images/myself.jpg" alt="profile" />
        </div>
        <div>
          <h1>Anuj Verma</h1>
          <h3>3D Artist</h3>
          <a href="https://rebrand.ly/5ofsfo1" target="blank">
            <button className={Styles.btn}>Resume</button>
          </a>
          <button
            className={Styles.btn}
            onClick={() => {
              window.location.href = "mailto:anujverma11062002@gmail.com";
            }}
          >
            Hire Me
          </button>
        </div>
      </div>
      <div className={Styles.emptyDiv}>
        <div className={Styles.about_me}>
          <p>
            Hey, my name is Anuj Verma. I am a student at <b>IIT Kharagpur</b>{" "}
            and currently working as the Design Head at{" "}
            <b>Computer Graphics Society, IIT Kharagpur</b>. I have intermediate
            skills in 3D Art and Competitive Programming.
          </p>
        </div>
      </div>
      <div className={Styles.projectView}>
        <button
          className={Styles.cta}
          onClick={() => {
            window.location.href = "/projects";
          }}
        >
          <span className={Styles.hover_underline_animation}> Projects </span>
          <svg
            viewBox="0 0 46 16"
            height="10"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
            id="arrow-horizontal"
          >
            <path
              transform="translate(30)"
              d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
              data-name="Path 10"
              id="Path_10"
            ></path>
          </svg>
        </button>
      </div>
      <div className={Styles.contact}>
        <div className={Styles.social_media}>
          <div>
            <a
              href="https://github.com/oxone-999"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsGithub size="2rem" />
            </a>
          </div>
          <div>
            <a
              href="https://instagram.com/oxone_999"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsInstagram size="2rem" />
            </a>
          </div>
          <div>
            <a
              href="https://www.facebook.com/profile.php?id=100039765825690"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsFacebook size="2rem" />
            </a>
          </div>
          <div>
            <a
              href="https://www.linkedin.com/in/anuj-verma-b430431b1/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsLinkedin size="2rem" />
            </a>
          </div>
          <div>
            <a
              href="https://www.behance.net/anujverma9/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsBehance size="2rem" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
