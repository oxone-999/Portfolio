import React from "react";
import Styles from "./AddPopup.module.css";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const AddPopup = ({ setIsFormOpen }) => {
  const [title, setTitle] = React.useState("Sample Title");
  const [description, setDescription] = React.useState("Sample Description");
  const [disabled, setDisabled] = React.useState(false);

  const handleDescription = (e) => {
    console.log(e.target.value);
    setDescription(e.target.value);
  };

  const handleTitle = (e) => {
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  const closePopup = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    try {
      const response = await fetch(`http://localhost:5000/api/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });
      const data = await response.data;
      console.log(data);

      if (response.ok) {
        toast.success("Project added successfully", {
          autoClose: 1000,
        }); // Success notification
        setIsFormOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Failed to add project"); // Error notification
      }
      setDisabled(false);
    } catch (error) {
      toast.error("Failed to add project"); // Error notification
      console.log(error);
    }
  };

  return (
    <>
      <div className={Styles.popup_overlay}>
        <div className={Styles.popup_form}>
          <div className={Styles.popup_container}>
            <div className={Styles.form}>
              <div className={Styles.form_secondary}>
                <div className={Styles.form_main}>Add Project</div>
                <div className={Styles.mbsc_form_group}>
                  <div className={Styles.mbsc_form_group_title}>
                    Project Title
                  </div>
                  <input
                    name="title"
                    placeholder="Enter your project title"
                    onChange={handleTitle}
                  />
                </div>
                <div className={Styles.mbsc_form_group}>
                  <div className={Styles.mbsc_form_group_title}>
                    Description
                  </div>
                  <input
                    name="description"
                    placeholder="Enter your project description"
                    onChange={handleDescription}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.button}>
            <Button variant="contained" color="error" onClick={closePopup}>
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={disabled}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

AddPopup.propTypes = {
  setIsFormOpen: PropTypes.func,
};

export default AddPopup;
