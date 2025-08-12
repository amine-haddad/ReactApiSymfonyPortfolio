import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  ArrayField,
  SingleFieldList,
  ChipField,
  ImageField,
} from "react-admin";

const ProfileShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" label="Nom" />
      <TextField source="title" label="Titre" />
      <TextField source="bio" label="Bio" />
      <EmailField source="email" />
      <TextField source="github_url" label="GitHub" />
      <TextField source="linkedin_url" label="LinkedIn" />
      <TextField source="slug" />
      <DateField source="creeLe" label="Créé le" />
      <DateField source="modifieLe" label="Modifié le" />

      {/* Projets liés */}
      <ArrayField source="projects">
        <SingleFieldList>
          <ChipField source="title" />
        </SingleFieldList>
      </ArrayField>

      {/* Expériences liées */}
      <ArrayField source="experiences">
        <SingleFieldList>
          <ChipField source="title" />
        </SingleFieldList>
      </ArrayField>

      {/* Images liées */}
      <ArrayField source="images">
        <SingleFieldList>
          <ImageField source="url" title="alt" />
        </SingleFieldList>
      </ArrayField>

      {/* Compétences liées */}
      <ArrayField source="profileSkills">
        <SingleFieldList>
          <ChipField source="skill.name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default ProfileShow;