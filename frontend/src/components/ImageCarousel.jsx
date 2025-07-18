// components/common/ImageCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Lazy, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageCarousel = ({
  images = [],
  effect = "fade",
  speed = 3000,
  autoplayDelay = 3000,
  navigation = false,
  pagination = false,
  className = ""
}) => {
  const hasMultipleSlides = images.length > 1;

  return (
    <Swiper
      modules={[Autoplay, EffectFade, Navigation, Pagination]}
      lazy={true}
      effect={effect}
      fadeEffect={{ crossFade: true }}
      loop={hasMultipleSlides}
      speed={speed}
      autoplay={hasMultipleSlides ? { delay: autoplayDelay, disableOnInteraction: false } : false}
      navigation={navigation && hasMultipleSlides}
      pagination={pagination && hasMultipleSlides ? { clickable: true } : false}
      className={className}
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={img.name || img.url || img || "/assets/defaultImgageCode.jpg"}
            alt={`Slide ${index}`}
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
