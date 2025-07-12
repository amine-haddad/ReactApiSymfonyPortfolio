import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  logout: async () => { },
  isAuthenticated: false
});
