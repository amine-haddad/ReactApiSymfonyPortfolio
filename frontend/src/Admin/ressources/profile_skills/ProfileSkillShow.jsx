import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ImageField
} from "react-admin";
import { Box, Typography, Divider } from "@mui/material";

const ProfileSkillShow = (props) => (
  <Show {...props} title="Détail de la compétence du profil">
    <SimpleShowLayout>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Informations générales
        </Typography>
        <TextField source="id" label="ID" />
        <TextField source="profile.name" label="Profil" />
        <TextField source="skill.name" label="Compétence" />
        <TextField source="skill.slug" label="Slug" />
        <NumberField source="level" label="Niveau" />
      </Box>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Images associées à la compétence
        </Typography>
        <ArrayField source="skill.images">
          <SingleFieldList>
            <ImageField source="url" title="name" sx={{ width: 120, height: "auto", mr: 2 }} />
          </SingleFieldList>
        </ArrayField>
      </Box>
    </SimpleShowLayout>
  </Show>
);

export default ProfileSkillShow;