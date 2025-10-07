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

// Formatage des dates en français
const DateFieldFr = ({ source, label }) => {
  const record = useRecordContext();
  if (!record || !record[source]) return <span>-</span>;
  const date = new Date(record[source]);
  return (
    <span>
      {date.toLocaleDateString("fr-FR")} {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
};

// Normalise les images des profils
const normalizeProfilePictures = (profiles = []) =>
  profiles.map(profile => ({
    ...profile,
    pictures: Array.isArray(profile.pictures)
      ? profile.pictures.map(pic => ({
          ...pic,
          name: pic.imageName || pic.name,
          url: pic.url,
          src: pic.url,
        }))
      : [],
  }));

// Affiche la liste des profils associés à la compétence avec leurs images
const ProfilesList = () => {
  const record = useRecordContext();
  const profiles = normalizeProfilePictures(record.profiles);
  if (!record || !Array.isArray(profiles) || profiles.length === 0) return <span>-</span>;
  return (
    <div style={{ paddingLeft: 16, margin: 0 }}>
      {profiles.map((p) => (
        <div key={p.id} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: "bold" }}>
            <Link to={`/profiles/${p.id}`}>{p.name}</Link> <span style={{ color: "#888" }}>• niveau {p.level}</span>
          </div>
          {p.pictures && p.pictures.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
              {p.pictures.map(pic => (
                <div key={pic.id} style={{ textAlign: "center" }}>
                  <ImageField
                    record={pic}
                    source="src"
                    title="imageName"
                    sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, boxShadow: "0 1px 4px #ccc" }}
                  />
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{pic.imageName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const imageStyle = {
  width: "100%",
  maxWidth: 120,
  height: "auto",
  marginRight: 16,
  marginBottom: 8,
  borderRadius: 8,
  boxShadow: "0 1px 4px #ccc",
};

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
      <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
        <div>
          <span style={{ fontWeight: "bold" }}>Créé le : </span>
          <DateFieldFr source="created_at" />
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Modifié le : </span>
          <DateFieldFr source="updated_at" />
        </div>
      </div>
    </SimpleShowLayout>
  </Show>
);

export default SkillShow;