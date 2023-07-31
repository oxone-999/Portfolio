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

const Home = () => {
  return (
    <div className={Styles.home}>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <ProfileCard />
        <div className={Styles.projectView}>
          <ProjectView />
        </div>
      </div>
      <div className={Styles.contact}>
        <div className={Styles.social_media}>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.location.href = "https://github.com/oxone-999";
            }}
          >
            <div className={Styles.socialIcons}>
              <BsGithub size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.location.href = "https://instagram.com/oxone_999";
            }}
          >
            <div className={Styles.socialIcons}>
              <BsInstagram size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.location.href =
                "https://www.facebook.com/profile.php?id=100039765825690";
            }}
          >
            <div className={Styles.socialIcons}>
              <BsFacebook size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.location.href =
                "https://www.linkedin.com/in/anuj-verma-b430431b1/";
            }}
          >
            <div className={Styles.socialIcons}>
              <BsLinkedin size="2rem" />
            </div>
          </div>
          <div
            className={Styles.hoverHandle}
            onClick={() => {
              window.location.href = "https://www.behance.net/anujverma9/";
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
