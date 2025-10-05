import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import styles from "../../styles/Skill.module.css";

const ProfileSkills = ({ skills, error }) => {
  if (!skills || skills.length === 0) {
    return <p>Aucune compétence trouvée.</p>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.skillFrame}>
      <div className={`my-5 col-10 mx-auto`}>
        <h2 className={`mb-2 display-4 ${styles.titleH2}`}>Compétences</h2>
        <div className={styles.skillsContainer}>
          {skills.map((skill, index) => {
            // On récupère les images valides (url non vide)
            let images = Array.isArray(skill.skill?.images)
              ? skill.skill.images.filter(img => img.url && img.url.trim() !== "")
              : [];
            // Si aucune image valide, on met l'image par défaut
            if (images.length === 0) {
              images = [{ url: "/assets/defaultImgageCode.jpg" }];
            }

            const hasMultipleSlides = images.length > 1;

            return (
              <a
                key={skill.id || `${skill.name}-${index}`}
                href={`/skills/${skill.id || skill.name}`}
                className={styles.skillMedallionLink}
              >
                <div
                  className={styles.skillMedallion}
                  style={{
                    backgroundImage: `conic-gradient(rgba(101, 119, 253, 0.61) 0% ${skill.level}%, rgba(244, 237, 212, 0.75) ${skill.level}% 100%)`,
                  }}
                >
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    loop={hasMultipleSlides}
                    speed={5000}
                    autoplay={
                      hasMultipleSlides
                        ? { delay: 3000, disableOnInteraction: false }
                        : false
                    }
                    className={styles.skillSwiper}
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={img.url || "/assets/defaultImgageCode.jpg"}
                          alt={`${skill.skill.name} ${i}`}
                          loading="lazy"
                          className={styles.skillImage}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <p className={styles.skillName}>{skill.skill.name}</p>
                  <span className={styles.skillLevel}>{skill.level}%</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkills;
