import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useDataProvider, useRedirect } from "react-admin";

export default function MyDashboard() {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const [stats, setStats] = useState({ users: 0, profiles: 0 });

  useEffect(() => {
    // Récupère le nombre d'utilisateurs et de profils
    Promise.all([
      dataProvider.getList("users", { pagination: { page: 1, perPage: 1 }, sort: { field: "id", order: "ASC" } }),
      dataProvider.getList("profiles", { pagination: { page: 1, perPage: 1 }, sort: { field: "id", order: "ASC" } }),
    ]).then(([users, profiles]) => {
      setStats({
        users: users.total,
        profiles: profiles.total,
      });
    });
  }, [dataProvider]);

  return (
    <div>
      <h2>Bienvenue sur le dashboard admin !</h2>
      <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Utilisateurs</Typography>
            <Typography variant="h4">{stats.users}</Typography>
            <Button onClick={() => redirect("/admin/users")}>Voir les utilisateurs</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Profils</Typography>
            <Typography variant="h4">{stats.profiles}</Typography>
            <Button onClick={() => redirect("/admin/profiles")}>Voir les profils</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}