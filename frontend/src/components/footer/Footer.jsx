import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import "../../styles/Footer.css";
import Button from "../ui/Button";

const Footer = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ email: "", message: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <footer
      className="mt-5 pt-5 pb-5 border-top"
      style={{
        backgroundColor: "var(--navbar-bg)",
        color: "var(--navbar-text)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container">
        <div className="row gy-5">
          {/* Formulaire de contact */}
          <div className="col-md-6">
            <h4 className="mb-3 text-center text-md-start">Contactez-moi</h4>
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
                  required
                  className="form-control"
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    color: "var(--navbar-text)",
                    borderColor: "var(--border-color)",
                  }}
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
                  rows="4"
                  required
                  className="form-control"
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    color: "var(--navbar-text)",
                    borderColor: "var(--border-color)",
                  }}
                ></textarea>
              </div>
              <Button type="submit"> Envoyer</Button>

            </form>
          </div>

          {/* Réseaux sociaux */}
          <div className="col-md-6 d-flex flex-column align-items-center align-items-md-start">
            <h4 className="mb-3 text-center text-md-start">Suivez-moi</h4>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start mb-4">
              <a href="https://github.com" className="textReset" aria-label="GitHub">
                <FaGithub size={30} />
              </a>
              <a href="https://linkedin.com" className="textReset" aria-label="LinkedIn">
                <FaLinkedin size={30} />
              </a>
              <a href="https://twitter.com" className="textReset" aria-label="Twitter">
                <FaTwitter size={30} />
              </a>
              <a href="mailto:youremail@example.com" className="textReset" aria-label="Email">
                <FaEnvelope size={30} />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-center text-md-start small" style={{ color: "var(--navbar-text)" }}>
              © {new Date().getFullYear()} TonNom. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
