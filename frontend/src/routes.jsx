import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import des pages avec le lazy loading pour optimiser le chargement
const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));
const HotelsPage = React.lazy(() => import("./pages/HotelsPage/HotelsPage"));
const ParkingsPage = React.lazy(() =>
  import("./pages/ParkingsPage/ParkingsPage")
);
const SpotsPage = React.lazy(() => import("./pages/SpotsPage/SpotsPage"));
const StatusesPage = React.lazy(() =>
  import("./pages/StatusesPage/StatusesPage")
);
const TypesPage = React.lazy(() => import("./pages/TypesPage/TypesPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage/LoginPage"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));

// Composant de chargement pendant le lazy loading
const LoadingFallback = () => (
  <div className="p-4 text-center">Chargement...</div>
);

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Route d'accueil redirige vers le dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Routes principales */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/parkings" element={<ParkingsPage />} />
        <Route path="/spots" element={<SpotsPage />} />
        <Route path="/statuses" element={<StatusesPage />} />
        <Route path="/types" element={<TypesPage />} />

        {/* Route d'authentification */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route 404 pour gérer les URL inconnues */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
