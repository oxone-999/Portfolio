import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Model from "./components/Model/Model";
import Project from "./components/projects/Project";
import Login from "./components/Login/Login";
import Signup from "./components/SIgnup/Signup";

function App() {
  const user = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {user && <Route path="/projects" element={<Project />} />}
        <Route path="/projects" element={<Navigate replace to="/login" />} />
        <Route path="/projects/:id" element={<Model />} />
      </Routes>
    </Router>
  );
}

export default App;
