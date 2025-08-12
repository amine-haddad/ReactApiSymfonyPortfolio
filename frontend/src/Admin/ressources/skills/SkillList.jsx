import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  ArrayField,
  SingleFieldList,
  ImageField,
  TextInput,
  useListContext,
  useGetIdentity
} from "react-admin";

const skillFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

const CustomDatagrid = () => {
  const { data } = useListContext();
  const { identity } = useGetIdentity();

  if (!data || !identity) return null;

  const isAdmin = identity?.roles?.includes("ROLE_ADMIN");

  const mySkills = data.filter(
    skill =>
      skill.profiles &&
      skill.profiles.some(profile => profile && profile.user === identity.id)
  );
  const otherSkills = data.filter(
    skill =>
      !skill.profiles ||
      !skill.profiles.some(profile => profile && profile.user === identity.id)
  );

  // Style pour espacer les images
  const imageStyle = { width: 80, height: "auto", marginRight: 16, marginBottom: 8 };

  return (
    <>
      <h3>Mes compétences</h3>
      <Datagrid rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="name" label="Nom" />
        <TextField source="slug" label="Slug" />
        <ArrayField source="profiles" label="Profils associés">
          <SingleFieldList>
            <TextField source="name" />
          </SingleFieldList>
        </ArrayField>
        <ArrayField source="images" label="Images">
          <SingleFieldList>
            <ImageField source="url" title="name" sx={imageStyle} />
          </SingleFieldList>
        </ArrayField>
        <DateField source="created_at" label="Créé le" />
        <DateField source="updated_at" label="Modifié le" />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
      {isAdmin && (
        <>
          <h3>Autres compétences</h3>
          <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <TextField source="name" label="Nom" />
            <TextField source="slug" label="Slug" />
            <ArrayField source="profiles" label="Profils associés">
              <SingleFieldList>
                <TextField source="name" />
              </SingleFieldList>
            </ArrayField>
            <ArrayField source="images" label="Images">
              <SingleFieldList>
                <ImageField source="url" title="name" sx={imageStyle} />
              </SingleFieldList>
            </ArrayField>
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

const SkillList = (props) => (
  <List {...props} filters={skillFilters}>
    <CustomDatagrid />
  </List>
);

export default SkillList;