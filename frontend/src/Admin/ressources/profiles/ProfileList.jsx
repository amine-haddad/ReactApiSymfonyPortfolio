import React from "react";
import { List, Datagrid, TextField, EmailField, DateField, ShowButton, EditButton, useGetIdentity, useListContext, TextInput } from "react-admin";
import StarIcon from '@mui/icons-material/Star';

const profileFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

const CustomDatagrid = () => {
  const { data } = useListContext();
  const { identity } = useGetIdentity();

  if (!data || !identity) return null;

  const myProfiles = data.filter(profile => profile.user === identity.id);
  const otherProfiles = data.filter(profile => profile.user !== identity.id);

  return (
    <>
      <h3>Mes profils</h3>
      <Datagrid data={myProfiles} rowClick="show">
        <TextField source="id" />
        <TextField source="name" label="Nom" />
        <TextField source="title" label="Titre" />
        <TextField source="slug" />
        <EmailField source="email" />
        <DateField source="creeLe" label="Créé le" />
        <DateField source="modifieLe" label="Modifié le" />
        <StarIcon color="warning" titleAccess="C'est moi !" />
        <EditButton />
        <ShowButton />
      </Datagrid>
      <h3>Autres profils</h3>
      <Datagrid data={otherProfiles} rowClick="show">
        <TextField source="id" />
        <TextField source="name" label="Nom" />
        <TextField source="title" label="Titre" />
        <TextField source="slug" />
        <EmailField source="email" />
        <DateField source="creeLe" label="Créé le" />
        <DateField source="modifieLe" label="Modifié le" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </>
  );
};

const ProfileList = (props) => (
  <List {...props} filters={profileFilters}>
    <CustomDatagrid />
  </List>
);

export default ProfileList;