import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  ImageInput,
  ImageField,
  ReferenceInput,
  SelectInput
} from "react-admin";

const imageStyle = { width: 80, height: "auto", marginRight: 16, marginBottom: 8 };

const SkillCreate = (props) => (
  <Create {...props} title="Créer une compétence">
    <SimpleForm>
      <TextInput source="name" label="Nom" validate={required()} fullWidth />
      <TextInput source="slug" label="Slug" fullWidth />
      <ImageInput source="images" label="Ajouter des images" accept="image/*" multiple>
        <ImageField source="src" title="title" sx={imageStyle} />
      </ImageInput>
      <ReferenceInput source="profile" reference="profiles" label="Profil associé">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="level" label="Niveau" validate={required()} fullWidth />
    </SimpleForm>
  </Create>
);

export default SkillCreate;