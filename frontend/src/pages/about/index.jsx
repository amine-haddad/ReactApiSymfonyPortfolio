import PageLayout from "../../layouts/PageLayout";
import styles from "../../styles/ProfileAbout.module.css";

const aboutData = {
  company: "PortfolioHub",
  slogan: "Votre vitrine professionnelle en ligne",
  description: `PortfolioHub est une plateforme moderne permettant à chacun de créer, gérer et partager son portfolio professionnel en toute simplicité. 
Notre mission est de valoriser vos compétences, projets et expériences auprès de vos futurs employeurs ou clients.`,
  creator: {
    name: "Amine B.",
    email: "contact@portfoliohub.com",
    linkedin: "https://www.linkedin.com/in/amineb",
    github: "https://github.com/amineb",
  },
  references: [
    { name: "GitHub", url: "https://github.com/portfoliohub" },
    { name: "Documentation", url: "https://portfoliohub.com/docs" },
    { name: "Contact", url: "mailto:contact@portfoliohub.com" },
  ],
  location: "Paris, France",
  copyright: "© 2025 PortfolioHub",
};

const AboutPortfoliHub = () => (
  <PageLayout>
    <div className={styles.container}>
      <h1 className={styles.title}>À propos de {aboutData.company}</h1>
      <p className={styles.aboutSection}><em>{aboutData.slogan}</em></p>
      <div className={styles.aboutSection}>
        <p>{aboutData.description}</p>
        <p><strong>Localisation :</strong> {aboutData.location}</p>
        <p><strong>Créateur :</strong> {aboutData.creator.name}</p>
        <p><strong>Email :</strong> <a href={`mailto:${aboutData.creator.email}`}>{aboutData.creator.email}</a></p>
        <p>
          <strong>Liens :</strong>{" "}
          <a href={aboutData.creator.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> |{" "}
          <a href={aboutData.creator.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
        <div>
          <strong>Références :</strong>
          <ul>
            {aboutData.references.map(ref => (
              <li key={ref.name}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
        {aboutData.copyright}
      </p>
    </div>
  </PageLayout>
);

export default AboutPortfoliHub;