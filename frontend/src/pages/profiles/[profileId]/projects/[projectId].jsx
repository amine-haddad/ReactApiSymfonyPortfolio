// src/pages/profiles/[profileId]/projects/[projectId].jsx
import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import useProfiles from "../../../../hooks/useProfiles";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import DynamicShapes from "../../../../components/DynamicShapes";
import styles from "../../../../styles/ProjectDetail.module.css";

const ProjectDetail = () => {
  const { profileId, projectId } = useParams();
  const { user } = useContext(AuthContext);
  const { profiles, loading, error } = useProfiles({ mine: !!user });

  if (loading) return <div className={styles.spinner}></div>;
  if (error) return <p className={styles.error}>{error}</p>;

  // Trouve le profil courant
  const profile = profiles.find((p) => String(p.id) === String(profileId));
  if (!profile) return <p className={styles.notFound}>Profil introuvable.</p>;

  // Trouve le projet dans le profil
  const project = profile.projects?.find((p) => String(p.id) === String(projectId));
  if (!project) return <p className={styles.notFound}>Projet introuvable.</p>;

  // Fonction utilitaire pour formater la date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Non renseignée";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const imageUrl = project.image || "/assets/clavierFondBleuter.jpeg";
  const hasMultipleSlides = project.images?.length > 1;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dynamicBackground}>
        <DynamicShapes />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>{project.title}</h1>

          {project.images?.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop={hasMultipleSlides}
              autoplay={
                hasMultipleSlides ? { delay: 3000, disableOnInteraction: false } : false
              }
              navigation={hasMultipleSlides}
              pagination={{ clickable: true }}
              style={{ borderRadius: "12px", marginBottom: "1rem" }}
            >
              {project.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.name}
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
            <span className={styles.label}>Description :</span> {project.description}
          </p>

          <p className={styles.meta}>
            <span className={styles.label}>Date :</span> {formatDate(project.created_at) || "Non renseignée"}
          </p>

          <p className={styles.meta}>
            <span className={styles.label}>Technologies :</span>{" "}
            {project.technologies?.map(t => t.name).join(", ") || "Non renseignées"}
          </p>

          <Link to={`/profiles/${profileId}/projects`} className={styles.backLink}>
            ← Retour aux projets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
