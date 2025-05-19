import React from "react";
import styles from "./StatsCard.module.css";

const StatsCard = ({ title, value, icon, color, trend, trendValue }) => {
  // Déterminer la classe de style pour la couleur de la bordure
  const getBorderColorClass = () => {
    switch (color) {
      case "bg-blue-100":
        return styles["stat-card-primary"];
      case "bg-purple-100":
        return styles["stat-card-secondary"];
      case "bg-green-100":
        return styles["stat-card-accent"];
      case "bg-cyan-100":
        return styles["stat-card-success"];
      default:
        return "";
    }
  };

  // Déterminer la classe pour la tendance
  const getTrendClass = () => {
    if (trend === "down") {
      return styles["trend-down"];
    }
    return "";
  };

  return (
    <div className={`${styles["stat-card"]} ${getBorderColorClass()}`}>
      <div className={styles["stat-card-info"]}>
        <p className={styles["stat-card-title"]}>{title}</p>
        <h3 className={styles["stat-card-value"]}>{value}</h3>

        {trend && (
          <div className={`${styles["stat-card-trend"]} ${getTrendClass()}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </div>
        )}
      </div>
      <div className={styles["stat-card-icon"]}>{icon}</div>
    </div>
  );
};

export default StatsCard;
