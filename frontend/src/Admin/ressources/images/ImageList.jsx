import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  ShowButton,
  DeleteButton,
  useGetIdentity,
  useListContext,
  TextInput
} from "react-admin";

const imageFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

const CustomDatagrid = () => {
  const { data } = useListContext();
  const { identity } = useGetIdentity();

  if (!data || !identity) return null;

  // On considère qu'une image peut être liée à un profil, projet, expérience ou skill
  // On affiche "mes images" si l'une des entités liées appartient à l'utilisateur connecté
  const isMine = (img) =>
    (img.profile && img.profile.user === identity.id) ||
    (img.project && img.project.profile && img.project.profile.user === identity.id) ||
    (img.experiences && img.experiences.profile && img.experiences.profile.user === identity.id) ||
    (img.skills && img.skills.profileSkills && img.skills.profileSkills.some(ps => ps.profile && ps.profile.user === identity.id));

  const myImages = data.filter(isMine);
  const otherImages = data.filter(img => !isMine(img));

  return (
    <>
      <h3>Mes images</h3>
      <Datagrid data={myImages} rowClick="show">
        <TextField source="id" />
        <TextField source="name" label="Nom" />
        <ReferenceField source="profile.id" reference="profiles" label="Profil" link="show">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="project.id" reference="projects" label="Projet" link="show">
          <TextField source="title" />
        </ReferenceField>
        <ReferenceField source="experiences.id" reference="experiences" label="Expérience" link="show">
          <TextField source="role" />
        </ReferenceField>
        <ReferenceField source="skills.id" reference="skills" label="Compétence" link="show">
          <TextField source="name" />
        </ReferenceField>
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
      <h3>Autres images</h3>
      <Datagrid data={otherImages} rowClick="show">
        <TextField source="id" />
        <TextField source="name" label="Nom" />
        <ReferenceField source="profile.id" reference="profiles" label="Profil" link="show">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="project.id" reference="projects" label="Projet" link="show">
          <TextField source="title" />
        </ReferenceField>
        <ReferenceField source="experiences.id" reference="experiences" label="Expérience" link="show">
          <TextField source="role" />
        </ReferenceField>
        <ReferenceField source="skills.id" reference="skills" label="Compétence" link="show">
          <TextField source="name" />
        </ReferenceField>
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
    </>
  );
};

const ImageList = (props) => (
  <List {...props} filters={imageFilters}>
    <CustomDatagrid />
  </List>
);

export default ImageList;