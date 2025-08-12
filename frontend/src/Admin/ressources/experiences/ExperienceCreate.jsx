import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateInput,
  required
} from "react-admin";

const ExperienceCreate = (props) => (
  <Create {...props} title="Créer une expérience">
    <SimpleForm>
      <TextInput source="role" label="Rôle" validate={required()} fullWidth />
      <TextInput source="compagny" label="Entreprise" validate={required()} fullWidth />
      <DateInput source="startDate" label="Date de début" validate={required()} />
      <DateInput source="endDate" label="Date de fin" validate={required()} />
      <TextInput source="description" label="Description" multiline fullWidth />
      <TextInput source="slug" label="Slug" validate={required()} fullWidth />
      <ReferenceInput source="profile.id" reference="profiles" label="Profil" validate={required()}>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <DateInput source="created_at" label="Créé le" />
      <DateInput source="updated_at" label="Modifié le" />
    </SimpleForm>
  </Create>
);

export default ExperienceCreate;