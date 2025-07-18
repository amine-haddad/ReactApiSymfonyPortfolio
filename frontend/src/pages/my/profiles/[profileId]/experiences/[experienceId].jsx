import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../../contexts/AuthContext";
import useProfiles from "../../../../../hooks/useProfiles";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import styles from "../../../../../styles/ExperienceId.module.css";
import PageLayout from "../../../../../layouts/PageLayout";
import Spinner from "../../../../../components/Spinner";

const ExperienceId = () => {
  const { profileId, experienceId } = useParams();
  const { user } = useContext(AuthContext);

  // Choix du mode selon connexion
  const { profiles, loading, error } = useProfiles({ mine: !!user });

  if (loading) return <div className={styles.container}><Spinner /></div>;
  if (error) return <p className={styles.error}>{error}</p>;

  // Trouve le profil courant
  const profile = profiles.find((p) => String(p.id) === String(profileId));
  if (!profile) return <p className={styles.notFound}>Profil introuvable.</p>;

  // Trouve l'expérience dans le profil
  const experience = profile.experiences?.find((e) => String(e.id) === String(experienceId));
  if (!experience) return <p className={styles.notFound}>Expérience introuvable.</p>;

  const imageUrl = experience.images?.[0]?.url || "/assets/defaultImgageCode.jpg";
  const formatDate = (dateStr) => {
    if (!dateStr) return "Date non renseignée";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  };
  const hasMultipleSlides = experience.images?.length > 1;

  return (
    <PageLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>{experience.role || "Titre non renseigné"}</h1>
        {experience.images?.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            loop={hasMultipleSlides}
            autoplay={hasMultipleSlides ? { delay: 3000, disableOnInteraction: false } : false}
            navigation={hasMultipleSlides}
            pagination={{ clickable: true }}
            style={{ borderRadius: "12px", marginBottom: "1rem" }}
          >
            {experience.images.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img.name || img.url || "/assets/defaultImgageCode.jpg"}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src="/assets/defaultImgageCode.jpg"
            alt="Image par défaut"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
          />
        )}
        <p className={styles.meta}>
          <span className={styles.label}>Employeur:</span> {experience.compagny || "Aucune entreprise fournie."}
        </p>
        <div className={styles.description}>
          <div className={styles.label}>Descriptif :</div>
          <p>{experience.description || "Aucune description fournie."}</p>
        </div>
        <p className={styles.meta}>
          <span className={styles.label}>Début :</span> {experience.startDate ? formatDate(experience.startDate) : "Date de début non renseignée"}
        </p>
        <p className={styles.meta}>
          <span className={styles.label}>Fin :</span>{" "}
          {experience.endDate ? formatDate(experience.endDate) : "En cours"}
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Link to={`/my/profiles/${profileId}/experiences`} className={styles.backLink}>
            ← Retour aux expériences
          </Link>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.backLink}
          >
            Voir l’image
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExperienceId;
