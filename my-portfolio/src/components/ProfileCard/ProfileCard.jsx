import Styles from "./profileCard.module.css";

function ProfileCard() {
  return (
    <div className={Styles.profileCard}>
      <div className={Styles.flip_card}>
        <div className={Styles.flip_card_inner}>
          <div className={Styles.flip_card_front}>
            <div className={Styles.profileImage}>
              <img src="/images/myself.jpg" alt="profile" />
            </div>
            <div>
              <h1 className={Styles.title}>Anuj Verma</h1>
              <h3>3D Artist</h3>
            </div>
          </div>
          <div className={Styles.flip_card_back}>
            <button
              className={Styles.button}
              onClick={() => {
                window.location.href = "https://rebrand.ly/5ofsfo1";
              }}
            >
              <p>Resume</p>
            </button>
            <button
              className={Styles.button}
              onClick={() => {
                const myEmail = "anujverma11062002@gmail.com";
                window.location.href = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(
                  myEmail
                )}`;
              }}
            >
              <p>Contact Me</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;

{
  /* <div className={Styles.profile1}>
        <div className={Styles.profileImage}>
          <img src="/images/myself.jpg" alt="profile" />
        </div>
        <div>
          <h1>Anuj Verma</h1>
          <h3>3D Artist</h3>
          <a href="https://rebrand.ly/5ofsfo1" target="blank">
            <button className={Styles.btn} style={{ marginRight: "15px" }}>
              Resume
            </button>
          </a>
          <button
            className={Styles.btn}
            onClick={() => {
              const myEmail = "anujverma11062002@gmail.com";
              window.location.href = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(
                myEmail
              )}`;
              // window.location.href = "mailto:anujverma11062002@gmail.com";
            }}
          >
            Contact Me
          </button>
        </div>
      </div> */
}
