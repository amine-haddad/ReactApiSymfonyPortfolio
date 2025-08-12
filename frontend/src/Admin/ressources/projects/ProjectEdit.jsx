import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  ImageField,
  required
} from "react-admin";

const ProjectEdit = (props) => (
  <Edit {...props} title="Modifier un projet">
    <SimpleForm>
      <TextInput source="title" label="Titre" validate={required()} fullWidth />
      <TextInput source="slug" label="Slug" validate={required()} fullWidth />
      <TextInput source="description" label="Description" multiline fullWidth />
      <TextInput source="project_url" label="URL Projet" fullWidth />
      <ReferenceInput source="profile.id" reference="profiles" label="Profil">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceArrayInput
        source="technologyIds"
        reference="skills"
        label="Technologies"
        filter={{ "profileSkills.profile.id": props.record?.profile?.id }}
      >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ArrayInput source="images" label="Images">
        <SimpleFormIterator>
          <TextInput source="url" label="URL de l'image" fullWidth />
          <ImageField source="url" title="name" label="Aperçu" />
        </SimpleFormIterator>
      </ArrayInput>
      {/* Les champs de date sont retirés car ils sont gérés automatiquement */}
    </SimpleForm>
  </Edit>
);

export default ProjectEdit;