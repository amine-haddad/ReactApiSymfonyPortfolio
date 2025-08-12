import { createBrowserRouter } from "react-router-dom";
import routes from '~react-pages';
import Layout from '../layouts/Layout.jsx';
import NotFound from '../pages/NotFound.jsx';// adapte le chemin si besoin
import AdminPage from "../pages/admin/[...].jsx";

const wrappedRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      // ...routes, // <-- retire la route admin de ce tableau !
      ...routes.filter(r => !r.path.startsWith('admin')),
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin/*',
    element: <AdminPage />,
  },
];

export default createBrowserRouter(wrappedRoutes);
