import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  ImageInput,
  ImageField,
  ReferenceInput,
  SelectInput
} from "react-admin";

const imageStyle = { width: 80, height: "auto", marginRight: 16, marginBottom: 8 };

const SkillEdit = (props) => (
  <Edit {...props} title="Modifier une compétence">
    <SimpleForm>
      <TextInput source="name" label="Nom" validate={required()} fullWidth />
      <TextInput source="slug" label="Slug" fullWidth />
      <ImageInput source="images" label="Modifier les images" accept="image/*" multiple>
        <ImageField source="src" title="title" sx={imageStyle} />
      </ImageInput>
      <ReferenceInput source="profile" reference="profiles" label="Profil associé">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default SkillEdit;