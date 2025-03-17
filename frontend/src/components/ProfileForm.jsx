import React, { useState } from "react";
import axios from "axios";

const ProfileForm = ({ onSuccess }) => {
  const [newProfile, setNewProfile] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    github_url: "",
    linkedin_url: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNewProfile({
      ...newProfile,
      [e.target.name]:
        e.target.name === "skills" ? e.target.value.split(",") : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users",
        newProfile,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      onSuccess(response.data.id, newProfile);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Error creating user profile");
    }
  };

  return (
    <div className="form-container">
      {error && <div className="error">{error}</div>}
      <h2>Create New Profile</h2>
      <form onSubmit={handleSubmit}>
        {[
          "name",
          "title",
          "bio",
          "email",
          "phone",
          "github_url",
          "linkedin_url",
          "skills",
        ].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              id={field}
              name={field}
              value={newProfile[field] || ""}
              onChange={handleChange}
              placeholder={field.replace("_", " ").toUpperCase()}
              required={
                field !== "phone" &&
                field !== "github_url" &&
                field !== "linkedin_url" &&
                field !== "skills"
              }
            />
          </div>
        ))}
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
