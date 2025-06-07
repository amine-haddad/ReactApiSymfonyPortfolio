import { fetchData } from "./apiService";

export const fetchProfiles = async () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No token");

  const { id: userId } = JSON.parse(atob(token.split(".")[1]));
  const data = await fetchData(
    `/profiles?pagination=true&itemsPerPage=10&user.id=${userId}`
  );
  return data.member || [];
};

export const fetchPublicProfiles = async () => {
  const data = await fetchData("/profiles?pagination=true&itemsPerPage=10");
  return data.member || [];
};
