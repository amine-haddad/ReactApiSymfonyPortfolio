import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layouts";
import Experiences from "../pages/Experiences";
import UserHome from "../pages/UserHome";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFund";
import ProtectedRoute from "../components/ProtectedRoute";
import ProjectPage from "../pages/ProjectPage";
import ProjectDetails from "../components/projet/ProjectDetails";
import ProfilePage from "../pages/ProfilePage";
import Projects from "../components/projet/Projects";
import ProfileExperiences from "../components/profile/ProfileExperiences";


// Crée le routeur ici avec l'utilisation de `createBrowserRouter`
const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <UserHome /> },
      { path: "/login", element: <LoginPage /> },
      { 
        path: "/dashboard", 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>, // Protège la route Dashboard
      },
      { 
        path: "/", 
        element: <UserHome /> 
      },
      {
        path:"/user/profiles/" ,
        element:<ProfilePage /> 
       },
     {
      path:"/profile/:id" ,
      element:<ProfilePage /> 
     },
     { 
      path: "/profile/projects", 
      element: <ProjectPage /> 
    },
     { 
      path: "/projects", 
      element: <Projects /> 
    },
    { 
      path: "projectsDetail/:id", 
      element: <ProjectDetails /> 
    },
    { 
      path: "/experiences", 
      element: <ProfileExperiences/>
    },
    ],
    
  },
  { path: "*", element: <NotFound /> }, // Route 404
]);

// Exporter le router pour l'utiliser dans App.jsx
export default Router;
