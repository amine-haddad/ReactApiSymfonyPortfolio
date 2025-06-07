import { useRoutes } from 'react-router-dom';
import routes from '~react-pages';
import Layout from '../layouts/Layout.jsx';

export default function RouteWrapper() {
  // Ajoute le layout global à toutes les routes
  const wrappedRoutes = [
    {
      path: '/',
      element: <Layout />,
      children: routes,
    },
  ];

  return useRoutes(wrappedRoutes);
}
