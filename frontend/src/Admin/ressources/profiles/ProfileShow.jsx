import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  ArrayField,
  Datagrid,
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

      {/* Projets liés avec détails */}
      <ArrayField source="projects" label="Projets">
        <Datagrid bulkActionButtons={false}>
          <TextField source="title" label="Titre" />
          <TextField source="description" label="Description" />
          <TextField source="project_url" label="URL" />
          <TextField source="slug" label="Slug" />
          {/* Images du projet */}
          <ArrayField source="images" label="Images">
            <Datagrid bulkActionButtons={false}>
              <ImageField source="url" label="Aperçu" />
              <TextField source="name" label="Nom du fichier" />
            </Datagrid>
          </ArrayField>
          {/* Technologies du projet */}
          <ArrayField source="technologies" label="Technologies">
            <Datagrid bulkActionButtons={false}>
              <TextField source="name" label="Nom" />
              <TextField source="slug" label="Slug" />
            </Datagrid>
          </ArrayField>
        </Datagrid>
      </ArrayField>

      {/* Expériences liées avec détails */}
      <ArrayField source="experiences" label="Expériences">
        <Datagrid bulkActionButtons={false}>
          <TextField source="role" label="Poste" />
          <TextField source="compagny" label="Entreprise" />
          <TextField source="description" label="Description" />
        </Datagrid>
      </ArrayField>

      {/* Images du profil */}
      <ArrayField source="images" label="Images du profil">
        <Datagrid bulkActionButtons={false}>
          <ImageField source="url" label="Aperçu" />
          <TextField source="name" label="Nom du fichier" />
        </Datagrid>
      </ArrayField>

      {/* Compétences liées avec niveau */}
      <ArrayField source="profileSkills" label="Compétences">
        <Datagrid bulkActionButtons={false}>
          <TextField source="skill.name" label="Compétence" />
          <TextField source="level" label="Niveau" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default ProfileShow;