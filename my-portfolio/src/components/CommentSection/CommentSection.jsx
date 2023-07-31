import React, { useEffect } from "react";
import Styles from "./CommentSection.module.css";
import propTypes from "prop-types";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { decodeToken } from "react-jwt";

const CommentSection = ({ parent_id, parent_Name }) => {
  const parentId = parent_id;
  const [replies, setReplies] = React.useState([]);
  const [replyParentId, setReplyParentId] = React.useState("0");
  const [replyParentName, setReplyParentName] = React.useState("sample");
  const [user, setUser] = React.useState({});
  const [showReplyBox, setShowReplyBox] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [expandedReplies, setExpandedReplies] = React.useState([]);

  const toggleExpandReplies = (replyId) => {
    setExpandedReplies((prevExpandedReplies) =>
      prevExpandedReplies.includes(replyId)
        ? prevExpandedReplies.filter((id) => id !== replyId)
        : [...prevExpandedReplies, replyId]
    );
  };

  const formatTime = (date) => {
    const newDate = new Date(date);
    const formattedTimeDifference = formatDistanceToNow(newDate, {
      addSuffix: true,
    });
    // console.log(formattedTimeDifference);
    return formattedTimeDifference;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);

    if (token) {
      const user = decodedToken;
      // console.log(user);
      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
        window.location = "/login";
      }
    } else {
      window.location = "/";
    }
  }, []);

  useEffect(() => {
    const replies = async () => {
      try {
        const response = await axios.get(
          `https://portfolio-3l4k.onrender.com/api/replies/${parentId}`
          // `http://localhost:5000/api/replies/${parentId}`
        );
        setReplies(response.data.replies);
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    replies();
  }, [parentId]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleReplyBox = (id, author) => {
    setShowReplyBox(true);
    setReplyParentId(id);
    setReplyParentName(author);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const author_id = user._id;
    const authorName = user.username;
    const avatar = user.avatar;
    try {
      const response = await axios.post(
        `https://portfolio-3l4k.onrender.com/api/replies/${replyParentId}`,
        // `http://localhost:5000/api/replies/${replyParentId}`,
        {
          authorName,
          avatar,
          author_id,
          comment,
        }
      );
      // console.log(response);
      if (response.status === 201) {
        console.log(response.data);
        const replies = async () => {
          try {
            const response = await axios.get(
              `https://portfolio-3l4k.onrender.com/api/replies/${parentId}`,
              // `http://localhost:5000/api/replies/${parentId}`
            );
            setReplies(response.data.replies);
            console.log("replies", response.data.replies);
            // console.log(response);
          } catch (error) {
            console.log(error);
          }
        };
        replies();
        setShowReplyBox(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={Styles.commentSection}>
        {parent_Name !== "0" && <div className={Styles.threadBlock}></div>}
        <div>
          {replies &&
            replies !== undefined &&
            replies.map((reply) => (
              <div
                key={reply._id}
                className={Styles.comment}
                style={{ marginLeft: "30px" }}
              >
                <div className={Styles.block}>
                  <img
                    src={reply.avatar}
                    className={Styles.avatar}
                    alt="avatar"
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={Styles.author}>
                      <h5>{reply.author}</h5>
                      <p className={Styles.created}>
                        {formatTime(reply.createdAt)}
                      </p>
                    </div>
                    <div className={Styles.content}>
                      <p>{reply.comment}</p>
                      <p
                        style={{ fontSize: "0.6rem" }}
                        className={Styles.replyBtn}
                        onClick={() => handleReplyBox(reply._id, reply.author)}
                      >
                        reply
                      </p>
                      {reply.replies.length !== 0 && (
                        <p
                          style={{ fontSize: "0.5rem" }}
                          className={Styles.replyBtn}
                          onClick={() => toggleExpandReplies(reply._id)}
                        >
                          {expandedReplies.includes(reply._id)
                            ? "Hide Replies"
                            : "See Replies"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {showReplyBox && replyParentId === reply._id && (
                  <div className={Styles.block}>
                    <img
                      src={user.avatar}
                      className={Styles.avatar}
                      alt="avatar"
                    />
                    <div className={Styles.contentBlock}>
                      <h5 style={{ marginBottom: "0.1rem" }}>
                        {user.username}
                      </h5>
                      <div className={Styles.btncontent}>
                        <textarea
                          placeholder="Add a comment..."
                          defaultValue={`@${replyParentName}`}
                          value={comment}
                          onChange={handleInputChange}
                        />
                        <button onClick={handleSubmit}>comment</button>
                        <button
                          onClick={() => {
                            setShowReplyBox(false);
                          }}
                          style={{ backgroundColor: "#ff6363" }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {expandedReplies.includes(reply._id) && (
                  <CommentSection
                    parent_id={reply._id}
                    parent_Name={reply.author}
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

CommentSection.propTypes = {
  parent_id: propTypes.string.isRequired,
  parent_Name: propTypes.string.isRequired,
};

export default CommentSection;
