import Styles from "./ImageForm.module.css";
import propType from "prop-types";
import React from 'react';
import axios from 'axios';

const ImageForm = ({
  setIsEditingImages,
  project,
  handleImageDelete,
  handleImageChange,
  handleSubmit,
}) => {
  const [name,setName] = React.useState("");
  const [ProjectDescription,SetDescription] = React.useState("");

  // const handleSubmit = async () => {
  //   const response = await axios.put(`${apiUrl}/images/${id}`, updatedData);
  //   console.log(response);
  // }

  return (
    <>
      <form
        className={Styles.imagesForm}
        onSubmit={(e) => handleSubmit(e, "images")}
      >
        <div className={Styles.formDiv}>
          <div className={Styles.imagesInput}>
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div>
            {/* <input type='text' />
            <textarea onChange={handleSubmit} /> */}
          </div>
          <div className={Styles.editCorousal}>
            {project.images.length &&
              project.images.map((image) => (
                <div className={Styles.editImages} key={image._id}>
                  <img
                    src={image.url}
                    alt="project"
                    id={image._id}
                    onClick={handleImageDelete}
                  />
                </div>
              ))}
          </div>
          <div className={Styles.btn}>
            <button
            className={Styles.cancelBtn}
                type="submit"
                onClick={() => {
                setIsEditingImages(false);
                }}
            >
                Cancel
            </button>
            <button className={Styles.saveBtn} type="submit">Save</button>
          </div>
        </div>
      </form>
    </>
  );
};

ImageForm.propTypes = {
  setIsEditingImages: propType.func.isRequired,
  project: propType.object.isRequired,
  handleImageDelete: propType.func.isRequired,
  handleImageChange: propType.func.isRequired,
  handleSubmit: propType.func.isRequired,
};

export default ImageForm;
