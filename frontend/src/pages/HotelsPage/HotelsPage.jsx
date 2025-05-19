import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReduxActions } from "../../hooks/useReduxActions";
import HotelCard from "../../components/hotels/HotelCard/HotelCard";
import Modal from "../../components/common/Modal/Modal";
import HotelForm from "../../components/hotels/HotelForm/HotelForm";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import styles from "./HotelsPage.module.css";

const HotelsPage = () => {
  const { actions, selectors } = useReduxActions();
  const hotels = selectors.getHotels();
  const parkings = selectors.getParkings();
  const spots = selectors.getSpots();
  const status = selectors.getHotelsStatus();
  const error = selectors.getHotelsError();
  const navigate = useNavigate();

  // États pour les modales
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [formMode, setFormMode] = useState("new"); // 'new' ou 'edit'
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Enrichir les hôtels avec des informations additionnelles
  const enrichedHotels = React.useMemo(() => {
    return hotels.map((hotel) => {
      // Trouver les parkings associés à cet hôtel
      const hotelParkings = parkings.filter((p) => p.hotel_id === hotel.id);

      // Compter les emplacements pour ces parkings
      let spotCount = 0;
      hotelParkings.forEach((parking) => {
        const parkingSpots = spots.filter((s) => s.parking_id === parking.id);
        spotCount += parkingSpots.length;
      });

      return {
        ...hotel,
        parkings_count: hotelParkings.length,
        spots_count: spotCount,
      };
    });
  }, [hotels, parkings, spots]);

  // Filtrer les hôtels en fonction du terme de recherche
  const filteredHotels = enrichedHotels.filter(
    (hotel) =>
      !searchTerm ||
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Charger les données nécessaires au montage du composant
    if (status === "idle") {
      actions.fetchHotels({});
      actions.fetchParkings({});
      actions.fetchSpots({});
    }
  }, [status, actions]);

  const handleRefresh = () => {
    actions.fetchHotels({});
    actions.fetchParkings({});
    actions.fetchSpots({});
  };

  const handleAddHotel = () => {
    setCurrentHotel(null);
    setFormMode("new");
    setFormModalOpen(true);
  };

  const handleEditHotel = (hotelId) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      setCurrentHotel(hotel);
      setFormMode("edit");
      setFormModalOpen(true);
    }
  };

  const handleDeleteHotel = (hotelId) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      setHotelToDelete(hotel);
      setConfirmDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    if (hotelToDelete) {
      actions.deleteHotel(hotelToDelete.id);
      setConfirmDeleteModal(false);
      setHotelToDelete(null);
    }
  };

  const handleFormSubmit = (formData) => {
    if (formMode === "new") {
      actions.createHotel(formData).then(() => {
        setFormModalOpen(false);
        handleRefresh();
      });
    } else if (formMode === "edit" && currentHotel) {
      actions.updateHotel(currentHotel.id, formData).then(() => {
        setFormModalOpen(false);
        handleRefresh();
      });
    }
  };

  const handleViewParkings = (hotelId) => {
    navigate(`/hotels/${hotelId}/parkings`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestion des Hôtels</h1>
        <div className={styles.headerActions}>
          <button
            onClick={handleRefresh}
            className={styles.refreshButton}
            disabled={status === "loading"}
          >
            <FiRefreshCw
              className={status === "loading" ? styles.spinning : ""}
            />
            Actualiser
          </button>
          <button onClick={handleAddHotel} className={styles.addButton}>
            <FiPlus />
            Ajouter un hôtel
          </button>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Rechercher un hôtel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {error && <div className={styles.errorMessage}>Erreur: {error}</div>}

      {status === "loading" ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des hôtels...</p>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm ? (
            <>
              <p>Aucun hôtel ne correspond à votre recherche.</p>
              <button
                onClick={() => setSearchTerm("")}
                className={styles.clearSearchButton}
              >
                Effacer la recherche
              </button>
            </>
          ) : (
            <>
              <p>Aucun hôtel n'a été trouvé.</p>
              <button
                onClick={handleAddHotel}
                className={styles.addEmptyButton}
              >
                <FiPlus />
                Ajouter un hôtel
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.hotelGrid}>
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEdit={handleEditHotel}
              onDelete={handleDeleteHotel}
              onViewParkings={handleViewParkings}
            />
          ))}
        </div>
      )}

      {/* Modal pour l'ajout/édition d'hôtel */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={formMode === "new" ? "Ajouter un hôtel" : "Modifier l'hôtel"}
      >
        <HotelForm
          hotel={currentHotel}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          loading={status === "loading"}
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={confirmDeleteModal}
        onClose={() => setConfirmDeleteModal(false)}
        title="Confirmation de suppression"
      >
        <div className={styles.confirmDeleteContent}>
          <p>Êtes-vous sûr de vouloir supprimer cet hôtel ?</p>
          {hotelToDelete && (
            <p className={styles.hotelToDelete}>{hotelToDelete.name}</p>
          )}
          <div className={styles.confirmActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setConfirmDeleteModal(false)}
            >
              Annuler
            </button>
            <button className={styles.deleteButton} onClick={confirmDelete}>
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HotelsPage;
