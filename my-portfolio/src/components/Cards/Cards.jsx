import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Cards.module.css";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decodeToken } from "react-jwt";
import CopyLink from "../CopyLink/CopyLink";

function Cards(props) {
  const projectId = props.id;
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");
  const decodedToken = decodeToken(token);
  const authorId = decodedToken._id;
  const [likes, setLikes] = React.useState(0);
  const [shares, setShares] = React.useState(0);
  const [likesArray, setLikesArray] = React.useState([]);
  const [isLiked, setIsLiked] = React.useState(false);
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  const [editModal, setEditModal] = React.useState(false);
  const [editProjectId, setEditProjectId] = React.useState("");

  const [previewThumbnail, setPreviewThumbnail] = React.useState(null);
  const [thumbnail, setThumbnail] = React.useState(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    convertToBase64(file).then((base64) => {
      setThumbnail(base64);
    });
    setPreviewThumbnail(URL.createObjectURL(file));
  };

  const handleThumbnail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/thumbnail/${editProjectId}`,
        {
          thumbnail: thumbnail,
        }
      );
      toast.success("Thumbnail Updated Successfully");
      // console.log(response.data);
      setEditModal(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const likes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/likes/${projectId}`
        );
        setLikes(response.data.likes.length);
        setLikesArray(response.data.likes);
        // console.log("likes", response.data.likes);
      } catch (error) {
        console.log(error);
      }
    };
    likes();
  }, []);

  useEffect(() => {
    //find if in likes array this user exist or not
    if (likesArray.includes(authorId)) {
      setIsLiked(true);
    }
  }, [likesArray, authorId]);

  useEffect(() => {
    const shares = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/shares/${projectId}`
        );
        setShares(response.data.shares.length);
        // console.log("shares", response.data.shares);
      } catch (error) {
        console.log(error);
      }
    };
    shares();
  }, []);

  const handleEditClick = (id) => {
    setEditModal(true);
    setEditProjectId(id);
  };

  const handleClick = (id) => {
    if (admin) {
      navigate(`/projects/${id}`);
    } else {
      navigate(`/users/projects/${id}`);
    }
    // console.log(props);
  };

  const handleLikesAndShares = async (type) => {
    // console.log("Likes");

    if (type === "share") {
      setShowModal(true);
      setShareUrl(`http://localhost:5173/users/projects/${projectId}`);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          authorId: authorId,
          type: type,
        }
      );
      if (type === "like") {
        if (response.data.result === "liked") {
          setLikes(likes + 1);
          setIsLiked(!isLiked);
        } else if (response.data.result === "unliked") {
          setLikes(likes - 1);
          setIsLiked(!isLiked);
        }
      } else if (type === "share") {
        setShares(shares + 1);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <CopyLink
        showModal={showModal}
        shareUrl={shareUrl}
        setShowModal={setShowModal}
      />
      <div className={Styles.card}>
        <div>
          {admin && (
            <button
              className={Styles.editBtn}
              onClick={() => handleEditClick(props.id)}
            >
              Edit
            </button>
          )}
          {editModal && (
            <div className={Styles.modalContainer}>
              <div className={Styles.modalContent}>
                <form onSubmit={handleThumbnail}>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                  <img
                    style={{ width: "50px" }}
                    src={previewThumbnail}
                    alt="preview"
                  />
                  <button type="submit">Update</button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className={Styles.cardImage} onClick={() => handleClick(props.id)}>
          <div
            className={Styles.thumbnail}
            style={{
              backgroundImage: `url(${props.thumbnail.url})`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className={Styles.head}>
            <div className={Styles.title}>
              {props.title.substr(0, 20) + `...`}
            </div>
            <div className={Styles.reaction_button}>
              <div
                className={Styles.reaction_icon}
                onClick={() => handleLikesAndShares("like")}
              >
                <div className={Styles.likeButton}>
                  <div className={Styles.likeCount}>{likes}</div>
                  <div className={Styles.likeIcon}>
                    <img src="./images/like.png" alt="like" />
                  </div>
                </div>
              </div>
              <div
                className={Styles.reaction_icon}
                onClick={() => {
                  navigate(`/users/projects/${projectId}#comment`);
                }}
              >
                <div className={Styles.shareButton}>
                  <div className={Styles.shareIcon}>
                    <img src="./images/string.png" alt="comment" />
                  </div>
                </div>
              </div>
              <div
                className={Styles.reaction_icon}
                onClick={() => handleLikesAndShares("share")}
              >
                <div className={Styles.shareButton}>
                  <div className={Styles.shareIcon}>
                    <img src="./images/copy.png" alt="share" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Cards.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  thumbnail: PropTypes.object.isRequired,
};

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export default Cards;
