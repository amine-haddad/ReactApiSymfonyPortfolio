import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import styles from "../../styles/ProfileCarousel.module.css"; // Import du fichier CSS

const ProfileCarousel = ({ profile, error }) => {
  return (
    <>
      {/* Carousel in the right side of the card */}
      <div className="col-md-6">
        <div
          id="profile-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className={`carousel-item active ${styles.carouselItem}`}>
              <a href="#projects">
                <img
                  src="/assets/cannon_old_weapon.svg"
                  className={styles.carousel}
                  alt="Projets"
                />
                <div className={`carousel-caption ${styles.carouselCaption}`}>
                  <h5>Projets</h5>
                </div>
              </a>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <a href="#experiences">
                <img
                  src="/assets/clavierFondBleuter.jpeg"
                  className={styles.carousel}
                  alt="Experiences"
                />
                <div className={`carousel-caption ${styles.carouselCaption}`}>
                  <h5>Expériences</h5>
                </div>
              </a>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <a href="#aboutme">
                <img
                  src="/assets/defaultImgageCode.jpg"
                  className={styles.carousel}
                  alt="About Me"
                />
                <div className={`carousel-caption ${styles.carouselCaption}`}>
                  <h5>About Me</h5>
                </div>
              </a>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#profile-carousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#profile-carousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileCarousel;
