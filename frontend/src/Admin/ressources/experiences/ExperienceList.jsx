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
  TextInput
} from "react-admin";

const experienceFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

const CustomDatagrid = () => {
  const { data } = useListContext();
  const { identity } = useGetIdentity();

  if (!data || !identity) return null;

  // On suppose que experience.profile.user contient l'id du user propriétaire
  const myExperiences = data.filter(
    exp => exp.profile && exp.profile.user === identity.id
  );
  const otherExperiences = data.filter(
    exp => !exp.profile || exp.profile.user !== identity.id
  );

  return (
    <>
      <h3>Mes expériences</h3>
      <Datagrid data={myExperiences} rowClick="show">
        <TextField source="id" />
        <TextField source="role" label="Rôle" />
        <TextField source="compagny" label="Entreprise" />
        <DateField source="startDate" label="Début" />
        <DateField source="endDate" label="Fin" />
        <TextField source="slug" label="Slug" />
        <ReferenceField source="profile.id" reference="profiles" label="Profil">
          <TextField source="name" />
        </ReferenceField>
        <DateField source="created_at" label="Créé le" />
        <DateField source="updated_at" label="Modifié le" />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
      <h3>Autres expériences</h3>
      <Datagrid data={otherExperiences} rowClick="show">
        <TextField source="id" />
        <TextField source="role" label="Rôle" />
        <TextField source="compagny" label="Entreprise" />
        <DateField source="startDate" label="Début" />
        <DateField source="endDate" label="Fin" />
        <TextField source="slug" label="Slug" />
        <ReferenceField source="profile.id" reference="profiles" label="Profil">
          <TextField source="name" />
        </ReferenceField>
        <DateField source="created_at" label="Créé le" />
        <DateField source="updated_at" label="Modifié le" />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
    </>
  );
};

const ExperienceList = (props) => (
  <List {...props} filters={experienceFilters}>
    <CustomDatagrid />
  </List>
);

export default ExperienceList;