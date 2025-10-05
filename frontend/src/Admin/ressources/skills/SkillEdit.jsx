import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useEditController,
  useGetList,
} from "react-admin";
import { ImageInput, ImageField } from "react-admin";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";

/**
 * Affiche les images déjà enregistrées pour la skill,
 * permet de les supprimer côté front avant envoi.
 */
const ExistingImages = ({ existingImages, deletedImageIds, setDeletedImageIds }) => {
  const { setValue, trigger } = useFormContext();

  const handleDelete = (id) => {
    setDeletedImageIds(ids => {
      const newIds = [...ids, id];
      setValue("deletedImageIds", newIds, { shouldDirty: true });
      trigger("deletedImageIds");
      return newIds;
    });
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label>Images existantes :</label>
      {existingImages.length === 0 && <div>Aucune image</div>}
      {existingImages
        .filter(img => !deletedImageIds.includes(img.id))
        .map(img => (
          <div key={img.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
            <ImageField record={img} source={img.url ? "url" : "src"} title="imageName" sx={{ width: 80 }} />
            <button
              type="button"
              style={{ marginTop: 8 }}
              onClick={() => handleDelete(img.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
    </div>
  );
};

/**
 * Permet d'ajouter/retirer des profils associés à la skill,
 * et de saisir/modifier leur niveau.
 */
const ProfilesWithLevelInput = () => {
  const { data: profiles } = useGetList("profiles");
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profilesWithLevel",
  });

  // Pour éviter d'ajouter deux fois le même profil
  const selectedIds = fields.map(f => Number(f.id));

  return (
    <div>
      <select
        onChange={e => {
          const selectedId = parseInt(e.target.value, 10);
          const selectedProfile = profiles.find(p => p.id === selectedId);
          if (
            selectedProfile &&
            !selectedIds.includes(selectedId)
          ) {
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

/**
 * Composant principal d'édition d'une compétence (skill) :
 * - Nom
 * - Images (ajout/suppression)
 * - Profils associés + niveau pour chaque profil
 */
const SkillEdit = (props) => {
  const { record } = useEditController(props);
  const [existingImages, setExistingImages] = React.useState([]);
  const [deletedImageIds, setDeletedImageIds] = React.useState([]);
  const notify = useNotify();

  // Charge les images existantes à l'ouverture
  React.useEffect(() => {
    if (record?.images) setExistingImages(record.images);
  }, [record]);

  // S'assure que chaque image a un nom cohérent
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
    <Edit {...props} title="Modifier une compétence">
      <SimpleForm
        defaultValues={{
          profilesWithLevel: record?.profiles?.map(p => ({
            id: p.id,
            level: p.level ?? 1,
            name: p.name,
          })) || [],
        }}
        transform={data => {
          // Prépare les données à envoyer à l'API
          const images = ensureImageNames(data.images);
          const keptExisting = existingImages
            .filter(img => !deletedImageIds.includes(img.id))
            .map(img => ({ id: img.id, imageName: img.imageName }));

          const profiles = (data.profilesWithLevel || []).map(({ id, level }) => ({ id, level }));

          return {
            ...data,
            profiles,
            images,
            deletedImageIds,
            existingImages: keptExisting,
          };
        }}
        onSubmitError={error => {
          notify(error?.body?.error || "Erreur lors de la mise à jour", { type: "error" });
        }}
      >
        <TextInput source="name" label="Nom" validate={required()} fullWidth />

        <ImageInput source="images" label="Ajouter des images" accept="image/*" multiple>
          <ImageField source="src" title="imageName" sx={{ width: 80 }} />
        </ImageInput>

        <ExistingImages
          existingImages={existingImages}
          deletedImageIds={deletedImageIds}
          setDeletedImageIds={setDeletedImageIds}
        />

        <ProfilesWithLevelInput />

      </SimpleForm>
    </Edit>
  );
};

export default SkillEdit;