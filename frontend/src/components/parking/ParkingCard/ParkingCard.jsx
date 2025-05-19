import React from "react";
import { FiMapPin, FiEdit2, FiTrash2, FiCommand } from "react-icons/fi";
import styles from "./ParkingCard.module.css";

const ParkingCard = ({ parking, onEdit, onDelete, onViewSpots }) => {
  return (
    <div className={styles.parkingCard}>
      <div className={styles.parkingHeader}>
        <h3 className={styles.parkingName}>{parking.name}</h3>
        <div className={styles.parkingActions}>
          <button
            onClick={() => onEdit(parking.id)}
            className={styles.editButton}
            aria-label="Modifier"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => onDelete(parking.id)}
            className={styles.deleteButton}
            aria-label="Supprimer"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {parking.location && (
        <div className={styles.parkingLocation}>
          <FiMapPin className={styles.locationIcon} />
          <span>{parking.location}</span>
        </div>
      )}

      <div className={styles.parkingStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Capacité</span>
          <span className={styles.statValue}>{parking.capacity || 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Emplacements</span>
          <span className={styles.statValue}>{parking.spots_count || 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Disponibles</span>
          <span className={styles.statValue}>
            {parking.capacity
              ? parking.capacity - (parking.spots_count || 0)
              : 0}
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewSpots(parking.id)}
        className={styles.spotsButton}
      >
        <FiCommand className={styles.buttonIcon} />
        Gérer les emplacements
      </button>
    </div>
  );
};

export default ParkingCard;
