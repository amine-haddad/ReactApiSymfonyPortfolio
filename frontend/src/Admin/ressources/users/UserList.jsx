import React, { useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ArrayField,
  SingleFieldList,
  ChipField,
  EditButton,
  ShowButton,
  useGetIdentity,
  useListContext,
  usePermissions,
  useNotify,
  useRedirect,
  TextInput
} from "react-admin";

const CustomDatagrid = ({ isAdmin }) => {
  const { data } = useListContext();
  const { identity } = useGetIdentity();

  if (!data || !identity) return null;

  const myUser = data.filter(user => user.id === identity.id);
  const otherUsers = data.filter(user => user.id !== identity.id);

  return (
    <>
      <h3>Mon compte</h3>
      <Datagrid data={myUser} rowClick="show">
        <TextField source="id" />
        <EmailField source="email" />
        <ArrayField source="roles">
          <SingleFieldList>
            <ChipField source="" />
          </SingleFieldList>
        </ArrayField>
        <TextField source="first_name" label="Prénom" />
        <TextField source="last_name" label="Nom" />
        <TextField source="slug" />
        <EditButton />
        <ShowButton />
      </Datagrid>
      {isAdmin && (
        <>
          <h3>Autres utilisateurs</h3>
          <Datagrid data={otherUsers} rowClick="show">
            <TextField source="id" />
            <EmailField source="email" />
            <ArrayField source="roles">
              <SingleFieldList>
                <ChipField source="" />
              </SingleFieldList>
            </ArrayField>
            <TextField source="first_name" label="Prénom" />
            <TextField source="last_name" label="Nom" />
            <TextField source="slug" />
            <EditButton />
            <ShowButton />
          </Datagrid>
        </>
      )}
    </>
  );
};

const userFilters = [
  <TextInput label="Recherche" source="q" alwaysOn />
];

const UserList = (props) => {
  const { permissions, isLoading } = usePermissions();
  const notify = useNotify();
  const redirect = useRedirect();

  // Liste des rôles autorisés
  const allowedRoles = ["ROLE_ADMIN", "ROLE_CONTRIBUTOR", "ROLE_USER"];
  const isAllowed =
    permissions &&
    allowedRoles.some(role => permissions.includes(role));

  useEffect(() => {
    if (!isLoading && !isAllowed) {
      notify("Accès interdit", { type: "warning" });
      redirect("/admin/login");
    }
  }, [isAllowed, isLoading, notify, redirect]);

  const isAdmin = permissions && permissions.includes("ROLE_ADMIN");

  return (
    <List {...props} filters={userFilters} actions={isAdmin ? undefined : false}>
      <CustomDatagrid isAdmin={isAdmin} />
    </List>
  );
};

export default UserList;