import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  ArrayField,
  SingleFieldList,
  ImageField,
  TextInput,
  FunctionField,
} from "react-admin";

/**
 * Filtres de recherche pour la liste des skills.
 */
const skillFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

/**
 * Style appliqué aux images dans la liste.
 */
const imageStyle = {
  width: "100%",
  maxWidth: 120,
  height: "auto",
  marginRight: 16,
  marginBottom: 8,
};

/**
 * Colonne personnalisée pour afficher les images des profils associés.
 */
const ProfilePicturesField = ({ record }) => {
  if (!record || !Array.isArray(record.profiles)) return null;
  // Fusionne toutes les images des profils dans un seul tableau
  const allPictures = record.profiles
    .filter(profile => Array.isArray(profile.pictures) && profile.pictures.length > 0)
    .flatMap(profile => profile.pictures.map(pic => ({
      ...pic,
      profileName: profile.name,
    })));

  if (allPictures.length === 0) return null;

  // Utilise ArrayField comme pour les images du skill
  return (
    <ArrayField record={{ pictures: allPictures }} source="pictures">
      <SingleFieldList>
        <ImageField
          source="url"
          title="profileName"
          sx={{
            width: 64,
            height: 64,
            objectFit: "cover",
            borderRadius: 4,
            border: "1px solid #eee",
            marginRight: 8,
          }}
        />
      </SingleFieldList>
    </ArrayField>
  );
};

/**
 * Datagrid personnalisé pour afficher la liste des skills avec toutes les colonnes utiles.
 */
const CustomDatagrid = () => (
  <Datagrid rowClick="show">
    <TextField source="id" label="ID" />
    <TextField source="name" label="Nom" />
    <TextField source="slug" label="Slug" />
    {/* Affiche les profils et niveaux, retour à la ligne pour chaque profil */}
    <FunctionField
      label="Profils & niveaux"
      render={record =>
        record && Array.isArray(record.profiles) && record.profiles.length > 0
          ? record.profiles.map(
              p => `${p.name || "Profil"} : niveau ${p.level}`
            ).join('\n')
          : "-"
      }
      sx={{ whiteSpace: 'pre-line' }}
    />
    {/* Affiche les images associées */}
    <ArrayField source="images" label="Images">
      <SingleFieldList>
        <ImageField source="url" title="imageName" sx={imageStyle} />
      </SingleFieldList>
    </ArrayField>
    {/* Images des ProfileSkill */}
    <FunctionField
      label="Images profils"
      render={record => {
        // Fusionne toutes les images des profils dans un seul tableau
        const allPictures = record.profiles
          ?.filter(profile => Array.isArray(profile.pictures) && profile.pictures.length > 0)
          .flatMap(profile => profile.pictures.map(pic => ({
            ...pic,
            profileName: profile.name,
          }))) || [];

        if (allPictures.length === 0) return null;

        // Utilise ArrayField comme pour les images du skill
        return (
          <ArrayField record={{ pictures: allPictures }} source="pictures">
            <SingleFieldList>
              <ImageField
                source="url"
                title="imageName"
                sx={imageStyle}
              />
            </SingleFieldList>
          </ArrayField>
        );
      }}
    />
    <DateField source="created_at" label="Créé le" />
    <DateField source="updated_at" label="Modifié le" />
    <EditButton />
    <ShowButton />
    <DeleteButton />
  </Datagrid>
);

/**
 * Composant principal pour la liste des compétences (skills).
 * - Recherche
 * - Affichage des profils, images, dates, actions
 */
const SkillList = (props) => (
  <List {...props} filters={skillFilters}>
    <CustomDatagrid />
  </List>
);

export default SkillList;