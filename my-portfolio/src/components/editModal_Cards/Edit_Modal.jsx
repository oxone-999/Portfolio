import React from "react";
import Styles from "./edit_Modal.module.css";
import PropTypes from "prop-types";

function Edit_Modal({
  setEditModal,
  editModal,
  editProjectId,
  projectId,
  handleThumbnailChange,
  handleThumbnail,
  previewThumbnail,
}) {
  const handleClose = () => {
    setEditModal(false);
  };

  return (
    <>
      {editModal && editProjectId === projectId && (
        <div className={Styles.modalContainer}>
          <div className={Styles.modalContent}>
            <div className={Styles.closeBtn} onClick={handleClose}>
              X
            </div>
            <form onSubmit={handleThumbnail}>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              <img src={previewThumbnail} alt="preview" />
              <button className={Styles.update} type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

Edit_Modal.propTypes = {
  setEditModal: PropTypes.func.isRequired,
  editModal: PropTypes.bool.isRequired,
  editProjectId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  handleThumbnailChange: PropTypes.func.isRequired,
  handleThumbnail: PropTypes.func.isRequired,
  previewThumbnail: PropTypes.string.isRequired,
};

export default Edit_Modal;
