import simpleRestProvider from "ra-data-simple-rest";
const provider = simpleRestProvider("/api");

const wrappedProvider = {
  ...provider,
  getList: async (resource, params) => {
    if (resource === "skills") {
      // Pagination
      const { page, perPage } = params.pagination;
      const start = (page - 1) * perPage;
      const end = start + perPage - 1;
      const range = JSON.stringify([start, end]);
      const response = await fetch(`/api/skills?range=${encodeURIComponent(range)}`);
      let data = await response.json();

      // Traite les images comme avant
      data = Array.isArray(data)
        ? data.map(skill => ({
            ...skill,
            images: Array.isArray(skill.images)
              ? skill.images.map(img => ({
                  ...img,
                  name: img.imageName || img.name,
                  url: img.url
                }))
              : [],
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
    const result = await provider.getList(resource, params);
    if (result.data && result.data.data && Array.isArray(result.data.data)) {
      return {
        data: result.data.data,
        total: result.data.total,
      };
    }
    return result;
  },
  getOne: async (resource, params) => {
    if (resource === "skills") {
      const response = await fetch(`/api/skills/${params.id}`);
      let data = await response.json();
      // Les profils doivent contenir le level
      return { data };
    }
    return provider.getOne(resource, params);
  },
  update: async (resource, params) => {
    if (resource === "skills") {
      let { images, deletedImageIds = [], existingImages = [], profilesWithLevel = [], ...rest } = params.data;

      // Transforme profilesWithLevel en profiles
      const profiles = (profilesWithLevel || []).map(({ id, level }) => ({ id, level }));

      const formData = new FormData();

      // Ajoute les autres champs
      Object.entries(rest).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => {
            formData.append(`${key}[]`, typeof val === "object" ? JSON.stringify(val) : val);
          });
        } else if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Ajoute les profils avec level
      profiles.forEach(profileObj => {
        formData.append('profiles[]', JSON.stringify(profileObj));
      });

      // Ajoute les images à supprimer
      const deletedIdsSet = new Set(deletedImageIds.map(id => parseInt(id, 10)));
      deletedImageIds.forEach(id => {
        formData.append('deletedImageIds[]', id);
      });

      // Ajoute les images existantes à conserver/renommer
      if (existingImages && Array.isArray(existingImages)) {
        existingImages
          .filter(img =>
            img &&
            img.id &&
            !deletedIdsSet.has(parseInt(img.id, 10)) &&
            (img.imageName || img.name)
          )
          .forEach(img => {
            const imageName = img.imageName || img.name || `image_${img.id}`;
            formData.append('existingImages[]', JSON.stringify({ ...img, imageName }));
          });
      }

      // Ajoute les nouveaux fichiers uploadés
      if (images && Array.isArray(images)) {
        images.forEach((file) => {
          if (file.rawFile) {
            formData.append("images[]", file.rawFile, file.rawFile.name);
            formData.append("imageNames[]", file.imageName || file.rawFile.name);
          }
        });
      }

      const response = await fetch(`/api/skills/${params.id}`, {
        method: "POST", // ou "PATCH"
        body: formData,
      });
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.json();
        } catch (e) {
          errorText = await response.text();
        }
        throw new Error(errorText);
      }
      let data = await response.json();
      if (data && Array.isArray(data.images)) {
        data.images = data.images.map(img => ({ ...img, name: img.imageName || img.name }));
      }
      return { data };
    }
    return provider.update(resource, params);
  },
  delete: async (resource, params) => {
    if (resource === "users") {
      return provider.delete(resource, params);
    }
    return provider.delete(resource, params);
  },
  create: async (resource, params) => {
    if (resource === "skills") {
      let { images, profilesWithLevel = [], ...rest } = params.data;

      // Transforme profilesWithLevel en profiles
      const profiles = (profilesWithLevel || []).map(({ id, level }) => ({ id, level }));

      const formData = new FormData();

      // Ajoute les autres champs
      Object.entries(rest).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => {
            formData.append(`${key}[]`, typeof val === "object" ? JSON.stringify(val) : val);
          });
        } else if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Ajoute les profils avec level
      profiles.forEach(profileObj => {
        formData.append('profiles[]', JSON.stringify(profileObj));
      });

      // Ajoute les images
      if (images && Array.isArray(images)) {
        images.forEach((img) => {
          if (img.rawFile) {
            formData.append("images[]", img.rawFile, img.rawFile.name);
            formData.append("imageNames[]", img.imageName || img.rawFile.name);
          }
        });
      }

      const response = await fetch("/api/skills", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.json();
        } catch (e) {
          errorText = await response.text();
        }
        throw new Error(errorText);
      }
      let data = await response.json();
      if (data && Array.isArray(data.images)) {
        data.images = data.images.map(img => ({ ...img, name: img.imageName || img.name }));
      }
      return { data };
    }
    return provider.create(resource, params);
  },
};

export default wrappedProvider;
