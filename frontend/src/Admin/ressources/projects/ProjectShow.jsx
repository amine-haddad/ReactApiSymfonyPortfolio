import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  ArrayField,
  SingleFieldList,
  ChipField,
  DateField,
  ImageField
} from "react-admin";

const ProjectShow = (props) => (
  <Show {...props} title="Détail du projet">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="title" label="Titre" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Description" />
      <TextField source="project_url" label="URL Projet" />

      <ReferenceField source="profile.id" reference="profiles" label="Profil">
        <TextField source="name" />
      </ReferenceField>
      <ArrayField source="technologies" label="Technologies">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <DateField source="created_at" label="Créé le" />
      <DateField source="updated_at" label="Modifié le" />

      <ArrayField source="images" label="Images">
        <SingleFieldList>
          <ImageField source="url" title="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default ProjectShow;