import React from "react";
import { Show, SimpleShowLayout, TextField, EmailField, ArrayField, SingleFieldList, ChipField } from "react-admin";

const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <EmailField source="email" />
      <ArrayField source="interests">
        <SingleFieldList>
          <ChipField source="." />
        </SingleFieldList>
      </ArrayField>
      {/* Ajoute d'autres champs si besoin */}
    </SimpleShowLayout>
  </Show>
);

export default UserShow;