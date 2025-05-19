/**
 * spots-page.js - Module pour la page de gestion des emplacements
 * Gère les fonctionnalités et l'affichage de la page des emplacements
 * Ce fichier remplace assets/js/pages/spots.js
 */

const SpotsPage = (function () {
  // Éléments DOM
  let spotsTable;
  let addSpotBtn;
  let spotForm;
  let spotModal;
  let saveSpotBtn;
  let parkingFilter;
  let statusFilter;
  let typeFilter;

  // Tableau des emplacements, parkings et statuts
  let spots = [];
  let parkings = [];
  let statuses = [];
  let types = [];

  // Spot en cours d'édition
  let currentSpot = null;

  // Filtres actifs
  let activeFilters = {
    parkingId: null,
    statusId: null,
    typeId: null,
  };

  /**
   * Initialise la page des emplacements
   */
  const init = () => {
    // Récupération des éléments DOM
    spotsTable = document.getElementById("spots-table");
    addSpotBtn = document.getElementById("add-spot-btn");
    spotForm = document.getElementById("spot-form");
    spotModal = document.getElementById("spot-modal");
    saveSpotBtn = document.getElementById("save-spot-btn");
    parkingFilter = document.getElementById("parking-filter");
    statusFilter = document.getElementById("status-filter");
    typeFilter = document.getElementById("type-filter");

    // Initialisation des onglets du formulaire
    initFormTabs();

    // Gestionnaires d'événements
    addSpotBtn.addEventListener("click", openAddSpotModal);
    saveSpotBtn.addEventListener("click", saveSpot);

    // Gestionnaires pour les filtres
    if (parkingFilter) {
      parkingFilter.addEventListener("change", handleParkingFilterChange);
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", handleStatusFilterChange);
    }

    if (typeFilter) {
      typeFilter.addEventListener("change", handleTypeFilterChange);
    }

    // Écoute des événements de changement de page
    document.addEventListener("pageChanged", handlePageChange);

    // Écoute des événements de recherche globale
    document.addEventListener("globalSearch", handleGlobalSearch);

    // Écoute des événements de filtrage par parking (depuis la page des parkings)
    document.addEventListener("filterSpotsByParking", handleFilterByParking);
  };

  /**
   * Initialise les onglets du formulaire d'ajout/édition d'emplacement
   */
  const initFormTabs = () => {
    const tabItems = document.querySelectorAll(".tab-item");

    tabItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Retrait de la classe active sur tous les onglets
        tabItems.forEach((tab) => tab.classList.remove("active"));

        // Ajout de la classe active sur l'onglet cliqué
        item.classList.add("active");

        // Affichage du contenu de l'onglet
        const tabId = item.getAttribute("data-tab");
        const tabContent = document.querySelectorAll(".tab-pane");

        tabContent.forEach((content) => {
          content.classList.remove("active");

          if (content.id === `${tabId}-tab`) {
            content.classList.add("active");
          }
        });
      });
    });
  };

  /**
   * Gère le changement de page
   * @param {CustomEvent} event - Événement de changement de page
   */
  const handlePageChange = (event) => {
    const { page } = event.detail;

    // Si la page active est la page des emplacements, on charge les données
    if (page === "spots") {
      loadFilters().then(() => loadSpots());
    }
  };

  /**
   * Gère la recherche globale sur la page des emplacements
   * @param {CustomEvent} event - Événement de recherche globale
   */
  const handleGlobalSearch = (event) => {
    const { page, searchTerm } = event.detail;

    // Si la recherche concerne la page des emplacements
    if (page === "spots") {
      searchSpots(searchTerm);
    }
  };

  /**
   * Gère le filtrage par parking depuis la page des parkings
   * @param {CustomEvent} event - Événement de filtrage
   */
  const handleFilterByParking = (event) => {
    const { parkingId } = event.detail;

    // Mise à jour du filtre actif
    activeFilters.parkingId = parkingId;

    // Mise à jour du sélecteur de filtre
    if (parkingFilter) {
      parkingFilter.value = parkingId;
    }

    // Rechargement des emplacements avec le filtre
    loadSpots();
  };

  /**
   * Gère le changement du filtre par parking
   */
  const handleParkingFilterChange = () => {
    // Mise à jour du filtre actif
    activeFilters.parkingId = parkingFilter.value
      ? parseInt(parkingFilter.value)
      : null;

    // Rechargement des emplacements avec le filtre
    loadSpots();
  };

  /**
   * Gère le changement du filtre par statut
   */
  const handleStatusFilterChange = () => {
    // Mise à jour du filtre actif
    activeFilters.statusId = statusFilter.value
      ? parseInt(statusFilter.value)
      : null;

    // Rechargement des emplacements avec le filtre
    loadSpots();
  };

  /**
   * Gère le changement du filtre par type
   */
  const handleTypeFilterChange = () => {
    // Mise à jour du filtre actif
    activeFilters.typeId = typeFilter.value ? parseInt(typeFilter.value) : null;

    // Rechargement des emplacements avec le filtre
    loadSpots();
  };

  /**
   * Charge les données pour les filtres (parkings, statuts, types)
   */
  const loadFilters = async () => {
    try {
      // Chargement des parkings
      parkings = await ParkingsAPI.getAllParkings();

      // Mise à jour du filtre par parking
      if (parkingFilter) {
        // Sauvegarde de la valeur actuelle
        const currentValue = parkingFilter.value;

        // Nettoyage des options existantes (sauf la première)
        while (parkingFilter.options.length > 1) {
          parkingFilter.remove(1);
        }

        // Ajout des options pour chaque parking
        parkings.forEach((parking) => {
          const option = document.createElement("option");
          option.value = parking.id;
          option.textContent = parking.name;
          parkingFilter.appendChild(option);
        });

        // Restauration de la valeur précédente si possible
        if (
          currentValue &&
          parkings.some((p) => p.id === parseInt(currentValue))
        ) {
          parkingFilter.value = currentValue;
        }
      }

      // Chargement des statuts
      statuses = await StatusAPI.getAllStatuses();

      // Mise à jour du filtre par statut
      if (statusFilter) {
        // Sauvegarde de la valeur actuelle
        const currentValue = statusFilter.value;

        // Nettoyage des options existantes (sauf la première)
        while (statusFilter.options.length > 1) {
          statusFilter.remove(1);
        }

        // Ajout des options pour chaque statut
        statuses.forEach((status) => {
          const option = document.createElement("option");
          option.value = status.id;
          option.textContent = status.value.replace(/_/g, " ");
          option.style.color = status.color;
          statusFilter.appendChild(option);
        });

        // Restauration de la valeur précédente si possible
        if (
          currentValue &&
          statuses.some((s) => s.id === parseInt(currentValue))
        ) {
          statusFilter.value = currentValue;
        }
      }

      // Chargement des types d'emplacement
      types = await StatusAPI.getAllTypes();

      // Mise à jour du filtre par type
      if (typeFilter) {
        // Sauvegarde de la valeur actuelle
        const currentValue = typeFilter.value;

        // Nettoyage des options existantes (sauf la première)
        while (typeFilter.options.length > 1) {
          typeFilter.remove(1);
        }

        // Ajout des options pour chaque type
        types.forEach((type) => {
          const option = document.createElement("option");
          option.value = type.id;
          option.textContent = type.label;
          typeFilter.appendChild(option);
        });

        // Restauration de la valeur précédente si possible
        if (
          currentValue &&
          types.some((t) => t.id === parseInt(currentValue))
        ) {
          typeFilter.value = currentValue;
        }
      }

      // Mise à jour des sélecteurs pour le formulaire
      updateParkingSelect();
      updateTypesCheckboxes();
    } catch (error) {
      console.error("Erreur lors du chargement des filtres:", error);
      Notification.error(
        "Erreur de chargement",
        "Impossible de charger les filtres"
      );
    }
  };

  /**
   * Charge la liste des emplacements
   */
  const loadSpots = async () => {
    try {
      // Affichage du loader dans le tableau
      if (spotsTable) {
        const tbody = spotsTable.querySelector("tbody");
        tbody.innerHTML =
          '<tr><td colspan="7" class="loading-row">Chargement des emplacements...</td></tr>';
      }

      // Récupération des emplacements depuis l'API
      spots = await SpotsAPI.getAllSpots();

      // Filtrage côté client si des filtres sont actifs
      let filteredSpots = [...spots];

      // Filtre par parking
      if (activeFilters.parkingId) {
        filteredSpots = filteredSpots.filter(
          (spot) => spot.parking_id === activeFilters.parkingId
        );
      }

      // Filtre par statut
      if (activeFilters.statusId) {
        filteredSpots = filteredSpots.filter(
          (spot) =>
            spot.statuses &&
            spot.statuses.some((s) => s.id === activeFilters.statusId)
        );
      }

      // Filtre par type
      if (activeFilters.typeId) {
        filteredSpots = filteredSpots.filter(
          (spot) =>
            spot.types && spot.types.some((t) => t.id === activeFilters.typeId)
        );
      }

      // Affichage des emplacements dans le tableau
      renderSpotsTable(filteredSpots);
    } catch (error) {
      console.error("Erreur lors du chargement des emplacements:", error);
      Notification.error(
        "Erreur de chargement",
        "Impossible de charger la liste des emplacements"
      );

      // Affichage d'un message d'erreur dans le tableau
      if (spotsTable) {
        const tbody = spotsTable.querySelector("tbody");
        tbody.innerHTML =
          '<tr><td colspan="7" class="loading-row">Erreur de chargement</td></tr>';
      }
    }
  };

  /**
   * Met à jour le sélecteur de parking dans le formulaire
   */
  const updateParkingSelect = () => {
    const parkingSelect = document.getElementById("spot-parking");

    if (parkingSelect) {
      // Sauvegarde de la valeur actuelle
      const currentValue = parkingSelect.value;

      // Nettoyage des options existantes (sauf la première)
      while (parkingSelect.options.length > 1) {
        parkingSelect.remove(1);
      }

      // Ajout des options pour chaque parking
      parkings.forEach((parking) => {
        const option = document.createElement("option");
        option.value = parking.id;
        option.textContent = parking.name;
        parkingSelect.appendChild(option);
      });

      // Restauration de la valeur précédente si possible
      if (
        currentValue &&
        parkings.some((p) => p.id === parseInt(currentValue))
      ) {
        parkingSelect.value = currentValue;
      }
    }
  };

  /**
   * Met à jour les cases à cocher des types dans le formulaire
   */
  const updateTypesCheckboxes = () => {
    const typesGroup = document.getElementById("spot-types-group");

    if (typesGroup) {
      // Nettoyage des cases à cocher existantes
      typesGroup.innerHTML = "";

      // Ajout des cases à cocher pour chaque type
      types.forEach((type) => {
        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "checkbox-wrapper";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `spot-type-${type.id}`;
        checkbox.name = `spot-type-${type.id}`;
        checkbox.value = type.id;

        const label = document.createElement("label");
        label.htmlFor = `spot-type-${type.id}`;
        label.textContent = type.label;

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        typesGroup.appendChild(checkboxWrapper);
      });
    }
  };

  /**
   * Affiche les emplacements dans le tableau
   * @param {Array} spotsList - Liste des emplacements à afficher
   */
  const renderSpotsTable = (spotsList) => {
    if (!spotsTable) return;

    const tbody = spotsTable.querySelector("tbody");

    // Vérification si des emplacements sont disponibles
    if (!spotsList || spotsList.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="loading-row">Aucun emplacement trouvé</td></tr>';
      return;
    }

    // Génération des lignes du tableau
    tbody.innerHTML = "";

    spotsList.forEach((spot) => {
      const tr = document.createElement("tr");

      // Récupération du nom du parking associé
      const parking = parkings.find((p) => p.id === spot.parking_id);
      const parkingName = parking
        ? parking.name
        : `Parking #${spot.parking_id}`;

      // Récupération des statuts de l'emplacement
      const statusTags =
        spot.statuses && spot.statuses.length > 0
          ? spot.statuses
              .map(
                (status) =>
                  `<span class="status-tag" style="background-color: ${
                    status.color
                  }">${status.value.replace(/_/g, " ")}</span>`
              )
              .join("")
          : '<span class="status-tag free">Libre</span>';

      tr.innerHTML = `
              <td>${spot.number}</td>
              <td>${
                spot.types
                  ? spot.types.map((t) => t.value).join(", ")
                  : "Standard"
              }</td>
              <td>${parkingName}</td>
              <td>${spot.floor || "-"}</td>
              <td>${spot.section || "-"}</td>
              <td>${statusTags}</td>
              <td class="actions">
                  <button class="action-btn view-btn" data-id="${
                    spot.id
                  }" title="Voir les détails">
                      <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-btn edit-btn" data-id="${
                    spot.id
                  }" title="Modifier">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete-btn" data-id="${
                    spot.id
                  }" title="Supprimer">
                      <i class="fas fa-trash"></i>
                  </button>
              </td>
          `;

      // Ajout des gestionnaires d'événements pour les actions
      const viewBtn = tr.querySelector(".view-btn");
      const editBtn = tr.querySelector(".edit-btn");
      const deleteBtn = tr.querySelector(".delete-btn");

      viewBtn.addEventListener("click", () => viewSpot(spot.id));
      editBtn.addEventListener("click", () => openEditSpotModal(spot.id));
      deleteBtn.addEventListener("click", () => confirmDeleteSpot(spot.id));

      tbody.appendChild(tr);
    });
  };

  /**
   * Ouvre la modale d'ajout d'emplacement
   */
  const openAddSpotModal = () => {
    // Réinitialisation du formulaire
    spotForm.reset();

    // Activation du premier onglet
    const firstTab = document.querySelector('.tab-item[data-tab="general"]');
    if (firstTab) {
      firstTab.click();
    }

    // Mise à jour du titre de la modale
    document.getElementById("spot-modal-title").textContent =
      "Ajouter un emplacement";

    // Réinitialisation de l'emplacement en cours d'édition
    currentSpot = null;

    // Pré-sélection du parking si un filtre est actif
    if (activeFilters.parkingId) {
      const parkingSelect = document.getElementById("spot-parking");
      if (parkingSelect) {
        parkingSelect.value = activeFilters.parkingId;
      }
    }

    // Ouverture de la modale
    Modal.open("spot-modal");
  };

  /**
   * Ouvre la modale d'édition d'emplacement
   * @param {Number} spotId - ID de l'emplacement à éditer
   */
  const openEditSpotModal = async (spotId) => {
    try {
      // Récupération des détails de l'emplacement
      const spot = await SpotsAPI.getSpotById(spotId);

      // Mise à jour de l'emplacement en cours d'édition
      currentSpot = spot;

      // Activation du premier onglet
      const firstTab = document.querySelector('.tab-item[data-tab="general"]');
      if (firstTab) {
        firstTab.click();
      }

      // Mise à jour du formulaire - onglet Général
      document.getElementById("spot-id").value = spot.id;
      document.getElementById("spot-parking").value = spot.parking_id;
      document.getElementById("spot-number").value = spot.number;

      // Mise à jour des types sélectionnés
      if (spot.types) {
        spot.types.forEach((type) => {
          const checkbox = document.getElementById(`spot-type-${type.id}`);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      }

      // Mise à jour du formulaire - onglet Dimensions
      document.getElementById("spot-length").value = spot.length || "";
      document.getElementById("spot-width").value = spot.width || "";
      document.getElementById("spot-height").value = spot.height || "";
      document.getElementById("spot-surface").value = spot.surface || "";

      // Mise à jour du formulaire - onglet Localisation
      document.getElementById("spot-floor").value = spot.floor || "";
      document.getElementById("spot-section").value = spot.section || "";
      document.getElementById("spot-address").value = spot.address || "";

      // Mise à jour du formulaire - onglet Équipement
      document.getElementById("spot-electric").checked =
        spot.electric_charging || false;
      document.getElementById("spot-camera").checked = spot.camera || false;
      document.getElementById("spot-sensor").checked = spot.sensor || false;

      // Mise à jour du formulaire - onglet Tarification
      document.getElementById("spot-hourly-rate").value =
        spot.hourly_rate || "";
      document.getElementById("spot-daily-rate").value = spot.daily_rate || "";
      document.getElementById("spot-monthly-rate").value =
        spot.monthly_rate || "";

      // Mise à jour du titre de la modale
      document.getElementById("spot-modal-title").textContent =
        "Modifier un emplacement";

      // Ouverture de la modale
      Modal.open("spot-modal");
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'emplacement:",
        error
      );
      Notification.error(
        "Erreur",
        "Impossible de récupérer les détails de l'emplacement"
      );
    }
  };

  /**
   * Enregistre un emplacement (création ou modification)
   */
  const saveSpot = async () => {
    try {
      // Validation du formulaire
      if (!spotForm.checkValidity()) {
        spotForm.reportValidity();
        return;
      }

      // Récupération des données du formulaire
      const spotData = {
        number: parseInt(document.getElementById("spot-number").value),
        floor: parseInt(document.getElementById("spot-floor").value),
        section: document.getElementById("spot-section").value,
        length: parseFloat(document.getElementById("spot-length").value),
        width: parseFloat(document.getElementById("spot-width").value),
        height: parseFloat(document.getElementById("spot-height").value),
        surface: parseFloat(document.getElementById("spot-surface").value),
        address: document.getElementById("spot-address").value,
        electric_charging: document.getElementById("spot-electric").checked,
        camera: document.getElementById("spot-camera").checked,
        sensor: document.getElementById("spot-sensor").checked,
        hourly_rate: parseFloat(
          document.getElementById("spot-hourly-rate").value
        ),
        daily_rate: parseFloat(
          document.getElementById("spot-daily-rate").value
        ),
        monthly_rate: parseFloat(
          document.getElementById("spot-monthly-rate").value
        ),
        types: [],
      };

      // Récupération des types sélectionnés
      types.forEach((type) => {
        const checkbox = document.getElementById(`spot-type-${type.id}`);
        if (checkbox && checkbox.checked) {
          spotData.types.push(type.id);
        }
      });

      let result;

      // Création ou mise à jour selon le contexte
      if (currentSpot) {
        // Mise à jour d'un emplacement existant
        result = await SpotsAPI.updateSpot(currentSpot.id, spotData);
        Notification.success(
          "Emplacement mis à jour",
          `L'emplacement #${result.number} a été mis à jour avec succès`
        );
      } else {
        // Création d'un nouvel emplacement
        const parkingId = parseInt(
          document.getElementById("spot-parking").value
        );
        result = await SpotsAPI.createSpot(parkingId, spotData);
        Notification.success(
          "Emplacement créé",
          `L'emplacement #${result.number} a été créé avec succès`
        );
      }

      // Fermeture de la modale
      Modal.close("spot-modal");

      // Rechargement de la liste des emplacements
      loadSpots();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'emplacement:", error);
      Notification.error("Erreur", "Impossible d'enregistrer l'emplacement");
    }
  };

  /**
   * Affiche une confirmation avant de supprimer un emplacement
   * @param {Number} spotId - ID de l'emplacement à supprimer
   */
  const confirmDeleteSpot = (spotId) => {
    // Récupération de l'emplacement
    const spot = spots.find((s) => s.id === spotId);

    if (!spot) {
      Notification.error("Erreur", "Emplacement introuvable");
      return;
    }

    // Récupération du parking associé
    const parking = parkings.find((p) => p.id === spot.parking_id);
    const parkingName = parking ? parking.name : `Parking #${spot.parking_id}`;

    // Affichage de la confirmation
    Modal.confirm(
      "Supprimer un emplacement",
      `Êtes-vous sûr de vouloir supprimer l'emplacement #${spot.number} du parking "${parkingName}" ? Cette action est irréversible.`,
      () => deleteSpot(spotId),
      "Supprimer"
    );
  };

  /**
   * Supprime un emplacement
   * @param {Number} spotId - ID de l'emplacement à supprimer
   */
  const deleteSpot = async (spotId) => {
    try {
      // Récupération de l'emplacement
      const spot = spots.find((s) => s.id === spotId);

      // Suppression de l'emplacement
      await SpotsAPI.deleteSpot(spotId);

      // Notification
      Notification.success(
        "Emplacement supprimé",
        `L'emplacement #${spot.number} a été supprimé avec succès`
      );

      // Rechargement de la liste des emplacements
      loadSpots();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'emplacement:", error);
      Notification.error("Erreur", "Impossible de supprimer l'emplacement");
    }
  };

  /**
   * Affiche les détails d'un emplacement
   * @param {Number} spotId - ID de l'emplacement à afficher
   */
  const viewSpot = async (spotId) => {
    try {
      // Récupération des détails de l'emplacement
      const spot = await SpotsAPI.getSpotById(spotId);

      // Récupération du parking associé
      const parking = parkings.find((p) => p.id === spot.parking_id);
      const parkingName = parking
        ? parking.name
        : `Parking #${spot.parking_id}`;

      // Compilation des informations
      const info = `
              <div class="spot-details">
                  <h3>Emplacement #${spot.number}</h3>
                  <p><strong>Parking:</strong> ${parkingName}</p>
                  <p><strong>Étage/Section:</strong> ${spot.floor || "-"}/${
        spot.section || "-"
      }</p>
                  <p><strong>Dimensions:</strong> ${spot.length || "-"} × ${
        spot.width || "-"
      } × ${spot.height || "-"} m</p>
                  <p><strong>Équipements:</strong> 
                      ${spot.electric_charging ? "Borne électrique, " : ""}
                      ${spot.camera ? "Caméra, " : ""}
                      ${spot.sensor ? "Capteur" : ""}
                      ${
                        !spot.electric_charging && !spot.camera && !spot.sensor
                          ? "Aucun"
                          : ""
                      }
                  </p>
                  <p><strong>Tarifs:</strong> 
                      ${spot.hourly_rate ? `${spot.hourly_rate}€/h, ` : ""}
                      ${spot.daily_rate ? `${spot.daily_rate}€/j, ` : ""}
                      ${spot.monthly_rate ? `${spot.monthly_rate}€/mois` : ""}
                  </p>
              </div>
          `;

      // Affichage des détails dans une notification ou une modale
      Notification.info(`Emplacement #${spot.number}`, info, 0);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'emplacement:",
        error
      );
      Notification.error(
        "Erreur",
        "Impossible de récupérer les détails de l'emplacement"
      );
    }
  };

  /**
   * Recherche des emplacements selon un terme de recherche
   * @param {String} searchTerm - Terme de recherche
   */
  const searchSpots = (searchTerm) => {
    if (!searchTerm) {
      loadSpots(); // Recharge tous les emplacements sans filtre
      return;
    }

    // Recherche dans la liste des emplacements déjà chargés
    const searchTermLower = searchTerm.toLowerCase();
    const filteredSpots = spots.filter((spot) => {
      // Recherche par numéro d'emplacement
      if (spot.number.toString().includes(searchTermLower)) {
        return true;
      }

      // Recherche par étage ou section
      if (
        (spot.floor && spot.floor.toString().includes(searchTermLower)) ||
        (spot.section && spot.section.toLowerCase().includes(searchTermLower))
      ) {
        return true;
      }

      // Recherche par statut
      if (
        spot.statuses &&
        spot.statuses.some((s) =>
          s.value.toLowerCase().includes(searchTermLower)
        )
      ) {
        return true;
      }

      // Recherche par type
      if (
        spot.types &&
        spot.types.some((t) => t.value.toLowerCase().includes(searchTermLower))
      ) {
        return true;
      }

      // Recherche par parking
      const parking = parkings.find((p) => p.id === spot.parking_id);
      if (parking && parking.name.toLowerCase().includes(searchTermLower)) {
        return true;
      }

      return false;
    });

    // Affichage des résultats
    renderSpotsTable(filteredSpots);

    // Notification du résultat
    Notification.info(
      "Recherche",
      `${filteredSpots.length} emplacement(s) trouvé(s) pour "${searchTerm}"`
    );
  };

  // Exposition de l'API publique
  return {
    init,
    loadSpots,
    openAddSpotModal,
    openEditSpotModal,
    viewSpot,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", SpotsPage.init);

// Exportation pour utilisation dans les autres modules
window.SpotsPage = SpotsPage;
