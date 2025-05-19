import React, { useEffect } from "react";
import { useReduxActions } from "../hooks/useReduxActions";

const TypesPage = () => {
  const { actions, selectors } = useReduxActions();
  const types = selectors.getTypes();
  const status = selectors.getTypesStatus();
  const error = selectors.getTypesError();

  useEffect(() => {
    actions.fetchTypes();
  }, [actions]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Gestion des Types</h1>

      {status === "loading" && <p>Chargement...</p>}
      {status === "failed" && <p className="text-red-500">Erreur: {error}</p>}

      {status === "succeeded" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {types.map((type) => (
              <div key={type.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{type.name}</h3>
                <p className="text-gray-600">
                  {type.description || "Aucune description"}
                </p>
              </div>
            ))}
          </div>

          {types.length === 0 && (
            <p className="text-gray-500">Aucun type disponible.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TypesPage;
