import React, { useState, useEffect, useRef } from "react";
import Styles from "../styles/Navbar.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function Navigation({role, setRole, setDesignation }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [barStyle, setBarStyle] = useState({ left: "2rem", width: "3rem" });
  const [barClicked, setBarClicked] = useState({ left: "2rem", width: "3rem" });
  const [showClickMe, setShowClickMe] = useState(false);
  const listRefs = useRef([]);

  const toggleColor = () => {
    console.log(role);
    document
      .getElementById("root")
      .style.setProperty("--primary", role === "3D" ? "#69247C" : "#27445D");

    document
      .getElementById("root")
      .style.setProperty("--secondary", role === "3D" ? "#DA498D" : "#71BBB2");

    document
      .getElementById("root")
      .style.setProperty("--tertiary", role === "3D" ? "#F9E6CF" : "#EFE9D5");
  };

  useEffect(() => {
    // Set default position to "Home" when the component mounts (only once)
    const homeItem = listRefs.current[0]; // "Home" is the first item
    if (homeItem) {
      const rect = homeItem.getBoundingClientRect();
      setBarStyle({ left: `${rect.left}px`, width: `${rect.width}px` });
      setBarClicked({ left: `${rect.left}px`, width: `${rect.width}px` });
    }
  }, []);

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setBarStyle({ left: `${rect.left}px`, width: `${rect.width}px` });
  };

  const handleMouseLeave = () => {
    setBarStyle(barClicked);
  };

  const handleMouseClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setBarClicked({ left: `${rect.left}px`, width: `${rect.width}px` });

    navigate(`/${role}/${e.target.textContent.toLowerCase()}`);
  };

  const navigationList = [
    "Home",
    "Projects",
    "Skills",
    "Journey",
    "About",
  ];

  const handleRole = () => {
    const newRole = role === "3D" ? "SDE" : "3D";
    setRole(newRole);
    setDesignation(newRole === "3D" ? "3D Artist" : "Full Stack Developer");
    toggleColor();
    
    // Navigate to the same page with the new role
    const currentPage = location.pathname.split('/')[2] || 'home';
    navigate(`/${newRole}/${currentPage}`);
  };
  return (
    <div className={Styles.navbar}>
      <div className={Styles.navigations}>
        <ul className={Styles.list}>
          {navigationList.map((item, index) => (
            <li
              key={index}
              ref={(el) => (listRefs.current[index] = el)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleMouseClick}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={Styles.role} onClick={handleRole}>
        <span className={`${Styles.roleText} ${showClickMe ? Styles.hidden : ''}`}>
          {role}
        </span>
        <span className={`${Styles.clickMe} ${showClickMe ? Styles.visible : ''}`}>
          Click me
        </span>
      </div>
      <div
        className={Styles.movingBar}
        style={{
          left: barStyle.left,
          width: barStyle.width,
        }}
      ></div>
    </div>
  );
}

export default Navigation;
