import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Styles from "./ProjectDescription.module.css";

const apiUrl = import.meta.env.VITE_API_URL;

const ProjectDescription = ({ id, project }) => {
  const [formData, setFormData] = React.useState({
    companyName: "",
    role: "",
    points: "",
    skills: "",
  });

  const handleChange = (e, field) => {
    const { value } = e.target;
    const updatedData = { ...formData };

    updatedData[field] = value;

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formData", formData);

    try {
      const response = await axios.post(
        `${apiUrl}/projects/work/${id}`,
        formData
      );
      console.log("response", response);
    } catch (error) {
      console.error(error);
    }

    setFormData({
      companyName: "",
      role: "",
      points: "",
      skills: "",
    });

    window.location.reload();
  };

  React.useEffect(() => {
    setFormData(project.projectDescription);
    console.log("po",project.projectDescription)
  },[project]);

  return (
    <form className={Styles.main}>
      <label>
        Company Name:
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={(e) => handleChange(e, "companyName")}
        />
      </label>

      <label>
        Role:
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={(e) => handleChange(e, "role")}
        />
      </label>

      <label>
        Work Experience Points:
        <textarea
          type="text"
          value={formData.points}
          onChange={(e) => handleChange(e, "points")}
        />
      </label>

      <label>
        Skills:
        <input
          type="text"
          value={formData.skills}
          onChange={(e) => handleChange(e, "skills")}
        />
      </label>

      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
};

ProjectDescription.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  project: PropTypes.object.isRequired,
};

export default ProjectDescription;
