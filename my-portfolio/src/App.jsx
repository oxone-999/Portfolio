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
import UserModel from "./components/usersModel/UserModel";
import CommentSection from "./components/CommentSection/CommentSection";

function App() {
  const admin = localStorage.getItem("admin");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Project />} />
        {admin && <Route path="/projects/:id" element={<Model />} />}
        <Route path="/users/projects/:id" element={<UserModel />} />
        <Route
          path="/comments/"
          element={<CommentSection parent_id="0" parent_Name="0" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
