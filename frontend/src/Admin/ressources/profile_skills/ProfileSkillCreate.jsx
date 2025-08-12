import React from "react";
import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  NumberInput,
  required
} from "react-admin";

const ProfileSkillCreate = (props) => (
  <Create {...props} title="Ajouter une compétence à un profil">
    <SimpleForm>
      <ReferenceInput source="profile" reference="profiles" label="Profil">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="skill" reference="skills" label="Compétence">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <NumberInput source="level" label="Niveau" min={0} max={100} validate={required()} />
    </SimpleForm>
  </Create>
);

export default ProfileSkillCreate;