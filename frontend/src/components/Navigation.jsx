import React, { useState, useEffect, useRef } from "react";
import Styles from "../styles/Navbar.module.css";
import { useNavigate } from "react-router-dom";

function Navigation({role, setRole, setDesignation }) {
  const navigate = useNavigate();
  const [barStyle, setBarStyle] = useState({ left: "2rem", width: "3rem" });
  const [barClicked, setBarClicked] = useState({ left: "2rem", width: "3rem" });
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
    // Set default position to "Home" when the component mounts
    const homeItem = listRefs.current[0]; // "Home" is the first item
    if (homeItem) {
      const rect = homeItem.getBoundingClientRect();
      setBarStyle({ left: `${rect.left}px`, width: `${rect.width}px` });
      setBarClicked({ left: `${rect.left}px`, width: `${rect.width}px` });
      navigate("/home");
    }
  }, []);

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setBarStyle({ left: `${rect.left}px`, width: `${rect.width}px` });
  };

  const handleMouseLeave = () => {
    setBarStyle(barClicked); // Reset position (optional)
  };

  const handleMouseClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setBarClicked({ left: `${rect.left}px`, width: `${rect.width}px` });

    navigate("/" + e.target.textContent.toLowerCase());
  };

  const navigationList = [
    "Home",
    "Projects",
    "Skills",
    "Journey",
    // "Contact",
    "About",
    // "Extras",
  ];

  const handleRole = () => {
    if (role === "3D") {
      setRole("SDE");
      setDesignation("Full Stack Developer");
      toggleColor();
    } else {
      setRole("3D");
      setDesignation("3D Artist");
      toggleColor();
    }
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
        {role}
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
