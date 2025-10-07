import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useEditController,
  useGetList,
  ImageField,
  ImageInput,
} from "react-admin";
import { useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";

// Composant pour uploader de nouvelles images pour un profil
const ProfilePictureInput = ({ index }) => {
  const { setValue } = useFormContext();
  return (
    <Controller
      name={`profilesWithLevel.${index}.newPictures`}
      defaultValue={[]}
      render={({ field }) => (
        <ImageInput
          label="Ajouter des images"
          accept="image/*"
          multiple
          {...field}
          onChange={e => {
            const files = Array.from(e.target.files || []);
            setValue(
              `profilesWithLevel.${index}.newPictures`,
              [
                ...(field.value || []),
                ...files.map(f => ({ rawFile: f, imageName: f.name }))
              ]
            );
          }}
        >
          <ImageField source="src" title="imageName" sx={{ width: 60 }} />
        </ImageInput>
      )}
    />
  );
};

// Composant pour gérer la liste des profils associés à la compétence
const ProfilesWithLevelInput = () => {
  const { data: profiles } = useGetList("profiles");
  const { control, setValue } = useFormContext();
  const deletedProfilePictureIds = useWatch({ name: "deletedProfilePictureIds", control });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profilesWithLevel",
    keyName: "fieldKey",
  });

  const selectedIds = fields.map((f) => Number(f.id));

  return (
    <div>
      <select
        onChange={(e) => {
          const selectedId = parseInt(e.target.value, 10);
          const selectedProfile = profiles.find((p) => p.id === selectedId);
          if (selectedProfile && !selectedIds.includes(selectedId)) {
            append({
              id: selectedId,
              level: 1,
              name: selectedProfile.name,
              pictures: [],
              newPictures: [],
            });
          }
        }}
      >
        <option value="">Ajouter un profil...</option>
        {profiles &&
          profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
      </select>
      {fields.map((item, index) => (
        <div key={item.fieldKey} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ minWidth: 120 }}>{item.name}</span>
          <Controller
            name={`profilesWithLevel.${index}.level`}
            control={control}
            defaultValue={item.level}
            render={({ field }) => (
              <input
                type="number"
                min={0}
                max={100}
                {...field}
                style={{ width: 80 }}
              />
            )}
          />
          {/* Images existantes */}
          {item.pictures && item.pictures
            .filter(pic => Array.isArray(deletedProfilePictureIds) ? !deletedProfilePictureIds.includes(pic.id) : true)
            .map(pic => (
              <div key={pic.id}>
                <ImageField record={pic} source="url" title="imageName" />
                <button
                  type="button"
                  onClick={() => {
                    setValue(
                      "deletedProfilePictureIds",
                      [...(deletedProfilePictureIds || []), pic.id],
                      { shouldDirty: true }
                    );
                  }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          {/* Upload nouvelles images */}
          <ProfilePictureInput index={index} />
          <button type="button" onClick={() => remove(index)}>
            Retirer
          </button>
        </div>
      ))}
    </div>
  );
};

const SkillEdit = (props) => {
  const { record } = useEditController(props);
  const notify = useNotify();

  return (
    <Edit {...props} title="Modifier une compétence">
      <SimpleForm
        record={record}
        key={record?.id}
        defaultValues={{
          deletedProfilePictureIds: [],
          profilesWithLevel:
            record?.profiles?.map((p) => ({
              id: p.id,
              level: p.level ?? 1,
              name: p.name,
              pictures: p.pictures || [],
              newPictures: [],
            })) || [],
        }}
        transform={(data) => {
          const profiles = (data.profilesWithLevel || []).map(
            ({ id, level }) => ({ id, level })
          );
          const profilePictures = {};
          (data.profilesWithLevel || []).forEach((profile) => {
            if (profile.newPictures && profile.newPictures.length > 0) {
              profilePictures[profile.id] = profile.newPictures.filter(
                (pic) => pic.rawFile
              );
            }
          });
          return {
            ...data,
            profiles,
            profileSkillPictures: profilePictures,
          };
        }}
        onSubmitError={(error) => {
          notify(error?.body?.error || "Erreur lors de la mise à jour", {
            type: "error",
          });
        }}
      >
        <TextInput source="name" label="Nom" validate={required()} fullWidth />
        <Controller
          name="deletedProfilePictureIds"
          defaultValue={[]}
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <ProfilesWithLevelInput />
      </SimpleForm>
    </Edit>
  );
};

export default SkillEdit;
