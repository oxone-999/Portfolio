import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Cards.module.css";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decodeToken } from "react-jwt";
import CopyLink from "../CopyLink/CopyLink";
import EditModal from "../editModal_Cards/edit_Modal";
import Lottie from "lottie-react";
import Loading from "../../lottie/loading.json";

const apiUrl = import.meta.env.VITE_API_URL;

const Cards = (props) => {
  const projectId = props.id;
  const [loading,setLoading] = React.useState(false);
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");
  const [likes, setLikes] = React.useState(0);
  const [shares, setShares] = React.useState(0);
  const [likesArray, setLikesArray] = React.useState([]);
  const [isLiked, setIsLiked] = React.useState(false);
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  const [editModal, setEditModal] = React.useState(false);
  const [editProjectId, setEditProjectId] = React.useState("");

  const [coverImage, setCoverImage] = React.useState(props.thumbnail.url);

  const [previewThumbnail, setPreviewThumbnail] = React.useState(
    "/images/thumbnail.png"
  );
  const [thumbnail, setThumbnail] = React.useState(props.thumbnail.url);

  useEffect(() => {
    setCoverImage(thumbnail)
  },[thumbnail]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    convertToBase64(file).then((base64) => {
      setThumbnail(base64);
    });
    setPreviewThumbnail(URL.createObjectURL(file));
  };

  const handleThumbnail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/projects/thumbnail/${editProjectId}`,
        {
          thumbnail: thumbnail,
        }
      );
      setLoading(false);
      toast.success("Thumbnail Updated Successfully",{
        autoClose:1000
      });
      console.log(response.data);
      setEditModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const likes = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/projects/likes/${projectId}`
        );
        setLikes(response.data.likes.length);
        setLikesArray(response.data.likes);
        // console.log("likes", response.data.likes);
      } catch (error) {
        console.log(error);
      }
    };
    likes();
  }, [projectId]);

  useEffect(() => {
    if (token === null) return;
    const decodedToken = decodeToken(token);
    const authorId = decodedToken._id;
    //find if in likes array this user exist or not
    if (likesArray.includes(authorId)) {
      setIsLiked(true);
    }
  }, [likesArray, token]);

  useEffect(() => {
    const shares = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/projects/shares/${projectId}`
        );
        setShares(response.data.shares.length);
        // console.log("shares", response.data.shares);
      } catch (error) {
        console.log(error);
      }
    };
    shares();
  }, []);

  const handleEditClick = async (id) => {
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
    if (token === null) {
      toast.error("Please Login to Like or Share");
      return;
    }

    const decodedToken = decodeToken(token);
    const authorId = decodedToken._id;

    if (type === "share") {
      setShowModal(true);
      setShareUrl(`https://anujverma.live/users/projects/${projectId}`);
    }

    try {
      const response = await axios.put(`${apiUrl}/projects/${projectId}`, {
        authorId: authorId,
        type: type,
      });
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
          {loading ? (
            <div className={Styles.loading}>
              <Lottie animationData={Loading} loop={true} />
            </div>
          ) : (
          <EditModal
            setEditModal={setEditModal}
            editModal={editModal}
            editProjectId={editProjectId}
            projectId={projectId}
            handleThumbnailChange={handleThumbnailChange}
            handleThumbnail={handleThumbnail}
            previewThumbnail={previewThumbnail}
          />
          )}
        </div>
        <div className={Styles.cardImage}>
          <div
            className={Styles.thumbnail}
            style={{
              backgroundImage: `url(${coverImage})`,
              backgroundPosition:"center",
              backgroundSize: "80%",
              backgroundRepeat: "no-repeat",
              mixBlendMode: "multiply"
            }}
            onClick={() => handleClick(props.id)}
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
                    <img src="/images/like.png" alt="like" />
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
                    <img src="/images/string.png" alt="comment" />
                  </div>
                </div>
              </div>
              <div
                className={Styles.reaction_icon}
                onClick={() => handleLikesAndShares("share")}
              >
                <div className={Styles.shareButton}>
                  <div className={Styles.shareIcon}>
                    <img src="/images/copy.png" alt="share" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
