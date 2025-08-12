import React from "react";
import {
  Edit,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  NumberInput,
  required
} from "react-admin";

const ProfileSkillEdit = (props) => (
  <Edit {...props} title="Modifier une compétence de profil">
    <SimpleForm>
      <ReferenceInput source="profile" reference="profiles" label="Profil">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="skill" reference="skills" label="Compétence">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <NumberInput source="level" label="Niveau" min={0} max={100} validate={required()} />
    </SimpleForm>
  </Edit>
);

export default ProfileSkillEdit;