// src/components/ProfileSelector.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ProfileSelector = () => {
  const { profiles, activeProfile, setActiveProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = profiles.find(p => p.id === selectedId);
    if (!selected) return;

    setActiveProfile(selected); // ✅ met à jour le contexte
    navigate(`/profiles/${selected.id}`); // ✅ met à jour l'URL
  };

  return (
    <select value={activeProfile?.id || ""} onChange={handleChange}>
      {profiles.map(profile => (
        <option key={profile.id} value={profile.id}>
          {profile.name}
        </option>
      ))}
    </select>
  );
};

export default ProfileSelector;
