import { createBrowserRouter } from "react-router-dom";
import routes from '~react-pages';
import Layout from '../layouts/Layout.jsx'; // Assurez-vous que le chemin est correct
import NotFound from '../pages/NotFound.jsx'; // Assurez-vous que le chemin est correct
console.log("Routes générées :", routes); // Vérifiez les routes générées
const wrappedRoutes = [
  {
    path: '/',
    element: <Layout />, // Ton layout global
    children: [...routes,// Les routes générées automatiquement
    { path: '*', element: <NotFound /> },
    ],
  },
];
// Créer le routeur
const Router = createBrowserRouter(wrappedRoutes);

export default Router;
