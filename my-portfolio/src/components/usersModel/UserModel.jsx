import React, { useEffect } from "react";
import Styles from "./userModel.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentSection from "../CommentSection/CommentSection";
import { decodeToken } from "react-jwt";
import Slider from "../Slider/Slider";

const UserModel = () => {
  const { id } = useParams();
  const [project, setProject] = React.useState({});
  const [started, setBox] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const user = decodedToken;
  const anchor = window.location.hash.replace("#", "");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/images/${id}`
        );
        setProject(response.data.project);
        if (anchor === "comment") {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProject();
  }, [id, anchor]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const author_id = user._id;
    const authorName = user.username;
    const avatar = user.avatar;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/replies/${id}`,
        {
          authorName,
          avatar,
          author_id,
          comment,
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={Styles.model}>
      <div className={Styles.modelHeader}>
        <div className={Styles.modelTitle}>
          <h3>{project.title}</h3>
        </div>
      </div>
      <div className={Styles.description}>
        <div className={Styles.projectDescription}>
          <p>{project.projectDescription}</p>
        </div>
      </div>
      <div className={Styles.imageDiv}>
        <Slider project={project} />
      </div>
      <div className={Styles.horizontal}></div>
      <div className={Styles.CommentBlock}>
        <h2 id="comment" className={Styles.commentHeader}>
          Comment Section
        </h2>
        <button
          className={Styles.startThread}
          onClick={() => {
            setBox(true);
          }}
        >
          Start New Thread
        </button>
        <div className={Styles.commentSection}>
          {started && (
            <div className={Styles.block}>
              <img src={user.avatar} className={Styles.avatar} alt="avatar" />
              <div className={Styles.contentBlock}>
                <h5 style={{ marginBottom: "0.1rem" }}>{user.username}</h5>
                <div className={Styles.btncontent}>
                  <textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={handleInputChange}
                  />
                  <button onClick={handleSubmit}>comment</button>
                  <button
                    onClick={() => {
                      setBox(false);
                    }}
                    style={{ backgroundColor: "#ff6363" }}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          )}
          <CommentSection parent_id={id} parent_Name="0" />
        </div>
      </div>
      <div className={Styles.footer}></div>
    </div>
  );
};

export default UserModel;
