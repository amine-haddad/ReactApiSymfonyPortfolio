import axios from "axios";

const authProvider = {
  login: async ({ username, password }) => {
    await axios.post(
      "/api/login_check",
      { email: username, password }, // <-- ici !
      { withCredentials: true }
    );
    return Promise.resolve();
  },
  logout: async () => {
    await axios.post("/api/logout", {}, { withCredentials: true });
    return Promise.resolve();
  },
  checkAuth: async () => {
    try {
      await axios.get("/api/me", { withCredentials: true });
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  },
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: async () => {
    try {
      const res = await axios.get("/api/me", { withCredentials: true });
      // Si roles est un tableau, retourne le premier rôle ou tout le tableau
      return Promise.resolve(res.data.user.roles);
    } catch {
      return Promise.reject();
    }
  },
  getIdentity: async () => {
    try {
      const res = await axios.get("/api/me", { withCredentials: true });
      return Promise.resolve({
        id: res.data.user.id,
        fullName: `${res.data.user.first_name} ${res.data.user.last_name}`,
        //avatar: res.data.user.avatar, // si tu as un champ avatar
      });
    } catch {
      return Promise.reject();
    }
  },
};

export default authProvider;
