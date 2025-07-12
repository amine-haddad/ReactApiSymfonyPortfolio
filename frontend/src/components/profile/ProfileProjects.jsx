import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import '../../styles/SwiperOverrides.css';
import styles from "../../styles/Project.module.css";

const ProfileProjects = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className={`container-fluid ${styles["sectionProject"]}`}>
      <h2 className={`text-center mb-2 col-10 mx-auto ${styles["titleH2"]} display-1`}>
        Projects
      </h2>
      <div className={styles["carouselWrapper"]}>
        {projects.map((project, index) => {
          const slides = project.images && project.images.length > 0 ? project.images : ["/assets/defaultImgageCode.jpg"];
          const hasMultipleSlides = slides.length > 1;

          return (
            <div
              key={index}
              className={`card ${styles["projectCard"]} col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2`}
            >
              {/* SWIPER pour images du projet */}
              <Swiper
                modules={[Autoplay, Navigation, EffectFade]}
                loop={hasMultipleSlides}
                autoplay={hasMultipleSlides ? { delay: 3000, disableOnInteraction: false } : false}
                navigation={hasMultipleSlides}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={4000} // transition douce
                spaceBetween={10}
                slidesPerView={1}
                className={styles["projectSwiper"]}
              >
                {slides.map((image, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={image.name || image}
                      alt={`${project.title} image ${i}`}
                      className={`card-img-top ${styles["projectImgTop"]}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Corps de la carte */}
              <div className={`card-body ${styles["projectBody"]}`}>
                <h5 className={`card-title ${styles["projectTitle"]}`}>{project.title}</h5>
                <p className={`card-text ${styles["projectText"]}`}>{project.description}</p>

                {project.technologies?.length > 0 && (
                  <div className={`mb-3 card-footer ${styles["projectFooter"]}`}>
                    <strong>Technologies :</strong>
                    <div className="d-flex flex-wrap gap-1">
                      {project.technologies.map((techno, i) => (
                        <span key={i} className="badge bg-primary text-xs">
                          {techno.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-100"
                  >
                    Voir le projet
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileProjects;
