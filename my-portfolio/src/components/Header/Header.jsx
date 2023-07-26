import { useEffect, useState } from "react";
import Styles from "./Header.module.css";
import AddPopup from "../AddPopup/AddPopup";
import { isExpired, decodeToken } from "react-jwt";
import axios from "axios";

function Header() {
  const [currUser, setUser] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handleAdd = (e) => {
    e.preventDefault();
    setIsFormOpen(true);
    document.body.classList.add("popup-open");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    const decodedToken = decodeToken(token);
    // if (isExpired) {
    //   localStorage.removeItem("token");
    //   window.location = "/login";
    // } else
    if (token) {
      const user = decodedToken;
      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
        window.location = "/login";
      }
    } else {
      window.location = "/projects";
    }

    if (admin === "true") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, []);

  useEffect(() => {
    const users = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/`);
        setUsers(response.data.users);
        // console.log(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    users();
  }, []);

  return (
    <>
      <div className={Styles.header}>
        <div className={Styles.headerWrapper}>
          <div className={Styles.headerLeft}>
            {disabled === false ? (
              <>
                <div className={Styles.profile}>
                  <img src="/images/myself.jpg" alt="profile" />
                </div>
              </>
            ) : (
              <>
                <div className={Styles.profile}>
                  <img src={currUser.avatar} alt="profile" />
                </div>
                <div className={Styles.username}>
                  <h2>{currUser.username}</h2>
                </div>
              </>
            )}
          </div>
          <div className={Styles.dashboard}>
            <div className={Styles.users}>
              {disabled === false && (
                <div>
                  <p>Users</p>
                  <p>{users.length}</p>
                </div>
              )}
            </div>
          </div>
          <div className={Styles.buttons}>
            <div className={Styles.add}>
              {disabled === false && (
                <button type="button" onClick={handleAdd}>
                  Add
                </button>
              )}
            </div>
            <div className={Styles.logout}>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
          {isFormOpen && <AddPopup setIsFormOpen={setIsFormOpen} />}
        </div>
      </div>
    </>
  );
}

export default Header;
