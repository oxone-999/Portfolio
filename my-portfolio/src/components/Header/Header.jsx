import { useEffect, useState } from "react";
import Styles from "./Header.module.css";
import AddPopup from "../AddPopup/AddPopup";
import { isExpired, decodeToken } from "react-jwt";
import { Button } from "@mui/material";

function Header() {
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");
  const decodedToken = decodeToken(token);
  const [currUser, setUser] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
                <div>
                  <h2>
                    Welcome Back!! {currUser.username} , We have kept your
                    website safe and secure.
                  </h2>
                </div>
              </>
            ) : (
              <h2>{currUser.username}</h2>
            )}
          </div>
          <div className={Styles.buttons}>
            <div>
              {disabled === false && (
                <button type="button" className={Styles.buttonAdd} onClick={handleAdd}>
                  <span className={Styles.button__text}>Add Item</span>
                  <span className={Styles.button__icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="currentColor"
                      height="24"
                      fill="none"
                      className={Styles.svg}
                    >
                      <line y2="19" y1="5" x2="12" x1="12"></line>
                      <line y2="12" y1="12" x2="19" x1="5"></line>
                    </svg>
                  </span>
                </button>
              )}
            </div>
            <div>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
          {isFormOpen && <AddPopup setIsFormOpen={setIsFormOpen} />}
        </div>
      </div>
    </>
  );
}

export default Header;
