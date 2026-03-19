import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import AboutMe from "./components/AboutMe";
import Skills from "./components/Skills";
import Projects from "./components/Project";
import Journey from "./components/Journey";

function App() {
  const [role, setRole] = React.useState("SDE");

  useEffect(() => {
    document.body.className = role === "SDE" ? "theme-sde" : "theme-3d";
  }, [role]);

  return (
    <div className={role === "SDE" ? "theme-sde" : "theme-3d"} id="app-root">
      <div className="app-container">
        <BrowserRouter>
          <Navigation role={role} setRole={setRole} />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home role={role} />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/skills" element={<Skills role={role}/>} />
            <Route path="/projects" element={<Projects role={role} />} />
            <Route path="/journey" element={<Journey />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
