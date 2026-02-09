import Styles from "../styles/AboutMe.module.css";

function AboutMe() {
  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content}>
          <div className={Styles.about}>
            <p>
              Hello! I'm a graduate of IIT Kharagpur, where I pursued a Dual
              Degree (B.Tech + M.Tech) in Mining Engineering. My journey began
              long before my college days when I discovered my passion for
              coding during high school. Starting with C++ and C, I developed a
              strong foundation in programming and cultivated an expertise in
              Data Structures and Algorithms (DSA). This passion led me to excel
              in competitive programming on platforms like CodeChef and
              Codeforces, solving challenging problems and honing my skills. At
              IIT Kharagpur, I joined CGS, a creative society, as a 3D artist in
              my first year. Over time, I grew into the role of Governor,
              leading projects and guiding the next generation of artists.
              Alongside my engineering studies, I embraced my love for 3D art
              and animation, creating animations that combine technical
              precision with artistic flair—sometimes just for fun!
            </p>
            <p>
              {" "}
              Currently, I am a Technology Consultant at TCG Digital Solutions
              Pvt. Ltd., a role I earned after completing a successful
              internship and receiving a PPO. This position allows me to merge
              my technical expertise with problem-solving skills to deliver
              impactful solutions.
            </p>
            <p>
              {" "}
              Outside of work, I am a lifelong learner and anime enthusiast. My
              multifaceted interests, ranging from coding to 3D animation,
              reflect my belief that creativity and technical knowledge can work
              hand in hand to create something extraordinary.
            </p>
            <p>
              {" "}
              Whether solving complex problems, building innovative solutions,
              or crafting stunning animations, I strive to leave a unique mark
              in every endeavor.
            </p>
          </div>
          <div className={Styles.profile}>
            <img src="/me.jpg" />
          </div>
        </div>
        <div className={Styles.handle}>
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/anuj-verma-b430431b1/"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <strong>Email me @ anujverma11062002@gmail.com</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
