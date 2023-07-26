import React from "react";
import Styles from "./Copy.module.css";
import PropTypes from "prop-types";
import CopyIcon from "../Svgs/CopyIcon";
import { CopyToClipboard } from "react-copy-to-clipboard";

function CopyLink({ showModal, shareUrl, setShowModal }) {
  const modalRef = React.useRef(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modalRef, setShowModal]);

  return (
    <div>
      {showModal && (
        <div className={Styles.modalContainer}>
          <div ref={modalRef} className={Styles.modalContent}>
            <div>
              <p
                style={{
                  backgroundColor: "#e5e5e5",
                  borderRadius: "0.5rem",
                  padding: "10px",
                }}
              >
                {shareUrl}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <CopyToClipboard text={shareUrl} onCopy={() => setCopied(true)}>
                <button className={Styles.Btn}>
                  <span className={Styles.text}>Copy</span>
                  {copied ? (
                    <span className={Styles.svgIcon}>
                      <img
                        style={{
                          width: "12px",
                        }}
                        src="/images/tick2.png"
                        alt="check"
                      />
                    </span>
                  ) : (
                    <span className={Styles.svgIcon}>
                      <CopyIcon />
                    </span>
                  )}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CopyLink.propTypes = {
  showModal: PropTypes.bool.isRequired,
  shareUrl: PropTypes.string.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default CopyLink;
