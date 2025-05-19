import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReduxActions } from "../hooks/useReduxActions";
import HotelList from "../components/hotels/HotelList";
import HotelForm from "../components/hotels/HotelForm";
import { FiPlus, FiArrowLeft } from "react-icons/fi";

const HotelsPage = () => {
  const { actions, selectors } = useReduxActions();
  const hotels = selectors.getHotels();
  const status = selectors.getHotelsStatus();
  const error = selectors.getHotelsError();
  const navigate = useNavigate();
  const { id } = useParams(); // Pour les routes comme /hotels/:id/edit

  const [mode, setMode] = useState("list"); // 'list', 'new', 'edit'
  const [currentHotel, setCurrentHotel] = useState(null);

  useEffect(() => {
    // Charger la liste des hôtels au montage du composant
    if (status === "idle") {
      actions.fetchHotels({ skip: 0, limit: 100 });
    }

    // Déterminer le mode en fonction de l'URL
    if (window.location.pathname.includes("/new")) {
      setMode("new");
    } else if (window.location.pathname.includes("/edit") && id) {
      setMode("edit");
      // Charger les détails de l'hôtel si on est en mode édition
      actions.fetchHotelById(id);
    } else {
      setMode("list");
    }
  }, [status, actions, id]);

  // Mettre à jour currentHotel lorsque les données sont chargées en mode édition
  useEffect(() => {
    if (mode === "edit" && id) {
      const hotel = selectors.getHotelById(id);
      if (hotel) {
        setCurrentHotel(hotel);
      }
    }
  }, [mode, id, selectors]);

  const handleDelete = (hotelId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet hôtel ?")) {
      actions.deleteHotel(hotelId);
    }
  };

  const handleRefresh = () => {
    actions.fetchHotels({ skip: 0, limit: 100 });
  };

  const handleSubmit = (formData) => {
    if (mode === "new") {
      actions.createHotel(formData).then(() => {
        navigate("/hotels");
      });
    } else if (mode === "edit" && currentHotel) {
      actions.updateHotel(currentHotel.id, formData).then(() => {
        navigate("/hotels");
      });
    }
  };

  const handleCancel = () => {
    navigate("/hotels");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {mode === "list" ? (
          <h1 className="text-2xl font-bold dark:text-white">
            Gestion des Hôtels
          </h1>
        ) : (
          <div className="flex items-center">
            <button
              onClick={handleCancel}
              className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold dark:text-white">
              {mode === "new" ? "Ajouter un Hôtel" : "Modifier l'Hôtel"}
            </h1>
          </div>
        )}

        {mode === "list" && (
          <button
            onClick={() => navigate("/hotels/new")}
            className="btn btn-primary hidden md:flex"
          >
            <FiPlus className="mr-2" />
            Ajouter un hôtel
          </button>
        )}
      </div>

      {status === "failed" && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-6">
          Erreur: {error}
        </div>
      )}

      {mode === "list" && (
        <HotelList
          hotels={hotels}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          loading={status === "loading"}
        />
      )}

      {(mode === "new" || mode === "edit") && (
        <HotelForm
          hotel={currentHotel}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={status === "loading"}
        />
      )}
    </div>
  );
};

export default HotelsPage;
