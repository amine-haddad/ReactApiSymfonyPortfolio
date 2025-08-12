import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  EditButton,
  ShowButton,
  DeleteButton,
  useGetIdentity,
  useListContext,
  TextInput,
  ArrayField,
  SingleFieldList,
  ImageField
} from "react-admin";

const profileSkillFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

const CustomDatagrid = () => {
  const { data } = useListContext();
  const { identity } = useGetIdentity();

  if (!data || !identity) return null;

  const isAdmin = identity?.roles?.includes("ROLE_ADMIN");

  // Mes compétences de profil = celles dont le profil appartient à l'utilisateur connecté
  const myProfileSkills = data.filter(
    ps => ps.profile && ps.profile.user === identity.id
  );
  const otherProfileSkills = data.filter(
    ps => !ps.profile || ps.profile.user !== identity.id
  );

  return (
    <>
      <h3>Mes compétences de profil</h3>
      <Datagrid data={myProfileSkills} rowClick="show">
        <TextField source="id" />
        <TextField source="profile.name" label="Profil" />
        <TextField source="skill.name" label="Compétence" />
        <ArrayField source="skill.images" label="Images">
          <SingleFieldList>
            <ImageField source="url" title="name" />
          </SingleFieldList>
        </ArrayField>
        <NumberField source="level" label="Niveau" />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
      {isAdmin && (
        <>
          <h3>Autres associations</h3>
          <Datagrid data={otherProfileSkills} rowClick="show">
            <TextField source="id" />
            <TextField source="profile.name" label="Profil" />
            <TextField source="skill.name" label="Compétence" />
            <ArrayField source="skill.images" label="Images">
              <SingleFieldList>
                <ImageField source="url" title="name" />
              </SingleFieldList>
            </ArrayField>
            <NumberField source="level" label="Niveau" />
            <EditButton />
            <ShowButton />
            <DeleteButton />
          </Datagrid>
        </>
      )}
    </>
  );
};

const ProfileSkillList = (props) => (
  <List {...props} filters={profileSkillFilters}>
    <CustomDatagrid />
  </List>
);

export default ProfileSkillList;