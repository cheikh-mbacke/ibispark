import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReduxActions } from "../../hooks/useReduxActions";
import { FiArrowLeft, FiPlus, FiRefreshCw } from "react-icons/fi";
import ParkingList from "../../components/parking/ParkingList/ParkingList";
import ParkingForm from "../../components/parking/ParkingForm/ParkingForm";
import Modal from "../../components/common/Modal/Modal";
import styles from "./HotelParkingsPage.module.css";

const HotelParkingsPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { actions, selectors } = useReduxActions();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [currentParking, setCurrentParking] = useState(null);
  const [formMode, setFormMode] = useState("new");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [parkingToDelete, setParkingToDelete] = useState(null);

  // Récupérer les données
  const hotel = selectors.getHotelById(parseInt(hotelId));
  const allParkings = selectors.getParkings();
  const parkings = allParkings.filter((p) => p.hotel_id === parseInt(hotelId));
  const hotelStatus = selectors.getHotelsStatus();
  const parkingsStatus = selectors.getParkingsStatus();
  const loading = hotelStatus === "loading" || parkingsStatus === "loading";
  const error = selectors.getHotelsError() || selectors.getParkingsError();

  // Enrichir les parkings avec le nombre d'emplacements
  const spots = selectors.getSpots();
  const enrichedParkings = React.useMemo(() => {
    return parkings.map((parking) => {
      const parkingSpots = spots.filter((s) => s.parking_id === parking.id);
      return {
        ...parking,
        spots_count: parkingSpots.length,
      };
    });
  }, [parkings, spots]);

  useEffect(() => {
    // Charger l'hôtel et les parkings si nécessaire
    if (hotelStatus === "idle") {
      actions.fetchHotels({});
    }
    if (parkingsStatus === "idle") {
      actions.fetchParkings({});
    }
    if (selectors.getSpotsStatus() === "idle") {
      actions.fetchSpots({});
    }
  }, [hotelStatus, parkingsStatus, actions, selectors]);

  const handleRefresh = () => {
    actions.fetchHotels({});
    actions.fetchParkings({});
    actions.fetchSpots({});
  };

  const handleAddParking = () => {
    setCurrentParking(null);
    setFormMode("new");
    setFormModalOpen(true);
  };

  const handleEditParking = (parkingId) => {
    const parking = parkings.find((p) => p.id === parkingId);
    if (parking) {
      setCurrentParking(parking);
      setFormMode("edit");
      setFormModalOpen(true);
    }
  };

  const handleDeleteParking = (parkingId) => {
    const parking = parkings.find((p) => p.id === parkingId);
    if (parking) {
      setParkingToDelete(parking);
      setConfirmDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    if (parkingToDelete) {
      actions.deleteParking(parkingToDelete.id);
      setConfirmDeleteModal(false);
      setParkingToDelete(null);
    }
  };

  const handleFormSubmit = (formData) => {
    if (formMode === "new") {
      actions
        .createParking({ hotelId: parseInt(hotelId), parkingData: formData })
        .then(() => {
          setFormModalOpen(false);
          handleRefresh();
        });
    } else if (formMode === "edit" && currentParking) {
      actions
        .updateParking({
          parkingId: currentParking.id,
          parkingData: formData,
        })
        .then(() => {
          setFormModalOpen(false);
          handleRefresh();
        });
    }
  };

  const handleViewSpots = (parkingId) => {
    navigate(`/parkings/${parkingId}/spots`);
  };

  if (!hotel && !loading) {
    return (
      <div className={styles.notFound}>
        <h1>404 - Hôtel non trouvé</h1>
        <p>L'hôtel demandé n'existe pas ou a été supprimé.</p>
        <button
          className={styles.backButton}
          onClick={() => navigate("/hotels")}
        >
          Retour à la liste des hôtels
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/hotels")}
          >
            <FiArrowLeft />
          </button>
          <h1 className={styles.title}>
            Parkings de {hotel ? hotel.name : "l'hôtel"}
          </h1>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleRefresh}
            className={styles.refreshButton}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? styles.spinning : ""} />
            Actualiser
          </button>
          <button onClick={handleAddParking} className={styles.addButton}>
            <FiPlus />
            Ajouter un parking
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>Erreur: {error}</div>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des parkings...</p>
        </div>
      ) : enrichedParkings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Cet hôtel n'a pas encore de parkings.</p>
          <button onClick={handleAddParking} className={styles.addEmptyButton}>
            <FiPlus />
            Ajouter un premier parking
          </button>
        </div>
      ) : (
        <ParkingList
          parkings={enrichedParkings}
          onEdit={handleEditParking}
          onDelete={handleDeleteParking}
          onViewSpots={handleViewSpots}
        />
      )}

      {/* Modal pour l'ajout/édition de parking */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={
          formMode === "new" ? "Ajouter un parking" : "Modifier le parking"
        }
      >
        <ParkingForm
          parking={currentParking}
          hotelId={parseInt(hotelId)}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={confirmDeleteModal}
        onClose={() => setConfirmDeleteModal(false)}
        title="Confirmation de suppression"
      >
        <div className={styles.confirmDeleteContent}>
          <p>Êtes-vous sûr de vouloir supprimer ce parking ?</p>
          {parkingToDelete && (
            <p className={styles.parkingToDelete}>{parkingToDelete.name}</p>
          )}
          <p className={styles.confirmDeleteWarning}>
            Cette action supprimera également tous les emplacements associés à
            ce parking.
          </p>
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

export default HotelParkingsPage;
