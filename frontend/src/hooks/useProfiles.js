import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useProfiles(type = "public") {
  const ctx = useContext(AuthContext);

  if (type === "public") {
    return {
      profiles: ctx.publicProfiles,
      loading: ctx.loading,
      error: ctx.error,
    };
  }
  if (type === "private") {
    return {
      profiles: ctx.user?.userProfiles || [],
      loading: ctx.loading,
      error: ctx.error,
      user: ctx.user,
      selectProfile: ctx.selectProfile,
    };
  }
  return {};
}
