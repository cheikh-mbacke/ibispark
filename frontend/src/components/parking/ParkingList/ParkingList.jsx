import React from "react";
import ParkingCard from "../ParkingCard/ParkingCard";
import styles from "./ParkingList.module.css";

const ParkingList = ({ parkings, onEdit, onDelete, onViewSpots }) => {
  if (!parkings || parkings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aucun parking n'a été trouvé.</p>
      </div>
    );
  }

  return (
    <div className={styles.parkingGrid}>
      {parkings.map((parking) => (
        <ParkingCard
          key={parking.id}
          parking={parking}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewSpots={onViewSpots}
        />
      ))}
    </div>
  );
};

export default ParkingList;
