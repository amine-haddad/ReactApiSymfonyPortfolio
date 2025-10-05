import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useGetList,
} from "react-admin";
import { ImageInput, ImageField } from "react-admin";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";

// Composant unique pour chaque image (aperçu + champ nom)
const ImageWithNameField = ({ record, ...props }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
    <ImageField source="src" record={record} title="imageName" sx={{ width: 80 }} />
    <TextInput
      source="imageName"
      label="Nom de l'image"
      record={record}
      variant="outlined"
      size="small"
      style={{ minWidth: 180 }}
      {...props}
    />
  </div>
);

const ImagesInputWithName = (props) => (
  <ImageInput {...props} multiple>
    <ImageWithNameField />
  </ImageInput>
);

// Sélection et niveau pour chaque profil
const ProfilesWithLevelInput = () => {
  const { data: profiles } = useGetList("profiles");
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profilesWithLevel",
  });

  return (
    <div>
      <select
        onChange={e => {
          const selectedId = parseInt(e.target.value, 10);
          const selectedProfile = profiles.find(p => p.id === selectedId);
          if (selectedProfile && !fields.find(f => f.id === selectedId)) {
            append({ id: selectedId, level: 1, name: selectedProfile.name });
          }
        }}
      >
        <option value="">Ajouter un profil...</option>
        {profiles &&
          profiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
      </select>
      {fields.map((item, index) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ minWidth: 120 }}>{item.name}</span>
          <Controller
            name={`profilesWithLevel.${index}.level`}
            control={control}
            defaultValue={item.level}
            render={({ field }) => (
              <input type="number" min={0} max={100} {...field} style={{ width: 80 }} />
            )}
          />
          <button type="button" onClick={() => remove(index)}>
            Retirer
          </button>
        </div>
      ))}
    </div>
  );
};

const SkillCreate = (props) => {
  const notify = useNotify();

  // Pour garantir un imageName pour chaque image
  const ensureImageNames = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map(img => {
      if (img.imageName && img.imageName.trim() !== "") return img;
      if (img.rawFile && img.rawFile.name) {
        return { ...img, imageName: img.rawFile.name };
      }
      return { ...img, imageName: `image_${Date.now()}` };
    });
  };

  return (
    <Create {...props} title="Créer une compétence">
      <SimpleForm
        transform={data => ({
          ...data,
          profiles: (data.profilesWithLevel || []).map(({ id, level }) => ({ id, level })),
        })}
        onSubmitError={error => {
          notify(error?.body?.error || "Erreur lors de la création", { type: "error" });
        }}
      >
        <TextInput source="name" label="Nom" validate={required()} fullWidth />
        <ImagesInputWithName source="images" label="Ajouter des images" accept="image/*" multiple />
        <ProfilesWithLevelInput />
      </SimpleForm>
    </Create>
  );
};

export default SkillCreate;