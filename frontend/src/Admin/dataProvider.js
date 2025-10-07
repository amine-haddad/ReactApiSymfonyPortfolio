import simpleRestProvider from "ra-data-simple-rest";
const provider = simpleRestProvider("/api");

const normalizeProfilePictures = (profiles = []) =>
  profiles.map((profile) => ({
    ...profile,
    pictures: Array.isArray(profile.pictures)
      ? profile.pictures.map((pic) => ({
          ...pic,
          name: pic.imageName || pic.name,
          url: pic.url,
          src: pic.url,
        }))
      : [],
  }));

const wrappedProvider = {
  ...provider,
  getList: async (resource, params) => {
    if (resource === "skills") {
      // Pagination
      const { page, perPage } = params.pagination;
      const start = (page - 1) * perPage;
      const end = start + perPage - 1;
      const range = JSON.stringify([start, end]);
      const response = await fetch(
        `/api/skills?range=${encodeURIComponent(range)}`
      );
      let data = await response.json();

      // Ne traite plus les images du skill, seulement les pictures des profils
      data = Array.isArray(data)
        ? data.map((skill) => ({
            ...skill,
            profiles: normalizeProfilePictures(skill.profiles),
          }))
        : data;

      // Récupère le total depuis le header Content-Range
      const contentRange = response.headers.get("Content-Range");
      let total = data.length;
      if (contentRange) {
        const match = contentRange.match(/skills \d+-\d+\/(\d+)/);
        if (match) {
          total = parseInt(match[1], 10);
        }
      }

      return {
        data,
        total,
      };
    }
    return provider.getList(resource, params);
  },
  getOne: async (resource, params) => {
    if (resource === "skills") {
      const response = await fetch(`/api/skills/${params.id}`);
      let data = await response.json();
      // Ne normalise plus les images du skill, seulement les pictures des profils
      data = {
        ...data,
        profiles: normalizeProfilePictures(data.profiles),
      };
      return { data };
    }
    return provider.getOne(resource, params);
  },
  update: async (resource, params) => {
    if (resource === "skills") {
      const { data } = params;
      const formData = new FormData();

      // Champs simples
      formData.append("name", data.name);

      // Images supprimées des profileSkill
      if (Array.isArray(data.deletedProfilePictureIds)) {
        data.deletedProfilePictureIds.forEach((id) => {
          formData.append("deletedProfilePictureIds[]", id);
        });
      }
      console.log(
        "deletedProfilePictureIds dans dataProvider",
        data.deletedProfilePictureIds
      );
      // Profils associés
      if (Array.isArray(data.profilesWithLevel)) {
        data.profilesWithLevel.forEach((profile, i) => {
          console.log("DATA ENVOYÉ AU BACKEND", data);
          formData.append(`profiles[${i}][id]`, profile.id);
          formData.append(`profiles[${i}][level]`, profile.level);
          // Ajout de l'image du profil-skill
          if (profile.newPictures) {
            profile.newPictures.forEach((pic, idx) => {
              if (pic.rawFile) {
                formData.append(
                  `profilePictures[${profile.id}][]`,
                  pic.rawFile,
                  pic.rawFile.name
                );
              }
            });
          }
        });
      }

      // Envoi de la requête
      const response = await fetch(`/api/skills/${params.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la mise à jour");
      }

      const result = await response.json();
      return { data: result };
    }
    return provider.update(resource, params);
  },
  create: async (resource, params) => {
    if (resource === "skills") {
      const { data } = params;
      const formData = new FormData();

      // Champs simples
      formData.append("name", data.name);

      // Profils associés
      if (Array.isArray(data.profilesWithLevel)) {
        data.profilesWithLevel.forEach((profile, i) => {
          formData.append(`profiles[${i}][id]`, profile.id);
          formData.append(`profiles[${i}][level]`, profile.level);
          // Ajout de l'image du profil-skill
          if (profile.newPictures) {
            profile.newPictures.forEach((pic, idx) => {
              if (pic.rawFile) {
                formData.append(
                  `profilePictures[${profile.id}][]`,
                  pic.rawFile,
                  pic.rawFile.name
                );
              }
            });
          }
        });
      }

      // Envoi de la requête
      const response = await fetch("/api/skills", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la création");
      }

      const result = await response.json();
      return { data: result };
    }
    return provider.create(resource, params);
  },
  delete: provider.delete,
};

export default wrappedProvider;
