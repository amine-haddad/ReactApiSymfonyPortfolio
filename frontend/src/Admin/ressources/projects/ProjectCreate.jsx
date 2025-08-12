import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  required
} from "react-admin";

const ProjectCreate = (props) => (
  <Create {...props} title="Créer un projet">
    <SimpleForm>
      <TextInput source="title" label="Titre" validate={required()} fullWidth />
      <TextInput source="slug" label="Slug" validate={required()} fullWidth />
      <TextInput source="description" label="Description" multiline fullWidth />
      <TextInput source="project_url" label="URL Projet" fullWidth />
      <TextInput source="image_url" label="URL Image" fullWidth />
      <ReferenceInput source="profile.id" reference="profiles" label="Profil" validate={required()}>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ArrayInput source="technologies" label="Technologies">
        <SimpleFormIterator>
          <ReferenceInput source="id" reference="skills" label="Compétence">
            <SelectInput optionText="name" />
          </ReferenceInput>
        </SimpleFormIterator>
      </ArrayInput>
      <DateInput source="created_at" label="Créé le" />
      <DateInput source="updated_at" label="Modifié le" />
    </SimpleForm>
  </Create>
);

export default ProjectCreate;