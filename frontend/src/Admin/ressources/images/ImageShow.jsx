import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField
} from "react-admin";

const ImageShow = (props) => (
  <Show {...props} title="Détail de l'image">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <ReferenceField source="profile.id" reference="profiles" label="Profil">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="project.id" reference="projects" label="Projet">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="experiences.id" reference="experiences" label="Expérience">
        <TextField source="role" />
      </ReferenceField>
      <ReferenceField source="skills.id" reference="skills" label="Compétence">
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);

export default ImageShow;