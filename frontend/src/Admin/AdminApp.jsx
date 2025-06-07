import { Admin, Resource } from "react-admin";
import dataProvider from "./dataProvider";
import { UserList } from "./resources/Users";

const AdminApp = () => {
  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource name="users" list={UserList} />
    </Admin>
  );
};

export default AdminApp;
