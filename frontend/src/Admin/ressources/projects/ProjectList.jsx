import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  EditButton,
  ShowButton,
  DeleteButton,
  useGetIdentity,
  useListContext,
  TextInput,
  ImageField,
  ArrayField,
  SingleFieldList
} from "react-admin";
const projectFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

const CustomDatagrid = () => {
  const { data } = useListContext();
  const { identity } = useGetIdentity();

  if (!data || !identity) return null;

  const isAdmin = identity?.roles?.includes("ROLE_ADMIN");

  const myProjects = data.filter(
    project => project.profile && project.profile.user === identity.id
  );
  const otherProjects = data.filter(
    project => !project.profile || project.profile.user !== identity.id
  );

  return (
    <>
      <h3>Mes projets</h3>
      <Datagrid data={myProjects} rowClick="show">
        <TextField source="id" />
        <TextField source="title" label="Titre" />
        <TextField source="slug" label="Slug" />
        <TextField source="description" label="Description" />
        <TextField source="project_url" label="URL Projet" />
        <ArrayField source="images" label="Images">
          <SingleFieldList>
            <ImageField source="url" title="name" />
          </SingleFieldList>
        </ArrayField>
        <TextField source="profile.name" label="Profil" />
        <DateField source="created_at" label="Créé le" />
        <DateField source="updated_at" label="Modifié le" />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
      {isAdmin && (
        <>
          <h3>Autres projets</h3>
          <Datagrid data={otherProjects} rowClick="show">
            <TextField source="id" />
            <TextField source="title" label="Titre" />
            <TextField source="slug" label="Slug" />
            <TextField source="description" label="Description" />
            <TextField source="project_url" label="URL Projet" />
            <ArrayField source="images" label="Images">
              <SingleFieldList>
                <ImageField source="url" title="name" />
              </SingleFieldList>
            </ArrayField>
            <TextField source="profile.name" label="Profil" />
            <DateField source="created_at" label="Créé le" />
            <DateField source="updated_at" label="Modifié le" />
            <EditButton />
            <ShowButton />
            <DeleteButton />
          </Datagrid>
        </>
      )}
    </>
  );
};

const ProjectList = (props) => (
  <List {...props} filters={projectFilters}>
    <CustomDatagrid />
  </List>
);

export default ProjectList;