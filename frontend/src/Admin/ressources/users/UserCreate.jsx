import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";

const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" />
      <TextInput source="password" type="password" />
      <ArrayInput source="roles">
        <SimpleFormIterator>
          <TextInput />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="first_name" label="Prénom" />
      <TextInput source="last_name" label="Nom" />
      {/* Ajoute d'autres champs si besoin */}
    </SimpleForm>
  </Create>
);

export default UserCreate;