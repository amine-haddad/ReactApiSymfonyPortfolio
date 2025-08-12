import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";

const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="email" />
      <ArrayInput source="roles">
        <SimpleFormIterator>
          <TextInput />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="first_name" label="Prénom" />
      <TextInput source="last_name" label="Nom" />
      {/* Ajoute d'autres champs si besoin */}
    </SimpleForm>
  </Edit>
);

export default UserEdit;