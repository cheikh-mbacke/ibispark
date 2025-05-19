import React from "react";
import { FiCheck, FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./ParkingOverview.module.css";

const ParkingOverview = ({ parkings = [] }) => {
  if (parkings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>Aucun parking disponible</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeadCell}>Nom</th>
              <th className={styles.tableHeadCell}>Hôtel</th>
              <th className={styles.tableHeadCell}>Capacité</th>
              <th className={styles.tableHeadCell}>Occupation</th>
              <th className={styles.tableHeadCell}>Statut</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {parkings.map((parking) => {
              // Calculer un taux d'occupation fictif si nécessaire
              const occupancyRate = Math.floor(Math.random() * 100);
              let statusClass;
              let StatusIcon;

              if (occupancyRate < 50) {
                statusClass = styles.statusAvailable;
                StatusIcon = FiCheck;
              } else if (occupancyRate < 80) {
                statusClass = styles.statusBusy;
                StatusIcon = FiAlertTriangle;
              } else {
                statusClass = styles.statusFull;
                StatusIcon = FiX;
              }

              return (
                <tr key={parking.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.parkingName}>{parking.name}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.hotelName}>
                      {parking.hotel_name || "Non défini"}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.capacity}>
                      {parking.capacity || "N/A"}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.progressContainer}>
                      <div
                        className={`${styles.progressBar} ${
                          occupancyRate < 50
                            ? styles.progressGreen
                            : occupancyRate < 80
                            ? styles.progressYellow
                            : styles.progressRed
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    <div className={styles.progressText}>{occupancyRate}%</div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={statusClass}>
                      <StatusIcon className={styles.statusIcon} />
                      {occupancyRate < 50
                        ? "Disponible"
                        : occupancyRate < 80
                        ? "Occupé"
                        : "Complet"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParkingOverview;
