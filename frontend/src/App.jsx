import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import AboutMe from "./components/AboutMe";
// import Contact from "./components/Contact";
import Skills from "./components/Skills";
import Projects from "./components/Project";
// import Experience from "./components/Experience";
import Journey from "./components/Journey";
// import ArtWork from "./components/ArtWork";
// import Extras from "./components/Extras";

function App() {
  const [designation, setDesignation] = React.useState("Full Stack Developer");
  const [role, setRole] = React.useState("SDE");
  return (
    <>
      <BrowserRouter>
        <Navigation role={role} setRole={setRole} setDesignation={setDesignation} />
        <Routes>
          <Route path="/home" element={<Home role={role} designation={designation} />} />
          <Route path="/about" element={<AboutMe />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/skills" element={<Skills role={role}/>} />
          <Route path="/projects" element={<Projects role={role} />} />"
          {/* <Route path="/Experience" element={<Experience />} /> */}
          <Route path="/journey" element={<Journey />} />
          {/* <Route path="/3dartwork" element={<ArtWork />} /> */}
          {/* <Route path="/extras" element={<Extras />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
