/**
 * hotels.js - Module pour la page de gestion des hôtels
 * Gère les fonctionnalités et l'affichage de la page des hôtels
 */

const Hotels = (function () {
  // Éléments DOM
  let hotelsTable;
  let addHotelBtn;
  let hotelForm;
  let hotelModal;
  let saveHotelBtn;

  // Tableau des hôtels
  let hotels = [];

  // Hôtel en cours d'édition
  let currentHotel = null;

  /**
   * Initialise la page des hôtels
   */
  const init = () => {
    // Récupération des éléments DOM
    hotelsTable = document.getElementById("hotels-table");
    addHotelBtn = document.getElementById("add-hotel-btn");
    hotelForm = document.getElementById("hotel-form");
    hotelModal = document.getElementById("hotel-modal");
    saveHotelBtn = document.getElementById("save-hotel-btn");

    // Gestionnaires d'événements
    addHotelBtn.addEventListener("click", openAddHotelModal);
    saveHotelBtn.addEventListener("click", saveHotel);

    // Écoute des événements de changement de page
    document.addEventListener("pageChanged", handlePageChange);

    // Écoute des événements de recherche globale
    document.addEventListener("globalSearch", handleGlobalSearch);
  };

  /**
   * Gère le changement de page
   * @param {CustomEvent} event - Événement de changement de page
   */
  const handlePageChange = (event) => {
    const { page } = event.detail;

    // Si la page active est la page des hôtels, on charge les données
    if (page === "hotels") {
      loadHotels();
    }
  };

  /**
   * Gère la recherche globale sur la page des hôtels
   * @param {CustomEvent} event - Événement de recherche globale
   */
  const handleGlobalSearch = (event) => {
    const { page, searchTerm } = event.detail;

    // Si la recherche concerne la page des hôtels
    if (page === "hotels") {
      searchHotels(searchTerm);
    }
  };

  /**
   * Charge la liste des hôtels
   */
  const loadHotels = async () => {
    try {
      // Affichage du loader dans le tableau
      if (hotelsTable) {
        const tbody = hotelsTable.querySelector("tbody");
        tbody.innerHTML =
          '<tr><td colspan="5" class="loading-row">Chargement des hôtels...</td></tr>';
      }

      // Récupération des hôtels depuis l'API
      hotels = await HotelsAPI.getAllHotels();

      // Affichage des hôtels dans le tableau
      renderHotelsTable(hotels);
    } catch (error) {
      console.error("Erreur lors du chargement des hôtels:", error);
      Notification.error(
        "Erreur de chargement",
        "Impossible de charger la liste des hôtels"
      );

      // Affichage d'un message d'erreur dans le tableau
      if (hotelsTable) {
        const tbody = hotelsTable.querySelector("tbody");
        tbody.innerHTML =
          '<tr><td colspan="5" class="loading-row">Erreur de chargement</td></tr>';
      }
    }
  };

  /**
   * Affiche les hôtels dans le tableau
   * @param {Array} hotelsList - Liste des hôtels à afficher
   */
  const renderHotelsTable = (hotelsList) => {
    if (!hotelsTable) return;

    const tbody = hotelsTable.querySelector("tbody");

    // Vérification si des hôtels sont disponibles
    if (!hotelsList || hotelsList.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="loading-row">Aucun hôtel trouvé</td></tr>';
      return;
    }

    // Génération des lignes du tableau
    tbody.innerHTML = "";

    hotelsList.forEach((hotel) => {
      const tr = document.createElement("tr");

      // Détermination du nombre de parkings
      const parkingsCount = hotel.parkings ? hotel.parkings.length : 0;

      tr.innerHTML = `
                <td>${hotel.id}</td>
                <td>${hotel.name}</td>
                <td>${hotel.address || "-"}</td>
                <td>${parkingsCount}</td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${
                      hotel.id
                    }" title="Voir les détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${
                      hotel.id
                    }" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${
                      hotel.id
                    }" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

      // Ajout des gestionnaires d'événements pour les actions
      const viewBtn = tr.querySelector(".view-btn");
      const editBtn = tr.querySelector(".edit-btn");
      const deleteBtn = tr.querySelector(".delete-btn");

      viewBtn.addEventListener("click", () => viewHotel(hotel.id));
      editBtn.addEventListener("click", () => openEditHotelModal(hotel.id));
      deleteBtn.addEventListener("click", () => confirmDeleteHotel(hotel.id));

      tbody.appendChild(tr);
    });
  };

  /**
   * Ouvre la modale d'ajout d'hôtel
   */
  const openAddHotelModal = () => {
    // Réinitialisation du formulaire
    hotelForm.reset();

    // Mise à jour du titre de la modale
    document.getElementById("hotel-modal-title").textContent =
      "Ajouter un hôtel";

    // Réinitialisation de l'hôtel en cours d'édition
    currentHotel = null;

    // Ouverture de la modale
    Modal.open("hotel-modal");
  };

  /**
   * Ouvre la modale d'édition d'hôtel
   * @param {Number} hotelId - ID de l'hôtel à éditer
   */
  const openEditHotelModal = async (hotelId) => {
    try {
      // Récupération des détails de l'hôtel
      const hotel = await HotelsAPI.getHotelById(hotelId);

      // Mise à jour de l'hôtel en cours d'édition
      currentHotel = hotel;

      // Mise à jour du formulaire
      document.getElementById("hotel-id").value = hotel.id;
      document.getElementById("hotel-name").value = hotel.name;
      document.getElementById("hotel-address").value = hotel.address || "";

      // Mise à jour du titre de la modale
      document.getElementById("hotel-modal-title").textContent =
        "Modifier un hôtel";

      // Ouverture de la modale
      Modal.open("hotel-modal");
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'hôtel:",
        error
      );
      Notification.error(
        "Erreur",
        "Impossible de récupérer les détails de l'hôtel"
      );
    }
  };

  /**
   * Enregistre un hôtel (création ou modification)
   */
  const saveHotel = async () => {
    try {
      // Validation du formulaire
      if (!hotelForm.checkValidity()) {
        hotelForm.reportValidity();
        return;
      }

      // Récupération des données du formulaire
      const hotelData = {
        name: document.getElementById("hotel-name").value,
        address: document.getElementById("hotel-address").value,
      };

      let result;

      // Création ou mise à jour selon le contexte
      if (currentHotel) {
        // Mise à jour d'un hôtel existant
        result = await HotelsAPI.updateHotel(currentHotel.id, hotelData);
        Notification.success(
          "Hôtel mis à jour",
          `L'hôtel "${result.name}" a été mis à jour avec succès`
        );
      } else {
        // Création d'un nouvel hôtel
        result = await HotelsAPI.createHotel(hotelData);
        Notification.success(
          "Hôtel créé",
          `L'hôtel "${result.name}" a été créé avec succès`
        );
      }

      // Fermeture de la modale
      Modal.close("hotel-modal");

      // Rechargement de la liste des hôtels
      loadHotels();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'hôtel:", error);
      Notification.error("Erreur", "Impossible d'enregistrer l'hôtel");
    }
  };

  /**
   * Affiche une confirmation avant de supprimer un hôtel
   * @param {Number} hotelId - ID de l'hôtel à supprimer
   */
  const confirmDeleteHotel = (hotelId) => {
    // Récupération de l'hôtel
    const hotel = hotels.find((h) => h.id === hotelId);

    if (!hotel) {
      Notification.error("Erreur", "Hôtel introuvable");
      return;
    }

    // Affichage de la confirmation
    Modal.confirm(
      "Supprimer un hôtel",
      `Êtes-vous sûr de vouloir supprimer l'hôtel "${hotel.name}" ? Cette action est irréversible.`,
      () => deleteHotel(hotelId),
      "Supprimer"
    );
  };

  /**
   * Supprime un hôtel
   * @param {Number} hotelId - ID de l'hôtel à supprimer
   */
  const deleteHotel = async (hotelId) => {
    try {
      // Récupération de l'hôtel
      const hotel = hotels.find((h) => h.id === hotelId);

      // Suppression de l'hôtel
      await HotelsAPI.deleteHotel(hotelId);

      // Notification
      Notification.success(
        "Hôtel supprimé",
        `L'hôtel "${hotel.name}" a été supprimé avec succès`
      );

      // Rechargement de la liste des hôtels
      loadHotels();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'hôtel:", error);
      Notification.error("Erreur", "Impossible de supprimer l'hôtel");
    }
  };

  /**
   * Affiche les détails d'un hôtel
   * @param {Number} hotelId - ID de l'hôtel à afficher
   */
  const viewHotel = async (hotelId) => {
    try {
      // Récupération des détails de l'hôtel
      const hotel = await HotelsAPI.getHotelById(hotelId);

      // Activation de la page des parkings avec filtrage par hôtel
      Sidebar.activatePage("parkings");

      // Notification
      Notification.info(
        "Navigation",
        `Affichage des parkings de l'hôtel "${hotel.name}"`
      );

      // Déclenchement d'un événement pour informer le module des parkings
      document.dispatchEvent(
        new CustomEvent("filterParkingsByHotel", {
          detail: { hotelId: hotel.id },
        })
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'hôtel:",
        error
      );
      Notification.error(
        "Erreur",
        "Impossible de récupérer les détails de l'hôtel"
      );
    }
  };

  /**
   * Recherche des hôtels selon un terme de recherche
   * @param {String} searchTerm - Terme de recherche
   */
  const searchHotels = (searchTerm) => {
    if (!searchTerm) {
      renderHotelsTable(hotels);
      return;
    }

    // Recherche dans la liste des hôtels déjà chargés
    const searchTermLower = searchTerm.toLowerCase();
    const filteredHotels = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(searchTermLower) ||
        (hotel.address && hotel.address.toLowerCase().includes(searchTermLower))
    );

    // Affichage des résultats
    renderHotelsTable(filteredHotels);

    // Notification du résultat
    Notification.info(
      "Recherche",
      `${filteredHotels.length} hôtel(s) trouvé(s) pour "${searchTerm}"`
    );
  };

  // Exposition de l'API publique
  return {
    init,
    loadHotels,
    openAddHotelModal,
    openEditHotelModal,
    viewHotel,
  };
})();

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", Hotels.init);

// Exportation pour utilisation dans les autres modules
window.Hotels = Hotels;
