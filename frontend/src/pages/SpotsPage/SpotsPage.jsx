import React, { useEffect } from "react";
import { useReduxActions } from "../hooks/useReduxActions";
import SpotGrid from "../components/spots/SpotGrid";

const SpotsPage = () => {
  const { actions, selectors } = useReduxActions();
  const spots = selectors.getSpots();
  const status = selectors.getSpotsStatus();
  const error = selectors.getSpotsError();

  useEffect(() => {
    actions.fetchSpots({ skip: 0, limit: 100 });
    actions.fetchParkings({ skip: 0, limit: 100 });
  }, [actions]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Gestion des Emplacements</h1>

      {status === "loading" && <p>Chargement...</p>}
      {status === "failed" && <p className="text-red-500">Erreur: {error}</p>}

      {status === "succeeded" && <SpotGrid spots={spots} />}
    </div>
  );
};

export default SpotsPage;
