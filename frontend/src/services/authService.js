// authService.js
import { fetchData } from "./apiService";

export const fetchUser = async () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No token");

  const { id: userId } = JSON.parse(atob(token.split(".")[1]));
  const user = await fetchData(`/users/${userId}`);
  return user;
};
