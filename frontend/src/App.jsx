import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/Router";  // Remplacer Router par AppRouter
import Footer from "./components/Footer";
import axios from "axios";
import './styles/CustomNavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Profile.css';

function App() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/profiles/1?expand=skills,experiences,projects`,
        {
          headers: {
            Accept: "application/ld+json",
          },
        }
      )
      .then((response) => {
        setProfile(response.data);
      })
      .catch(() => {
        setError("Error fetching user profile");
      });
  }, []);

  return (
    <BrowserRouter>
      {/* Passons profile et error à AppRouter */}
      <AppRouter profile={profile} error={error} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
