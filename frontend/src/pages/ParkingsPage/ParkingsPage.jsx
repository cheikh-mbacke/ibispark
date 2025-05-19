import React, { useEffect } from "react";
import { useReduxActions } from "../hooks/useReduxActions";
import ParkingList from "../components/parkings/ParkingList";

const ParkingsPage = () => {
  const { actions, selectors } = useReduxActions();
  const parkings = selectors.getParkings();
  const status = selectors.getParkingsStatus();
  const error = selectors.getParkingsError();

  useEffect(() => {
    actions.fetchParkings({ skip: 0, limit: 100 });
  }, [actions]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Gestion des Parkings</h1>

      {status === "loading" && <p>Chargement...</p>}
      {status === "failed" && <p className="text-red-500">Erreur: {error}</p>}

      {status === "succeeded" && <ParkingList parkings={parkings} />}
    </div>
  );
};

export default ParkingsPage;
