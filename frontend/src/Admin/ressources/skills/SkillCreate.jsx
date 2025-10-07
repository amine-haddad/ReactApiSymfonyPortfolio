import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useGetList,
} from "react-admin";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";

// Champ image pour chaque profil-skill (nouveau format)
const ProfilePictureInput = ({ index }) => {
  const { setValue, getValues, watch } = useFormContext();
  // On observe les images sélectionnées pour ce profil
  const newPictures = watch(`profilesWithLevel.${index}.newPictures`) || [];

  return (
    <Controller
      name={`profilesWithLevel.${index}.newPictures`}
      defaultValue={[]}
      render={({ field }) => (
        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
            Ajouter une image de la compétence
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            id={`profile-picture-input-${index}`}
            onChange={e => {
              const files = Array.from(e.target.files || []);
              setValue(
                `profilesWithLevel.${index}.newPictures`,
                [
                  ...(getValues(`profilesWithLevel.${index}.newPictures`) || []),
                  ...files.map(f => ({ rawFile: f, imageName: f.name }))
                ]
              );
            }}
          />
          <label htmlFor={`profile-picture-input-${index}`}>
            <button
              type="button"
              style={{
                marginTop: 4,
                marginBottom: 8,
                padding: "4px 12px",
                cursor: "pointer"
              }}
              onClick={e => {
                e.preventDefault();
                document.getElementById(`profile-picture-input-${index}`).click();
              }}
            >
              Add picture
            </button>
          </label>
          {/* Affichage des miniatures */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {newPictures.map((pic, i) =>
              pic.rawFile ? (
                <img
                  key={i}
                  src={URL.createObjectURL(pic.rawFile)}
                  alt={pic.imageName}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                />
              ) : null
            )}
          </div>
        </div>
      )}
    />
  );
};

const ProfilesWithLevelInput = () => {
  const { data: profiles } = useGetList("profiles");
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profilesWithLevel",
  });

  return (
    <div>
      <label style={{ fontWeight: "bold", marginTop: 16, display: "block" }}>associez un Profil </label>
      <select
        style={{ marginBottom: 12 }}
        onChange={e => {
          const selectedId = parseInt(e.target.value, 10);
          const selectedProfile = profiles.find(p => p.id === selectedId);
          if (selectedProfile && !fields.find(f => f.id === selectedId)) {
            append({
              id: selectedId,
              level: 1,
              name: selectedProfile.name,
              newPictures: [],
            });
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
        <div key={item.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <div style={{ minWidth: 120, fontWeight: "bold", marginBottom: 8 }}>
            {item.name}
          </div>
          <label htmlFor={`profilesWithLevel.${index}.level`} style={{ display: "block", marginBottom: 4 }}>
            Niveau de la compétence
          </label>
          <Controller
            name={`profilesWithLevel.${index}.level`}
            control={control}
            defaultValue={item.level}
            render={({ field }) => (
              <input
                id={`profilesWithLevel.${index}.level`}
                type="number"
                min={1}
                max={100}
                {...field}
                style={{ width: 80, marginBottom: 8 }}
              />
            )}
          />
          <div style={{ marginTop: 8 }}>
            <ProfilePictureInput index={index} />
          </div>
          <button type="button" onClick={() => remove(index)} style={{ marginLeft: 8, marginTop: 8 }}>
            Retirer
          </button>
        </div>
      ))}
    </div>
  );
};

const SkillCreate = (props) => {
  const notify = useNotify();

  // Transforme les données pour l'API
  const transform = data => {
    const profiles = (data.profilesWithLevel || []).map(({ id, level }) => ({ id, level }));
    const profilePictures = {};
    (data.profilesWithLevel || []).forEach(profile => {
      if (profile.newPictures && profile.newPictures.length > 0) {
        profilePictures[profile.id] = profile.newPictures.filter(pic => pic.rawFile);
      }
    });
    return {
      ...data,
      profiles,
      profileSkillPictures: profilePictures,
    };
  };

  return (
    <Create {...props} title="Créer une compétence">
      <SimpleForm
        transform={transform}
        onSubmitError={error => {
          notify(error?.body?.error || "Erreur lors de la création", { type: "error" });
        }}
        defaultValues={{
          profilesWithLevel: [],
        }}
      >
        <label htmlFor="skill-name" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
          Nom de la compétence à créer
        </label>
        <TextInput
          source="name"
          id="skill-name"
          label={false}
          validate={required()}
          fullWidth
        />
        <ProfilesWithLevelInput />
      </SimpleForm>
    </Create>
  );
};

export default SkillCreate;