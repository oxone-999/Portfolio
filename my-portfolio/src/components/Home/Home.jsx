import {
  BsGithub,
  BsBehance,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
} from "react-icons/bs";
import Styles from "./Home.module.css";
import ProfileCard from "../ProfileCard/ProfileCard";
import ProjectView from "../ProjectView/ProjectView";
import React from "react";

const Home = () => {
  return (
    <div className={Styles.home}>
      <div className={Styles.intro}>
        <div className={Styles.head1}>HEY! I'M ANUJ VERMA</div>
        <div className={Styles.head2}>
          I am a 3D Artist, Animator & Full Stack Developer
        </div>
        {/* <ProfileCard /> */}
          <ProjectView />
      </div>
      <div className={Styles.contact}>
        <div className={Styles.social_media}>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.open("https://github.com/oxone-999", "_blank");
            }}
          >
            <div className={Styles.socialIcons}>
              <BsGithub size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.open("https://instagram.com/oxone_999", "_blank");
            }}
          >
            <div className={Styles.socialIcons}>
              <BsInstagram size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.open(
                "https://www.facebook.com/profile.php?id=100039765825690",
                "_blank"
              );
            }}
          >
            <div className={Styles.socialIcons}>
              <BsFacebook size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.open(
                "https://www.linkedin.com/in/anuj-verma-b430431b1/",
                "_blank"
              );
            }}
          >
            <div className={Styles.socialIcons}>
              <BsLinkedin size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.open("https://www.behance.net/anujverma9/", "_blank");
            }}
          >
            <div className={Styles.socialIcons}>
              <BsBehance size="2rem" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
