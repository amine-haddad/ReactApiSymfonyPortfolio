import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import "../../styles/Footer.css";

const Footer = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour envoyer l'email ou traiter les données
    setFormData({ email: "", message: "" }); // Réinitialiser les champs du formulaire
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <footer className="footer-section p-4 ">
      <div className="container">
        <div className="row">
          {/* Formulaire de Contact */}
          <div className="col-md-6">
            <h4 className="title-footer-h4">Contactez-moi</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Envoyer
              </button>
            </form>
          </div>

          {/* Liens vers les Réseaux Sociaux */}
          <div className="col-md-6">
            <h4 className="title-footer-h4">Suivez-moi</h4>
            <div className="d-flex">
              <a href="https://github.com" className=" me-3">
                <FaGithub size={30} />
              </a>
              <a href="https://www.linkedin.com" className=" me-3">
                <FaLinkedin size={30} />
              </a>
              <a href="https://twitter.com" className="me-3">
                <FaTwitter size={30} />
              </a>
              <a
                href="mailto:youremail@example.com"
                className="me-3"
              >
                <FaEnvelope size={30} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
