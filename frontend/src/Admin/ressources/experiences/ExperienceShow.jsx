import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  DateField
} from "react-admin";

const ExperienceShow = (props) => (
  <Show {...props} title="Détail de l'expérience">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="role" label="Rôle" />
      <TextField source="compagny" label="Entreprise" />
      <DateField source="startDate" label="Début" />
      <DateField source="endDate" label="Fin" />
      <TextField source="description" label="Description" />
      <TextField source="slug" label="Slug" />
      <ReferenceField source="profile.id" reference="profiles" label="Profil">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" label="Créé le" />
      <DateField source="updated_at" label="Modifié le" />
    </SimpleShowLayout>
  </Show>
);
export default ExperienceShow;