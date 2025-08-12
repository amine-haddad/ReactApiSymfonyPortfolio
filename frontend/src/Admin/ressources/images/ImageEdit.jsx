import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  required
} from "react-admin";

const ImageEdit = (props) => (
  <Edit {...props} title="Modifier une image">
    <SimpleForm>
      <TextInput source="name" label="Nom" validate={required()} fullWidth />
      <ReferenceInput source="profile.id" reference="profiles" label="Profil">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="project.id" reference="projects" label="Projet">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput source="experiences.id" reference="experiences" label="Expérience">
        <SelectInput optionText="role" />
      </ReferenceInput>
      <ReferenceInput source="skills.id" reference="skills" label="Compétence">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default ImageEdit;