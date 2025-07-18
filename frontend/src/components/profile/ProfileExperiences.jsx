import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import styles from "../../styles/Experience.module.css";

const ProfileExperience = ({ experiences, error }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <section className={styles.experienceSection}>
        <h2 className={styles.title}>Expériences</h2>
        <p>Aucune expérience trouvée.</p>
      </section>
    );
  }

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <section className={`${styles.experienceSection} my-5 col-10`}>
      <h2 className={`mb-4 display-4 ${styles.title}`}>Expériences</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={` ${styles.cardContainer} `}>
        {experiences.map((experience, index) => {
          const slides = experience.images?.length > 0 ? experience.images : [{ name: "/assets/defaultImgageCode.jpg" }];
          const hasMultipleSlides = slides.length > 1;

          return (
            <div className={styles.card} key={experience.id || index}>
              <div className={styles.imageCircle}>
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  loop={hasMultipleSlides}
                  speed={2500}
                  autoplay={hasMultipleSlides ? { delay: 3000, disableOnInteraction: false } : false}
                  //navigation={hasMultipleSlides}
                  className={styles.swiper}
                >
                  {slides.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img.name || img.url || "/assets/defaultImgageCode.jpg"}
                        alt={`Expérience ${i}`}
                        loading="lazy"
                        className={styles.image}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className={styles.cardContent}>
                <h3>{experience.compagny}</h3>
                <p className={styles.role}>{experience.role}</p>
                <p className={styles.date}>
                  {formatDate(experience.startDate)} — {formatDate(experience.endDate)}
                </p>
                <p className={styles.description}>{experience.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProfileExperience;
