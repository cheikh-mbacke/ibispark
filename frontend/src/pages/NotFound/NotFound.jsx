import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">
        Page non trouvée
      </h2>
      <p className="text-gray-500 mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Retour au tableau de bord
      </Link>
    </div>
  );
};

export default NotFound;
