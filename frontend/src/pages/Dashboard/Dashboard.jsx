import React, { useEffect } from "react";
import { FiBook, FiMap, FiMapPin, FiRefreshCw } from "react-icons/fi";
import { useParkingData } from "../../hooks/useParkingData";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { statistics, loading, error } = useParkingData();

  useEffect(() => {
    document.title = "Tableau de Bord - Gestion de Parking";
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Une erreur est survenue</h2>
        <p>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles["dashboard-header"]}>
        <h1 className={styles["dashboard-title"]}>Tableau de Bord</h1>
        <button
          className={styles.refreshButton}
          onClick={() => window.location.reload()}
        >
          <FiRefreshCw className={styles.buttonIcon} />
          Rafraîchir
        </button>
      </div>

      {/* Cartes de statistiques - uniquement celles fournies par l'API */}
      <div className={styles["stats-row"]}>
        <div className={styles.statCard}>
          <div className={styles.statCardInfo}>
            <div className={styles.statCardTitle}>Total des Hôtels</div>
            <div className={styles.statCardValue}>{statistics.totalHotels}</div>
          </div>
          <div className={`${styles.statCardIcon} ${styles.primaryIcon}`}>
            <FiBook size={20} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardInfo}>
            <div className={styles.statCardTitle}>Total des Parkings</div>
            <div className={styles.statCardValue}>
              {statistics.totalParkings}
            </div>
          </div>
          <div className={`${styles.statCardIcon} ${styles.secondaryIcon}`}>
            <FiMap size={20} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardInfo}>
            <div className={styles.statCardTitle}>Emplacements</div>
            <div className={styles.statCardValue}>{statistics.totalSpots}</div>
          </div>
          <div className={`${styles.statCardIcon} ${styles.accentIcon}`}>
            <FiMapPin size={20} />
          </div>
        </div>
      </div>

      {/* Liste des hôtels */}
      {statistics.totalHotels > 0 && (
        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Liste des hôtels</h2>
          <HotelTable hotels={statistics.hotels} />
        </div>
      )}
    </div>
  );
};

// Composant simple pour afficher les hôtels sous forme de tableau
const HotelTable = ({ hotels = [] }) => {
  if (hotels.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aucun hôtel disponible.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeadCell}>ID</th>
              <th className={styles.tableHeadCell}>Nom</th>
              <th className={styles.tableHeadCell}>Adresse</th>
              <th className={styles.tableHeadCell}>Parkings</th>
              <th className={styles.tableHeadCell}>Emplacements</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {hotels.map((hotel) => (
              <tr key={hotel.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{hotel.id}</td>
                <td className={styles.tableCell}>
                  <div className={styles.hotelName}>{hotel.name}</div>
                </td>
                <td className={styles.tableCell}>{hotel.address}</td>
                <td className={styles.tableCell}>{hotel.parkingCount || 0}</td>
                <td className={styles.tableCell}>{hotel.spotCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
