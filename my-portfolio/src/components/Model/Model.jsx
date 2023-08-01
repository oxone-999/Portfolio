import React, { useEffect } from "react";
import Styles from "./Model.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageForm from "../imageForm/imageForm";

const apiUrl = import.meta.env.VITE_API_URL;

const Model = () => {
  const { id } = useParams();
  const [project, setProject] = React.useState({});
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);
  const [isEditingImages, setIsEditingImages] = React.useState(false);
  const [editedProjectData, setEditedProjectData] = React.useState({});
  const [isDelete, setIsDelete] = React.useState(false);
  const [imageId, setImageId] = React.useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/images/${id}`
        );
        setProject(response.data.project);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProject();
  }, [id]);

  const handlePreviewClick = () => {
    console.log("Preview clicked");
    window.location.href = `/users/projects/${id}`;
  };

  const handleImageDelete = async (e) => {
    e.preventDefault();
    setIsDelete(true);
    const image_Id = e.target.id;
    setImageId(image_Id);
    console.log(image_Id);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${apiUrl}/projects/${id}/images/${imageId}`
      );
      setProject(response.data.project);
      toast.success("Project deleted successfully", {
        autoClose: 1000,
      });
      setTimeout(() => {
        setIsDelete(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    convertToBase64(file)
      .then((base64Data) => {
        setEditedProjectData((prevState) => ({
          ...prevState,
          images: base64Data,
        }));
      })
      .catch((error) => {
        window.alert("Something went wrong!");
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProjectData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = (type) => {
    if (type === "title") {
      setIsEditingTitle(true);
    } else if (type === "description") {
      setIsEditingDescription(true);
    } else if (type === "images") {
      setIsEditingImages(true);
    }
    setEditedProjectData(project); // Pre-fill the form with the current project data
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    try {
      // Create an object to store only the modified fields
      const updatedData = {};

      // Check if title was edited and add it to updatedData
      if (type === "title") {
        if (editedProjectData.title !== project.title) {
          updatedData.title = editedProjectData.title;
        }
      }

      // Check if description was edited and add it to updatedData
      if (type === "description") {
        if (
          editedProjectData.projectDescription !== project.projectDescription
        ) {
          updatedData.projectDescription = editedProjectData.projectDescription;
        }
      }

      // Check if images were edited and add them to updatedData
      if (type === "images") {
        if (editedProjectData.images) {
          updatedData.images = editedProjectData.images;
        }
      }

      // Make the API call to update the project in the backend with updatedData
      if (Object.keys(updatedData).length > 0) {
        const response = await axios.put(
          `${apiUrl}/images/${id}`,
          updatedData
        );
        setProject(response.data.updatedProject);
        toast.success("Project updated successfully", {
          autoClose: 1000,
        });

        // Reset the form
        setIsEditingTitle(false);
        setIsEditingDescription(false);
        setIsEditingImages(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={Styles.model}>
      <ToastContainer />
      {isDelete && (
        <>
          <form className={Styles.deleteForm} onSubmit={handleDelete}>
            <h3>Are you sure you want to delete this project?</h3>
            <div className={Styles.deleteFormBtn}>
              <button
                className={Styles.cancelBtn}
                type="button"
                onClick={() => {
                  setIsDelete(false);
                }}
              >
                Cancel
              </button>
              <button className={Styles.deleteBtn} type="submit">
                Delete
              </button>
            </div>
          </form>
        </>
      )}
      {project && Object.keys(project).length > 0 && (
        <>
          {isEditingTitle ? (
            <form onSubmit={(e) => handleSubmit(e, "title")}>
              <input
                type="text"
                name="title"
                defaultValue={project.title}
                onChange={handleInputChange}
              />
              <button type="submit">Save</button>
            </form>
          ) : isEditingDescription ? (
            <form onSubmit={(e) => handleSubmit(e, "description")}>
              <textarea
                name="projectDescription"
                defaultValue={project.projectDescription}
                onChange={handleInputChange}
              />
              <button type="submit">Save</button>
            </form>
          ) : isEditingImages ? (
            <ImageForm
              setIsEditingImages={setIsEditingImages}
              project={project}
              handleImageChange={handleImageChange}
              handleImageDelete={handleImageDelete}
              handleSubmit={handleSubmit}
            />
          ) : (
            <>
              <div className={Styles.modelHeader}>
                <div className={Styles.btns}>
                  <button
                    className={Styles.previewBtn}
                    onClick={handlePreviewClick}
                  >
                    Preview
                  </button>
                  <button
                    className={Styles.editBtn}
                    onClick={() => handleEditClick("title")}
                  >
                    Edit
                  </button>
                </div>
                <div className={Styles.modelTitle}>
                  <h3>{project.title}</h3>
                </div>
              </div>
              <div className={Styles.description}>
                <button
                  className={Styles.editBtn}
                  onClick={() => handleEditClick("description")}
                >
                  Edit
                </button>
                <div className={Styles.projectDescription}>
                  <p>{project.projectDescription}</p>
                </div>
              </div>
              <div className={Styles.imageDiv}>
                <div>
                  <button
                    className={Styles.editBtn}
                    onClick={() => handleEditClick("images")}
                  >
                    Edit
                  </button>
                </div>
                <div className={Styles.corousal}>
                  {project.images.length ? (
                    project.images.map((image) => (
                      <div className={Styles.images} key={image._id}>
                        <img src={image.url} alt="project" />
                      </div>
                    ))
                  ) : (
                    <img src="/images/thumbnail.png" alt="project" />
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export default Model;
