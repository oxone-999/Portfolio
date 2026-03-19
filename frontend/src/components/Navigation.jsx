import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Styles from "../styles/Navbar.module.css";
import { Code, Box } from "lucide-react";

function Navigation({ role, setRole }) {

  const toggleRole = () => {
    setRole(role === "SDE" ? "3D" : "SDE");
  };

  const isSDE = role === "SDE";

  return (
    <header className={Styles.header}>
      <div className={Styles.toggleContainer}>
        <div className={Styles.toggleTrack} onClick={toggleRole}>
          <motion.div
            className={Styles.toggleThumb}
            initial={false}
            animate={{ x: isSDE ? 0 : '100%' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          <div className={`${Styles.toggleOption} ${isSDE ? Styles.activeText : ''}`}>
            <Code size={18} />
            <span>SDE</span>
          </div>
          <div className={`${Styles.toggleOption} ${!isSDE ? Styles.activeText : ''}`}>
            <Box size={18} />
            <span>3D Artist</span>
          </div>
        </div>
      </div>

      <nav className={Styles.navbar}>
        <NavLink to="/home" className={({isActive}) => isActive ? Styles.activeLink : Styles.link}>Home</NavLink>
        <NavLink to="/projects" className={({isActive}) => isActive ? Styles.activeLink : Styles.link}>Projects</NavLink>
        <NavLink to="/skills" className={({isActive}) => isActive ? Styles.activeLink : Styles.link}>Skills</NavLink>
        <NavLink to="/journey" className={({isActive}) => isActive ? Styles.activeLink : Styles.link}>Journey</NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? Styles.activeLink : Styles.link}>About</NavLink>
      </nav>
    </header>
  );
}

export default Navigation;
