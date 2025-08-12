import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  SingleFieldList,
  ImageField
} from "react-admin";

const imageStyle = { width: "100%", maxWidth: 120, height: "auto", marginRight: 16, marginBottom: 8 };

const SkillShow = (props) => (
  <Show {...props} title="Détail de la compétence">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <TextField source="slug" label="Slug" />
      <ArrayField source="images" label="Images">
        <SingleFieldList>
          <ImageField source="url" title="name" sx={imageStyle} />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="profiles" label="Profils associés">
        <SingleFieldList>
          <TextField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default SkillShow;