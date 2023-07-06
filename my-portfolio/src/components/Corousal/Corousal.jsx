import Styles from "./Corousal.module.css";

function Corousal() {
  return (
    <>
      <div className={Styles.gallery}>
        <div className={Styles.gallery__item}>
          <img
            src="https://picsum.photos/200/300"
            alt="gallery"
            className={Styles.gallery__image}
          />
        </div>
        <div className={Styles.gallery__item}>
          <img
            src="https://picsum.photos/200/300"
            alt="gallery"
            className={Styles.gallery__image}
          />
        </div>
        <div className={Styles.gallery__item}>
          <img
            src="https://picsum.photos/200/300"
            alt="gallery"
            className={Styles.gallery__image}
          />
        </div>
        <div className={Styles.gallery__item}>
          <img
            src="https://picsum.photos/200/300"
            alt="gallery"
            className={Styles.gallery__image}
          />
        </div>
        <div className={Styles.gallery__item}>
          <img
            src="https://picsum.photos/200/300"
            alt="gallery"
            className={Styles.gallery__image}
          />
        </div>
      </div>
    </>
  );
}

export default Corousal;
