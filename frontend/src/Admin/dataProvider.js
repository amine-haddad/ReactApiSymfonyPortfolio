import simpleRestProvider from "ra-data-simple-rest";
const provider = simpleRestProvider("/api");

const wrappedProvider = {
  ...provider,
  getList: async (resource, params) => {
    if (resource === "skills") {
      // Appel standard pour récupérer tous les skills
      const response = await fetch("/api/skills");
      const data = await response.json();
      // API Platform retourne souvent {hydra:member: [...], hydra:totalItems: N}
      if (data["hydra:member"]) {
        return {
          data: data["hydra:member"],
          total: data["hydra:totalItems"] || data["hydra:member"].length,
        };
      }
      // fallback si ce n'est pas hydra
      return {
        data,
        total: data.length,
      };
    }
    const result = await provider.getList(resource, params);
    if (result.data && result.data.data && Array.isArray(result.data.data)) {
      return {
        data: result.data.data, // id est déjà l'id numérique
        total: result.data.total,
      };
    }
    return result;
  },
  getOne: async (resource, params) => {
    if (resource === "users") {
      return provider.getOne(resource, params);
    }
    return provider.getOne(resource, params);
  },
  update: async (resource, params) => {
    if (resource === "users") {
      return provider.update(resource, params);
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
    if (resource === "users") {
      return provider.create(resource, params);
    }
    return provider.create(resource, params);
  },
};

export default wrappedProvider;
