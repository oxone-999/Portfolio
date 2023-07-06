import React, { useRef } from "react";
import Styles from "./AddPopup.module.css";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPopup = ({ setIsFormOpen }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [selectedFile2, setSelectedFile2] = React.useState(null);
  const [title, setTitle] = React.useState("Sample Title");
  const [skills, setSkills] = React.useState("Sample Skills");
  const [github, setGithub] = React.useState("Sample Github");
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [previewUrl2, setPreviewUrl2] = React.useState(null);
  const [disabled, setDisabled] = React.useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];

    convertToBase64(file)
      .then((base64Data) => {
        setSelectedFile(base64Data);
        console.log(base64Data);
      })
      .catch((error) => {
        window.alert("Something went wrong!");
        console.error(error);
      });

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handlePreview = async (e) => {
    const file = e.target.files[0];

    convertToBase64(file)
      .then((base64Data) => {
        setSelectedFile2(base64Data);
        console.log(base64Data);
      })
      .catch((error) => {
        window.alert("Something went wrong!");
        console.error(error);
      });

    const url = URL.createObjectURL(file);
    setPreviewUrl2(url);
  };

  const handleTitle = (e) => {
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  const handleSkill = (e) => {
    console.log(e.target.value);
    setSkills(e.target.value);
  };

  const handleLink = (e) => {
    console.log(e.target.value);
    setGithub(e.target.value);
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
          skills,
          github,
          selectedFile,
          selectedFile2,
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
            <div className={Styles.Preview}>
              <div className={Styles.preview_secondary}>
                <div className={Styles.preview_main}>Preview</div>
                <div className={Styles.previewImage_container}>
                  <div className={Styles.preview_image}>
                    <img src={previewUrl2} alt="Preview" />
                  </div>
                  <input
                    ref={fileInputRef}
                    name="myFile"
                    type="file"
                    id="file-upload"
                    accept=".jpeg, .png, .jpg"
                    onChange={handlePreview}
                    style={{ display: "none" }}
                  />
                  <button
                    className={Styles.edit_btn}
                    onClick={handleButtonClick}
                  >
                    <img src="/images/edit.png" alt="Upload" />
                  </button>
                </div>
                <div className={Styles.preview_content}>
                  <div className={Styles.preview_title}>{title}</div>
                  <div className={Styles.preview_title}>{skills}</div>
                  <div className={Styles.preview_title}>{github}</div>
                </div>
              </div>
            </div>
            <div className={Styles.form}>
              <div className={Styles.form_secondary}>
                <div className={Styles.mbsc_form_group}>
                  <div className={Styles.mbsc_form_group_title}>
                    Project Title
                  </div>
                  <input
                    name="title"
                    placeholder="Enter title"
                    onChange={handleTitle}
                  />
                </div>
                <div className={Styles.mbsc_form_group}>
                  <div className={Styles.mbsc_form_group - title}>Skills</div>
                  <input
                    name="title"
                    placeholder="Enter title"
                    onChange={handleSkill}
                  />
                </div>
                <div className={Styles.mbsc_form_group}>
                  <div className={Styles.mbsc_form_group_title}>
                    Github Repo Link
                  </div>
                  <input
                    name="title"
                    placeholder="Enter title"
                    onChange={handleLink}
                  />
                </div>
                <div className={Styles.mbsc_form_group}>
                  <div className={Styles.mbsc_form_group_title}>
                    Upload Images
                  </div>
                  <input
                    name="myFile"
                    type="file"
                    label="Image"
                    id="file-upload"
                    accept=".jpeg, .png, .jpg"
                    onChange={handleFile}
                  />
                </div>
                <div className={Styles.preview_container}>
                  {selectedFile && (
                    <div className={Styles.images}>
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  )}
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

export default AddPopup;

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
