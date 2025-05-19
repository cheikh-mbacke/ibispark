import React from "react";
import { FiEdit2, FiTrash2, FiMapPin, FiMap } from "react-icons/fi";
import styles from "./HotelCard.module.css";

const HotelCard = ({ hotel, onEdit, onDelete, onViewParkings }) => {
  return (
    <div className={styles["hotel-card"]}>
      <div className={styles["hotel-header"]}>
        {/* Image d'en-tête avec dégradé */}
        <div className={styles["hotel-card-banner"]}></div>

        {/* Logo ou avatar de l'hôtel */}
        <div className={styles["hotel-card-avatar-container"]}>
          <div className={styles["hotel-card-avatar"]}>
            <span className={styles["hotel-card-avatar-text"]}>
              {hotel.name ? hotel.name.charAt(0) : "?"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["hotel-card-content"]}>
        <div className={styles["hotel-card-title-container"]}>
          <div>
            <h3 className={styles["hotel-card-title"]}>{hotel.name}</h3>
          </div>

          <div className={styles["hotel-card-actions"]}>
            <button
              onClick={() => onEdit(hotel.id)}
              className={styles["hotel-card-edit-button"]}
              aria-label="Modifier"
            >
              <FiEdit2 className={styles["hotel-card-action-icon"]} />
            </button>
            <button
              onClick={() => onDelete(hotel.id)}
              className={styles["hotel-card-delete-button"]}
              aria-label="Supprimer"
            >
              <FiTrash2 className={styles["hotel-card-action-icon"]} />
            </button>
          </div>
        </div>

        {/* Informations de contact et emplacement */}
        {hotel.address && (
          <div className={styles["hotel-card-location"]}>
            <FiMapPin className={styles["hotel-card-location-icon"]} />
            <span>{hotel.address}</span>
          </div>
        )}

        {/* Statistiques */}
        <div className={styles["hotel-card-footer"]}>
          <div className={styles["hotel-card-stat"]}>
            <p className={styles["hotel-card-stat-label"]}>Parkings</p>
            <p className={styles["hotel-card-stat-value"]}>
              {hotel.parkings_count || 0}
            </p>
          </div>
          <div className={styles["hotel-card-stat"]}>
            <p className={styles["hotel-card-stat-label"]}>Emplacements</p>
            <p className={styles["hotel-card-stat-value"]}>
              {hotel.spots_count || 0}
            </p>
          </div>
          <div className={styles["hotel-card-stat"]}>
            <p className={styles["hotel-card-stat-label"]}>Occupation</p>
            <p className={styles["hotel-card-stat-value"]}>0%</p>
          </div>
        </div>

        {/* Bouton de détails */}
        <div className={styles["hotel-card-details-button-container"]}>
          <button
            onClick={() => onViewParkings(hotel.id)}
            className={styles["hotel-card-details-button"]}
          >
            <FiMap className={styles["hotel-card-details-icon"]} />
            Voir les parkings
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
