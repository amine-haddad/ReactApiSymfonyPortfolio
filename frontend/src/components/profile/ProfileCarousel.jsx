import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import styles from "../../styles/ProfileCarousel.module.css";

const ProfileCarousel = ({ profile, error }) => {
  if (error) {
    return <p>Une erreur est survenue : {error}</p>;
  }
  if (!profile || !profile.images || profile.images.length === 0) {
    return <p>Aucune image à afficher.</p>;
  }

  const hasMultipleImages = profile.images.length > 1;

  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoHeight={false}
        loop={hasMultipleImages}
        autoplay={
          hasMultipleImages
            ? {
              delay: 3000,
              disableOnInteraction: false,
            }
            : false
        }
        speed={1200}
        navigation={hasMultipleImages}
        className={styles.carouselContainer}
      >
        {profile.images.map((img, index) => (
          <SwiperSlide key={img.id || index}>
            <img
              src={img.name}
              alt={`Profile image ${index + 1}`}
              className={styles.carouselImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProfileCarousel;
