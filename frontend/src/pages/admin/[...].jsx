import React from "react";
import { Admin, Resource } from "react-admin";
import dataProvider from "../../Admin/dataProvider";
import authProvider from "../../Admin/authProvider";
import MyDashboard from "../../Admin/MyDashboard";
import ProfileList from "../../Admin/ressources/profiles/ProfileList";
import ProfileEdit from "../../Admin/ressources/profiles/ProfileEdit";
import ProfileShow from "../../Admin/ressources/profiles/ProfileShow";
import ProfileCreate from "../../Admin/ressources/profiles/ProfileCreate";
import UserList from "../../Admin/ressources/users/UserList";
import UserEdit from "../../Admin/ressources/users/UserEdit";
import UserShow from "../../Admin/ressources/users/UserShow";
import UserCreate from "../../Admin/ressources/users/UserCreate";
import ProjectList from "../../Admin/ressources/projects/ProjectList";
import ProjectEdit from "../../Admin/ressources/projects/ProjectEdit";
import ProjectShow from "../../Admin/ressources/projects/ProjectShow";
import ProjectCreate from "../../Admin/ressources/projects/ProjectCreate";
import ExperienceList from "../../Admin/ressources/experiences/ExperienceList";
import ExperienceEdit from "../../Admin/ressources/experiences/ExperienceEdit";
import ExperienceShow from "../../Admin/ressources/experiences/ExperienceShow";
import ExperienceCreate from "../../Admin/ressources/experiences/ExperienceCreate";
import SkillList from "../../Admin/ressources/skills/SkillList";
import SkillEdit from "../../Admin/ressources/skills/SkillEdit";
import SkillShow from "../../Admin/ressources/skills/SkillShow";
import SkillCreate from "../../Admin/ressources/skills/SkillCreate";
import ImageList from "../../Admin/ressources/images/ImageList";
import ImageEdit from "../../Admin/ressources/images/ImageEdit";
import ImageShow from "../../Admin/ressources/images/ImageShow";
import ImageCreate from "../../Admin/ressources/images/ImageCreate";
import ProfileSkillList from "../../Admin/ressources/profile_skills/ProfileSkillList";
import ProfileSkillEdit from "../../Admin/ressources/profile_skills/ProfileSkillEdit";
import ProfileSkillShow from "../../Admin/ressources/profile_skills/ProfileSkillShow";
import ProfileSkillCreate from "../../Admin/ressources/profile_skills/ProfileSkillCreate";

const AdminPage = () => (
  <Admin
    basename="/admin"
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={MyDashboard}
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      show={UserShow}
      create={UserCreate}
      options={{ label: "Utilisateurs" }}
    />
    <Resource
      name="profiles"
      list={ProfileList}
      edit={ProfileEdit}
      show={ProfileShow}
      create={ProfileCreate}
      options={{ label: "Profils" }}
    />
    <Resource
      name="projects"
      list={ProjectList}
      edit={ProjectEdit}
      show={ProjectShow}
      create={ProjectCreate}
      options={{ label: "Projets" }}
    />
    <Resource
      name="experiences"
      list={ExperienceList}
      edit={ExperienceEdit}
      show={ExperienceShow}
      create={ExperienceCreate}
      options={{ label: "Expériences" }}
    />
    <Resource
      name="skills"
      list={SkillList}
      edit={SkillEdit}
      show={SkillShow}
      create={SkillCreate}
      options={{ label: "Compétences" }}
    />
    <Resource
      name="images"
      list={ImageList}
      edit={ImageEdit}
      show={ImageShow}
      create={ImageCreate}
      options={{ label: "Images" }}
    />
    <Resource
      name="profile_skills"
      list={ProfileSkillList}
      edit={ProfileSkillEdit}
      show={ProfileSkillShow}
      create={ProfileSkillCreate}
      options={{ label: "Compétences du profil" }}
    />
  </Admin>
);

export default AdminPage;