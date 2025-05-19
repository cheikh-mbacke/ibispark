/**
 * dashboard.js - Module pour la page du tableau de bord
 * Gère les fonctionnalités et l'affichage du tableau de bord
 */

const Dashboard = (function () {
  // Éléments DOM
  let hotelsCount;
  let parkingsCount;
  let spotsCount;
  let occupancyRate;
  let activityList;
  let statusChart;

  // Instance Chart.js pour le graphique des statuts
  let statusChartInstance;
  let chartInitialized = false;

  /**
   * Vérifie si Chart.js est disponible et attend qu'il soit chargé si nécessaire
   * @param {Function} callback - Fonction à exécuter quand Chart est disponible
   */
  const ensureChartAvailable = (callback) => {
    if (typeof Chart !== "undefined") {
      // Chart.js est déjà chargé
      callback();
      return;
    }

    console.log("Chart.js pas encore chargé, attente...");

    // On attend un peu pour laisser le temps à Chart.js de se charger
    setTimeout(() => {
      if (typeof Chart !== "undefined") {
        callback();
      } else {
        console.error("Chart.js n'est pas chargé correctement après délai");
        if (statusChart) {
          statusChart.innerHTML =
            '<div class="error-message">Impossible de charger le graphique: Chart.js est indisponible</div>';
        }
      }
    }, 1000); // Attendre 1 seconde
  };

  /**
   * Initialise le tableau de bord
   */
  const init = () => {
    // Récupération des éléments DOM
    hotelsCount = document.getElementById("hotels-count");
    parkingsCount = document.getElementById("parkings-count");
    spotsCount = document.getElementById("spots-count");
    occupancyRate = document.getElementById("occupancy-rate");
    activityList = document.getElementById("recent-activity-list");
    statusChart = document.getElementById("status-chart");

    // Chargement des données du tableau de bord
    loadDashboardData();

    // Écoute des événements de changement de page
    document.addEventListener("pageChanged", handlePageChange);
  };

  /**
   * Gère le changement de page
   * @param {CustomEvent} event - Événement de changement de page
   */
  const handlePageChange = (event) => {
    const { page } = event.detail;

    // Si la page active est le tableau de bord, on recharge les données
    if (page === "dashboard") {
      loadDashboardData();
    }
  };

  /**
   * Charge les données du tableau de bord
   */
  const loadDashboardData = async () => {
    try {
      // Chargement des statistiques générales
      await loadStatistics();

      // Chargement du graphique de répartition des statuts
      loadStatusChart();

      // Simulation d'activités récentes (à remplacer par des données réelles)
      loadMockActivities();
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données du tableau de bord:",
        error
      );
      Notification.error(
        "Erreur de chargement",
        "Impossible de charger les données du tableau de bord"
      );
    }
  };

  /**
   * Charge les statistiques générales
   */
  const loadStatistics = async () => {
    try {
      // Récupération du nombre d'hôtels
      const hotels = await HotelsAPI.getAllHotels();
      if (hotelsCount) {
        hotelsCount.textContent = hotels.length;
      }

      // Récupération du nombre de parkings
      const parkings = await ParkingsAPI.getAllParkings();
      if (parkingsCount) {
        parkingsCount.textContent = parkings.length;
      }

      // Récupération du nombre d'emplacements
      const spots = await SpotsAPI.getAllSpots();
      if (spotsCount) {
        spotsCount.textContent = spots.length;
      }

      // Calcul du taux d'occupation (simulation pour l'instant)
      if (occupancyRate) {
        // Simulation d'un taux d'occupation
        const occupiedSpots = spots.filter((spot) => {
          return (
            spot.statuses &&
            spot.statuses.some(
              (s) => s.value === "already_in" || s.value === "arrival_today"
            )
          );
        }).length;

        const rate =
          spots.length > 0
            ? Math.round((occupiedSpots / spots.length) * 100)
            : 0;

        occupancyRate.textContent = `${rate}%`;
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      throw error;
    }
  };

  /**
   * Charge le graphique de répartition des statuts
   */
  const loadStatusChart = async () => {
    try {
      // Afficher un message de chargement
      if (statusChart) {
        statusChart.innerHTML =
          '<div class="loading-chart">Chargement du graphique... Cela peut prendre quelques instants.</div>';
      }

      // Récupération des statuts disponibles
      const statuses = await StatusAPI.getAllStatuses();

      // Récupération de tous les emplacements
      const spots = await SpotsAPI.getAllSpots();

      // Comptage des emplacements par statut
      const statusCounts = {};

      // Initialisation des compteurs pour chaque statut
      statuses.forEach((status) => {
        statusCounts[status.value] = 0;
      });

      // Comptage des emplacements
      spots.forEach((spot) => {
        if (spot.statuses && spot.statuses.length > 0) {
          spot.statuses.forEach((status) => {
            if (statusCounts[status.value] !== undefined) {
              statusCounts[status.value]++;
            }
          });
        } else {
          // Emplacements sans statut (libre)
          if (statusCounts["libre"] === undefined) {
            statusCounts["libre"] = 0;
          }
          statusCounts["libre"]++;
        }
      });

      // Préparation des données pour le graphique
      const chartData = {
        labels: [],
        values: [],
        colors: [],
      };

      Object.entries(statusCounts).forEach(([status, count]) => {
        if (status === "libre") {
          // Status 'libre' (sans statut spécifique)
          chartData.labels.push("Libre");
          chartData.values.push(count);
          chartData.colors.push("#4caf50"); // Vert pour les places libres
        } else {
          // Statuts définis
          const statusObj = statuses.find((s) => s.value === status);
          if (statusObj) {
            chartData.labels.push(statusObj.value.replace(/_/g, " "));
            chartData.values.push(count);
            chartData.colors.push(statusObj.color);
          }
        }
      });

      // Création ou mise à jour du graphique avec vérification que Chart est disponible
      ensureChartAvailable(() => renderStatusChart(chartData));
    } catch (error) {
      console.error(
        "Erreur lors du chargement du graphique de statuts:",
        error
      );
      if (statusChart) {
        statusChart.innerHTML = `<div class="error-message">Erreur: ${error.message}</div>`;
      }
    }
  };

  /**
   * Affiche le graphique de répartition des statuts
   * @param {Object} data - Données du graphique
   */
  const renderStatusChart = (data) => {
    if (!statusChart) return;

    // Vérification que Chart est disponible
    if (typeof Chart === "undefined") {
      console.error("Chart.js n'est pas chargé correctement");
      statusChart.innerHTML =
        '<div class="error-message">Impossible de charger le graphique: Chart.js est indisponible</div>';
      return;
    }

    try {
      // Nettoyage du conteneur
      statusChart.innerHTML = "";

      // Si le graphique existe déjà, on le détruit
      if (statusChartInstance) {
        statusChartInstance.destroy();
      }

      // Création d'un canvas pour le graphique
      const canvas = document.createElement("canvas");
      canvas.id = "status-chart-canvas";
      statusChart.appendChild(canvas);

      // Création du graphique avec Chart.js
      const ctx = canvas.getContext("2d");
      statusChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data.labels,
          datasets: [
            {
              data: data.values,
              backgroundColor: data.colors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 15,
                padding: 15,
              },
            },
            title: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.chart.data.datasets[0].data.reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });

      chartInitialized = true;
    } catch (error) {
      console.error("Erreur lors de la création du graphique:", error);
      statusChart.innerHTML = `<div class="error-message">Erreur lors de la création du graphique: ${error.message}</div>`;
    }
  };

  /**
   * Charge des activités récentes simulées
   * À remplacer par des données réelles dans le futur
   */
  const loadMockActivities = () => {
    if (!activityList) return;

    // Nettoyage de la liste
    activityList.innerHTML = "";

    // Activités simulées
    const activities = [
      {
        action: "Création d'un nouvel hôtel",
        entity: "Hôtel Grand Plaza",
        user: "Admin",
        date: new Date(Date.now() - 15 * 60000), // Il y a 15 minutes
      },
      {
        action: "Modification d'un parking",
        entity: "Parking Principal - Hôtel Grand Plaza",
        user: "Admin",
        date: new Date(Date.now() - 45 * 60000), // Il y a 45 minutes
      },
      {
        action: "Ajout d'un emplacement",
        entity: "Emplacement #12 - Parking Principal",
        user: "Admin",
        date: new Date(Date.now() - 2 * 3600000), // Il y a 2 heures
      },
      {
        action: "Changement de statut",
        entity: "Emplacement #5 - Parking Principal",
        user: "Admin",
        date: new Date(Date.now() - 3 * 3600000), // Il y a 3 heures
      },
      {
        action: "Suppression d'un emplacement",
        entity: "Emplacement #8 - Parking Extérieur",
        user: "Admin",
        date: new Date(Date.now() - 5 * 3600000), // Il y a 5 heures
      },
    ];

    // Ajout des activités à la liste
    activities.forEach((activity) => {
      const li = document.createElement("li");

      li.innerHTML = `
                <div>
                    <strong>${activity.action}</strong> - ${activity.entity}
                </div>
                <div>
                    <small>Par ${activity.user} - ${Formatter.formatDate(
        activity.date,
        "DD/MM/YYYY HH:mm"
      )}</small>
                </div>
            `;

      activityList.appendChild(li);
    });
  };

  // Exposition de l'API publique
  return {
    init,
    loadDashboardData,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", Dashboard.init);

// Exportation pour utilisation dans les autres modules
window.Dashboard = Dashboard;
