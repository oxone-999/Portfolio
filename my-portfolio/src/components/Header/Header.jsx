import { useEffect, useState } from "react";
import Styles from "./Header.module.css";
import AddPopup from "../AddPopup/AddPopup";
import { decodeToken } from "react-jwt";
import axios from "axios";

const Header = () => {
  const [currUser, setUser] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");

  const handleAdd = (e) => {
    e.preventDefault();
    setIsFormOpen(true);
    document.body.classList.add("popup-open");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    window.location = "/login";
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location = "/login";
  };

  useEffect(() => {
    console.log("currUser", currUser);
    if (token) {
      const decodedToken = decodeToken(token);
      const user = decodedToken;
      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
      }
    }

    if (admin === "true") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [token, admin, currUser]);

  useEffect(() => {
    const users = async () => {
      try {
        const response = await axios.get(
          `https://portfolio-3l4k.onrender.com/api/users/`
          // `http://localhost:5000/api/users/`
        );
        setUsers(response.data.users);
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
                  {admin ? (
                    <img src="/images/myself.jpg" alt="profile" />
                  ) : (
                    <img src="/images/user.png" alt="user" />
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={Styles.profile}>
                  {Object.keys(currUser).length === 0 ? (
                    <img src="/images/user.png" alt="profile" />
                  ) : (
                    <img src={currUser.avatar} alt="profile" />
                  )}
                </div>
                <div className={Styles.username}>
                  {Object.keys(currUser).length === 0 ? (
                    <h2>user</h2>
                  ) : (
                    <h2>{currUser.username}</h2>
                  )}
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
              {token !== null ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <button onClick={handleLogin}>Login</button>
              )}
            </div>
          </div>
          {isFormOpen && <AddPopup setIsFormOpen={setIsFormOpen} />}
        </div>
      </div>
    </>
  );
};

export default Header;
