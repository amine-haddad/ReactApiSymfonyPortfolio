import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const ProfileCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" label="Nom" />
      <TextInput source="title" label="Titre" />
      <TextInput source="bio" label="Bio" multiline />
      <TextInput source="email" />
      <TextInput source="github_url" label="GitHub" />
      <TextInput source="linkedin_url" label="LinkedIn" />
      <TextInput source="slug" />
    </SimpleForm>
  </Create>
);

export default ProfileCreate;