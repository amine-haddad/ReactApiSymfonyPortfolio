import React, { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  SelectInput,
  NumberInput,
  ImageField,
} from "react-admin";

const ProfileCreate = (props) => {
  const [profileSkills, setProfileSkills] = useState([]);

  // Met à jour le state à chaque modification des compétences du profil
  const handleProfileSkillsChange = (value) => {
    setProfileSkills(value || []);
  };

  // Génère les choix pour les projets à partir des skills sélectionnés
  const safeProfileSkills = Array.isArray(profileSkills) ? profileSkills : [];
  const profileSkillsChoices = safeProfileSkills
    .map((ps) => (ps?.skill && ps.skill.id ? { id: ps.skill.id, name: ps.skill.name } : null))
    .filter(Boolean);

  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" label="Nom" />
        <TextInput source="title" label="Titre" />
        <TextInput source="bio" label="Bio" multiline />
        <TextInput source="email" />
        <TextInput source="github_url" label="GitHub" />
        <TextInput source="linkedin_url" label="LinkedIn" />
        <TextInput source="slug" label="Slug (généré automatiquement)" />

        {/* Compétences (d'abord) */}
        <ArrayInput
          source="profileSkills"
          label="Compétences du profil"
          onChange={handleProfileSkillsChange}
        >
          <SimpleFormIterator>
            <ReferenceInput label="Compétence" source="skill.id" reference="skills" perPage={100}>
              <SelectInput optionText="name" />
            </ReferenceInput>
            <NumberInput source="level" label="Niveau" min={0} max={100} />
          </SimpleFormIterator>
        </ArrayInput>

        {/* Images du profil */}
        <ArrayInput source="images" label="Images du profil (photo/avatar, bannière, etc.)">
          <SimpleFormIterator>
            <TextInput source="name" label="Nom du fichier" />
            <ImageField source="url" label="Aperçu" />
          </SimpleFormIterator>
        </ArrayInput>

        {/* Projets */}
        <ArrayInput source="projects" label="Projets du profil">
          <SimpleFormIterator>
            <div style={{ border: "1px solid #c0c0c0", borderRadius: 8, padding: 16, marginBottom: 24, background: "#f8faff" }}>
              <h3 style={{ marginTop: 0, color: "#0076d7" }}>
                <TextInput source="title" label="Titre du projet" fullWidth />
              </h3>
              <TextInput source="description" label="Description" multiline fullWidth />
              <TextInput source="project_url" label="URL du projet" fullWidth />
              <TextInput source="image_url" label="Image principale (URL)" fullWidth />
              <TextInput source="slug" label="Slug" fullWidth />

              {/* Technologies liées - filtrées sur les skills du profil */}
              <ArrayInput source="technologies" label="Technologies utilisées">
                <SimpleFormIterator>
                  <SelectInput
                    source="id"
                    label="Compétence"
                    choices={profileSkillsChoices}
                    optionText="name"
                    optionValue="id"
                  />
                </SimpleFormIterator>
              </ArrayInput>

              {/* Images du projet */}
              <ArrayInput source="images" label="Images du projet">
                <SimpleFormIterator>
                  <TextInput source="name" label="Nom du fichier" />
                  <ImageField source="url" label="Aperçu" />
                </SimpleFormIterator>
              </ArrayInput>
            </div>
          </SimpleFormIterator>
        </ArrayInput>

        {/* Expériences */}
        <ArrayInput source="experiences">
          <SimpleFormIterator>
            <TextInput source="role" label="Poste" />
            <TextInput source="compagny" label="Entreprise" />
            <TextInput source="description" label="Description" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};

export default ProfileCreate;