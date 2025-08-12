import React from "react";
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
} from "react-admin";

const ProfileEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" label="Nom" />
      <TextInput source="title" label="Titre" />
      <TextInput source="bio" label="Bio" multiline />
      <TextInput source="email" />
      <TextInput source="github_url" label="GitHub" />
      <TextInput source="linkedin_url" label="LinkedIn" />
      <TextInput source="slug" />

      {/* Projets */}
      <ArrayInput source="projects">
        <SimpleFormIterator>
          <TextInput source="title" label="Titre du projet" />
          <TextInput source="description" label="Description" />
          <TextInput source="project_url" label="URL" />
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

      {/* Images */}
      <ArrayInput source="images">
        <SimpleFormIterator>
          <TextInput source="name" label="Nom du fichier" />
          <ImageField source="url" label="Aperçu" />
        </SimpleFormIterator>
      </ArrayInput>

      {/* Compétences */}
      <ArrayInput source="profileSkills">
        <SimpleFormIterator>
          <TextInput source="skill.name" label="Nom de la compétence" disabled />
          <NumberInput source="level" label="Niveau" min={0} max={100} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export default ProfileEdit;