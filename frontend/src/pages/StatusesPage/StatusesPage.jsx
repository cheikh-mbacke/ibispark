import React, { useEffect } from "react";
import { useReduxActions } from "../hooks/useReduxActions";
import StatusBadge from "../components/statuses/StatusBadge";

const StatusesPage = () => {
  const { actions, selectors } = useReduxActions();
  const statuses = selectors.getStatuses();
  const status = selectors.getStatusesStatus();
  const error = selectors.getStatusesError();

  useEffect(() => {
    actions.fetchStatuses();
  }, [actions]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Gestion des Statuts</h1>

      {status === "loading" && <p>Chargement...</p>}
      {status === "failed" && <p className="text-red-500">Erreur: {error}</p>}

      {status === "succeeded" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statuses.map((statusItem) => (
              <div
                key={statusItem.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center mb-2">
                  <StatusBadge status={statusItem} />
                  <h3 className="ml-2 font-semibold">{statusItem.name}</h3>
                </div>
                <p className="text-gray-600">
                  {statusItem.description || "Aucune description"}
                </p>
              </div>
            ))}
          </div>

          {statuses.length === 0 && (
            <p className="text-gray-500">Aucun statut disponible.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusesPage;
