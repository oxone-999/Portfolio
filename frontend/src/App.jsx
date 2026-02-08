import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import AboutMe from "./components/AboutMe";
import Skills from "./components/Skills";
import Projects from "./components/Project";
import Journey from "./components/Journey";

function AppContent() {
  const [designation, setDesignation] = React.useState("Full Stack Developer");
  const [role, setRole] = React.useState("SDE");
  const { role: urlRole } = useParams();

  React.useEffect(() => {
    if (urlRole) {
      setRole(urlRole);
      setDesignation(urlRole === "3D" ? "3D Artist" : "Full Stack Developer");
    }
  }, [urlRole]);

  return (
    <>
      <Navigation
        role={role}
        setRole={setRole}
        setDesignation={setDesignation}
      />
      <Routes>
        <Route
          path="/:role/home"
          element={<Home designation={designation} />}
        />
        <Route path="/:role/about" element={<AboutMe />} />
        <Route path="/:role/skills" element={<Skills />} />
        <Route path="/:role/projects" element={<Projects />} />
        <Route path="/:role/journey" element={<Journey />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
