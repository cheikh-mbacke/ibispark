import React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiPhone,
  FiMail,
  FiMap,
} from "react-icons/fi";
import styles from "./HotelCard.module.css";

const HotelCard = ({ hotel, onEdit, onDelete, onViewDetails }) => {
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
            <p className={styles["hotel-card-description"]}>
              {hotel.description || "Aucune description"}
            </p>
          </div>

          <div className={styles["hotel-card-actions"]}>
            <button
              onClick={() => onEdit(hotel.id)}
              className={styles["hotel-card-edit-button"]}
            >
              <FiEdit2 className={styles["hotel-card-action-icon"]} />
            </button>
            <button
              onClick={() => onDelete(hotel.id)}
              className={styles["hotel-card-delete-button"]}
            >
              <FiTrash2 className={styles["hotel-card-action-icon"]} />
            </button>
          </div>
        </div>

        {/* Informations de contact et emplacement */}
        <div className={styles["hotel-card-info"]}>
          {hotel.address && (
            <div className={styles["hotel-card-location"]}>
              <FiMapPin className={styles["hotel-card-location-icon"]} />
              <span>{hotel.address}</span>
            </div>
          )}

          {hotel.phone && (
            <div className={styles["hotel-card-feature"]}>
              <FiPhone className={styles["hotel-card-feature-icon"]} />
              <span>{hotel.phone}</span>
            </div>
          )}

          {hotel.email && (
            <div className={styles["hotel-card-feature"]}>
              <FiMail className={styles["hotel-card-feature-icon"]} />
              <span>{hotel.email}</span>
            </div>
          )}
        </div>

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
            <p className={styles["hotel-card-stat-value"]}>
              {hotel.occupancy_rate || "0%"}
            </p>
          </div>
        </div>

        {/* Bouton de détails */}
        <div className={styles["hotel-card-details-button-container"]}>
          <button
            onClick={() => onViewDetails(hotel.id)}
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
