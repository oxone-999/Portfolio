import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Journey from "./components/Journey";
import Project from "./components/Project";
import Skills from "./components/Skills";
import Marketplace from "./components/Marketplace";

function AppContent() {
  const identityMode = useSelector((state) => state.identity.mode);

  // You can dynamically adjust body classes if 3D vs SDE mode requires separate root theming
  // Stitch tailwind output primarily assumes static tokens for both modes, but handles accents via different class usages or dynamic css variables if needed.
  useEffect(() => {
    if (identityMode === "3D") {
      document.documentElement.style.setProperty("--color-primary", "var(--color-tertiary)");
      document.documentElement.style.setProperty("--color-on-primary", "var(--color-on-tertiary)");
      document.documentElement.style.setProperty("--color-primary-dim", "var(--color-tertiary-dim)");
    } else {
      document.documentElement.style.setProperty("--color-primary", "#a3a6ff");
      document.documentElement.style.setProperty("--color-on-primary", "#0d00a4");
      document.documentElement.style.setProperty("--color-primary-dim", "#5d61f9");
    }
  }, [identityMode]);

  const selectionBg = identityMode === "3D" ? "#6fffe8" : "#a3a6ff";
  const selectionColor = identityMode === "3D" ? "#006055" : "#0d00a4";

  return (
    <div className="flex flex-col min-h-screen bg-bg-surface">
      <style>{`
        ::selection {
          background-color: ${selectionBg} !important;
          color: ${selectionColor} !important;
        }
      `}</style>
      <NavBar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Journey />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/about" element={<Skills />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </div>
      <Footer />
    </div>
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
