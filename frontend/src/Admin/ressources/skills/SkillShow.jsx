import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  ImageField,
  useRecordContext,
  Link,
  SingleFieldList,
} from "react-admin";

/**
 * Style appliqué aux images dans la vue détail.
 */
const imageStyle = {
  width: "100%",
  maxWidth: 120,
  height: "auto",
  marginRight: 16,
  marginBottom: 8,
};

/**
 * Affiche la liste des profils associés à la compétence.
 * Chaque nom de profil est cliquable et affiche le niveau.
 */
const ProfilesList = () => {
  const record = useRecordContext();
  if (!record || !Array.isArray(record.profiles) || record.profiles.length === 0) return <span>-</span>;
  return (
    <div style={{ paddingLeft: 16, margin: 0 }}>
      {record.profiles.map((p) => (
        <div key={p.id} style={{ marginBottom: 4 }}>
          <Link to={`/profiles/${p.id}`}>{p.name}</Link> : niveau {p.level}
        </div>
      ))}
    </div>
  );
};

/**
 * Vue détail d'une compétence (skill) :
 * - Affiche les infos principales, images, profils associés et dates.
 */
const SkillShow = (props) => (
  <Show {...props} title="Détail de la compétence">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom" />
      <TextField source="slug" label="Slug" />
      <ArrayField source="images" label="Images">
        <SingleFieldList>
          <ImageField source="url" title="imageName" sx={imageStyle} />
        </SingleFieldList>
      </ArrayField>
      <ProfilesList label="Profils associés" />
      <TextField source="created_at" label="Créé le" />
      <TextField source="updated_at" label="Modifié le" />
    </SimpleShowLayout>
  </Show>
);

export default SkillShow;