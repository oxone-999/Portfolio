import React, { useEffect } from "react";
import axios from "axios";
import { isExpired, decodeToken } from "react-jwt";
import Styles from "./comment.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

function Comment() {
  const { parentId } = useParams();
  const [comment, setComment] = React.useState("");
  const [threads, setThreads] = React.useState([]);
  const [user, setUser] = React.useState({});
  console.log(parentId);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        console.log(parentId);
        const response = await axios.get(
          `http://localhost:5000/api/replies/${parentId}`
        );
        setThreads(response.data.replies);
        console.log(response.data.replies);
      } catch (error) {
        console.log(error);
      }
    };
    fetchThreads();
  }, []);

  const handleReplySelect = (event) => {
    event.preventDefault();
    const selectedReplyId = event.target.value;
    if (selectedReplyId) {
      // Redirect to the appropriate URL when a reply is selected
      setTimeout(() => {
        // window.location.href = `/comments/${selectedReplyId}`;
      }, 100);
    }
  };

  const handleInputChange = (e) => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);

    if (token) {
      const user = decodedToken;
      //   console.log(user);
      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
        window.location = "/login";
      }
    } else {
      window.location = "/";
    }
    setComment(e.target.value);
  };

  const handleThreads = (Id) => {
    console.log(Id);
    window.location = `/comments/${Id}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const author_id = user._id;
    const authorName = user.username;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/replies/${parentId}`,
        {
          authorName,
          author_id,
          comment,
        }
      );
      toast.success("Comment added successfully", {
        autoClose: 1000,
      });
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={Styles.Threads}>
      <ToastContainer />
      <h1>Threads</h1>
      <div className={Styles.threadList}>
        {threads !== null &&
          threads !== undefined &&
          threads &&
          threads.map((item) => (
            <div
              className={Styles.threadBlock}
              key={item._id}
              onClick={() => handleThreads(item._id)}
            >
              <div className={Styles.content}>
                <h3>{item.comment}</h3>
                <h4>{item.author}</h4>
                <h5>{item.replies.length} : reply</h5>
              </div>
              <div className={Styles.list}>
                <select
                  className={Styles.dropdown}
                  onChange={handleReplySelect}
                >
                  <option value="">Select a reply</option>
                  {item.replies !== null &&
                    item.replies !== undefined &&
                    item.replies &&
                    item.replies.map((reply) => (
                      <option key={reply._id} value={reply._id}>
                        {reply.authorName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}
      </div>
      <div className={Styles.Input}>
        <input placeholder="Comment" onChange={handleInputChange} />
        <button onClick={handleSubmit}>Comment</button>
      </div>
    </div>
  );
}

export default Comment;
