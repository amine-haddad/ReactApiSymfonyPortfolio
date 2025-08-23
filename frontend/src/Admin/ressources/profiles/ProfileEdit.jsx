import React, { useMemo } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  SelectInput,
  NumberInput,
  ImageField,
  useEditController,
} from "react-admin";

function ProfileEdit(props) {
  const controllerProps = useEditController(props);
  const record = controllerProps.record;

  // Afficher un loader tant que les données ne sont pas prêtes
  if (!record || !record.profileSkills) {
    return <div>Chargement des données du profil...</div>;
  }

  // Filtrer les skills connus du profil pour les selects de projets
  const profileSkillsChoices = useMemo(() => {
    return record.profileSkills.map(ps => ({
      id: ps.skill.id,
      name: ps.skill.name,
      slug: ps.skill.slug,
    }));
  }, [record]);

  return (
    <Edit {...props} {...controllerProps}>
      <SimpleForm record={record}>
        <TextInput source="name" label="Nom" />
        <TextInput source="title" label="Titre" />
        <TextInput source="bio" label="Bio" multiline />
        <TextInput source="email" />
        <TextInput source="github_url" label="GitHub" />
        <TextInput source="linkedin_url" label="LinkedIn" />
        <TextInput source="slug" disabled label="Slug (généré automatiquement)" />

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

              {/* Technologies liées - filtrées sur les skills connus du profil */}
              <ArrayInput source="technologies" label="Technologies utilisées">
                <SimpleFormIterator>
                  <SelectInput source="id" label="Compétence" choices={profileSkillsChoices} optionText="name" optionValue="id" />
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

        {/* Compétences */}
        <ArrayInput source="profileSkills">
          <SimpleFormIterator>
            <SelectInput
              label="Compétence"
              source="skill.id"
              choices={profileSkillsChoices}
              optionText="name"
              optionValue="id"
            />
            <NumberInput source="level" label="Niveau" min={0} max={100} />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
}

export default ProfileEdit;