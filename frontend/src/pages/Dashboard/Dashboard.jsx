import React from "react";
import {
  FiBook,
  FiMap,
  FiMapPin,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
  FiBarChart2,
  FiPieChart,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles["dashboard-header"]}>
        <h1 className={styles["dashboard-title"]}>Tableau de Bord</h1>
        <button className={styles.reportButton}>
          <FiBarChart2 className={styles.buttonIcon} />
          Générer un rapport
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className={styles["stats-row"]}>
        <div className={styles.statCard}>
          <div className={styles.statCardInfo}>
            <div className={styles.statCardTitle}>Total des Hôtels</div>
            <div className={styles.statCardValue}>12</div>
            <div className={styles.statCardTrend}>↑ 12%</div>
          </div>
          <div className={`${styles.statCardIcon} ${styles.primaryIcon}`}>
            <FiBook size={20} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardInfo}>
            <div className={styles.statCardTitle}>Total des Parkings</div>
            <div className={styles.statCardValue}>24</div>
            <div className={styles.statCardTrend}>↑ 8%</div>
          </div>
          <div className={`${styles.statCardIcon} ${styles.secondaryIcon}`}>
            <FiMap size={20} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardInfo}>
            <div className={styles.statCardTitle}>Emplacements</div>
            <div className={styles.statCardValue}>128</div>
            <div className={styles.statCardTrend}>↑ 5%</div>
          </div>
          <div className={`${styles.statCardIcon} ${styles.accentIcon}`}>
            <FiMapPin size={20} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardInfo}>
            <div className={styles.statCardTitle}>Taux d'Occupation</div>
            <div className={styles.statCardValue}>76%</div>
            <div className={styles.statCardTrend}>↑ 3%</div>
          </div>
          <div className={`${styles.statCardIcon} ${styles.successIcon}`}>
            <FiUsers size={20} />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className={styles["charts-row"]}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Occupation Hebdomadaire</div>
            <div className={styles.chartActions}>
              <div className={styles.chartAction}>
                <FiBarChart2 />
              </div>
            </div>
          </div>
          <div className={styles.chartContent}>
            Graphique d'occupation hebdomadaire
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Distribution par Hôtel</div>
            <div className={styles.chartActions}>
              <div className={styles.chartAction}>
                <FiRefreshCw />
              </div>
            </div>
          </div>
          <div className={styles.chartContent}>
            Graphique de distribution par hôtel
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <div className={styles.activityTitle}>Activité Récente</div>
          <div className={styles.activityDate}>Aujourd'hui</div>
        </div>
        <ul className={styles.activityList}>
          <li className={styles.activityItem}>
            <div
              className={`${styles.activityItemIcon} ${styles.activityIconSuccess}`}
            >
              <FiCheckCircle />
            </div>
            <div className={styles.activityItemContent}>
              <div className={styles.activityItemTitle}>
                Nouvel emplacement ajouté
              </div>
              <div className={styles.activityItemDescription}>
                Parking Central de l'Hôtel Riviera
              </div>
              <div className={styles.activityItemTime}>Il y a 2 heures</div>
            </div>
          </li>

          <li className={styles.activityItem}>
            <div
              className={`${styles.activityItemIcon} ${styles.activityIconDanger}`}
            >
              <FiAlertCircle />
            </div>
            <div className={styles.activityItemContent}>
              <div className={styles.activityItemTitle}>
                Statut d'emplacement changé
              </div>
              <div className={styles.activityItemDescription}>
                Emplacement #42 passé à "En maintenance"
              </div>
              <div className={styles.activityItemTime}>Il y a 5 heures</div>
            </div>
          </li>

          <li className={styles.activityItem}>
            <div
              className={`${styles.activityItemIcon} ${styles.activityIconInfo}`}
            >
              <FiActivity />
            </div>
            <div className={styles.activityItemContent}>
              <div className={styles.activityItemTitle}>
                Rapport hebdomadaire généré
              </div>
              <div className={styles.activityItemDescription}>
                Rapport d'occupation pour la semaine 20
              </div>
              <div className={styles.activityItemTime}>Il y a 1 jour</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
