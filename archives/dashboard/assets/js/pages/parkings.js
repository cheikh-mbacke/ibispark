/**
 * parkings.js - Module pour la page de gestion des parkings
 * Gère les fonctionnalités et l'affichage de la page des parkings
 */

const Parkings = (function() {
    // Éléments DOM
    let parkingsTable;
    let addParkingBtn;
    let parkingForm;
    let parkingModal;
    let saveParkingBtn;
    let hotelFilter;
    
    // Tableau des parkings et hôtels
    let parkings = [];
    let hotels = [];
    
    // Parking en cours d'édition
    let currentParking = null;
    
    // Filtres actifs
    let activeFilters = {
        hotelId: null
    };
    
    /**
     * Initialise la page des parkings
     */
    const init = () => {
        // Récupération des éléments DOM
        parkingsTable = document.getElementById('parkings-table');
        addParkingBtn = document.getElementById('add-parking-btn');
        parkingForm = document.getElementById('parking-form');
        parkingModal = document.getElementById('parking-modal');
        saveParkingBtn = document.getElementById('save-parking-btn');
        hotelFilter = document.getElementById('hotel-filter');
        
        // Gestionnaires d'événements
        addParkingBtn.addEventListener('click', openAddParkingModal);
        saveParkingBtn.addEventListener('click', saveParking);
        
        // Gestionnaire pour le filtre par hôtel
        if (hotelFilter) {
            hotelFilter.addEventListener('change', handleHotelFilterChange);
        }
        
        // Écoute des événements de changement de page
        document.addEventListener('pageChanged', handlePageChange);
        
        // Écoute des événements de recherche globale
        document.addEventListener('globalSearch', handleGlobalSearch);
        
        // Écoute des événements de filtrage par hôtel (depuis la page des hôtels)
        document.addEventListener('filterParkingsByHotel', handleFilterByHotel);
    };
    
    /**
     * Gère le changement de page
     * @param {CustomEvent} event - Événement de changement de page
     */
    const handlePageChange = (event) => {
        const { page } = event.detail;
        
        // Si la page active est la page des parkings, on charge les données
        if (page === 'parkings') {
            loadHotels().then(() => loadParkings());
        }
    };
    
    /**
     * Gère la recherche globale sur la page des parkings
     * @param {CustomEvent} event - Événement de recherche globale
     */
    const handleGlobalSearch = (event) => {
        const { page, searchTerm } = event.detail;
        
        // Si la recherche concerne la page des parkings
        if (page === 'parkings') {
            searchParkings(searchTerm);
        }
    };
    
    /**
     * Gère le filtrage par hôtel depuis la page des hôtels
     * @param {CustomEvent} event - Événement de filtrage
     */
    const handleFilterByHotel = (event) => {
        const { hotelId } = event.detail;
        
        // Mise à jour du filtre actif
        activeFilters.hotelId = hotelId;
        
        // Mise à jour du sélecteur de filtre
        if (hotelFilter) {
            hotelFilter.value = hotelId;
        }
        
        // Rechargement des parkings avec le filtre
        loadParkings();
    };
    
    /**
     * Gère le changement du filtre par hôtel
     */
    const handleHotelFilterChange = () => {
        // Mise à jour du filtre actif
        activeFilters.hotelId = hotelFilter.value ? parseInt(hotelFilter.value) : null;
        
        // Rechargement des parkings avec le filtre
        loadParkings();
    };
    
    /**
     * Charge la liste des hôtels pour le filtre et le formulaire
     */
    const loadHotels = async () => {
        try {
            // Récupération des hôtels depuis l'API
            hotels = await HotelsAPI.getAllHotels();
            
            // Mise à jour du filtre par hôtel
            if (hotelFilter) {
                // Sauvegarde de la valeur actuelle
                const currentValue = hotelFilter.value;
                
                // Nettoyage des options existantes (sauf la première)
                while (hotelFilter.options.length > 1) {
                    hotelFilter.remove(1);
                }
                
                // Ajout des options pour chaque hôtel
                hotels.forEach(hotel => {
                    const option = document.createElement('option');
                    option.value = hotel.id;
                    option.textContent = hotel.name;
                    hotelFilter.appendChild(option);
                });
                
                // Restauration de la valeur précédente si possible
                if (currentValue && hotels.some(h => h.id === parseInt(currentValue))) {
                    hotelFilter.value = currentValue;
                }
            }
            
            // Mise à jour de la liste des hôtels dans le formulaire d'ajout/édition
            updateHotelSelect();
        } catch (error) {
            console.error('Erreur lors du chargement des hôtels:', error);
            Notification.error(
                'Erreur de chargement',
                'Impossible de charger la liste des hôtels'
            );
        }
    };
    
    /**
     * Met à jour le sélecteur d'hôtel dans le formulaire
     */
    const updateHotelSelect = () => {
        const hotelSelect = document.getElementById('parking-hotel');
        
        if (hotelSelect) {
            // Sauvegarde de la valeur actuelle
            const currentValue = hotelSelect.value;
            
            // Nettoyage des options existantes (sauf la première)
            while (hotelSelect.options.length > 1) {
                hotelSelect.remove(1);
            }
            
            // Ajout des options pour chaque hôtel
            hotels.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel.id;
                option.textContent = hotel.name;
                hotelSelect.appendChild(option);
            });
            
            // Restauration de la valeur précédente si possible
            if (currentValue && hotels.some(h => h.id === parseInt(currentValue))) {
                hotelSelect.value = currentValue;
            }
        }
    };
    
    /**
     * Charge la liste des parkings
     */
    const loadParkings = async () => {
        try {
            // Affichage du loader dans le tableau
            if (parkingsTable) {
                const tbody = parkingsTable.querySelector('tbody');
                tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Chargement des parkings...</td></tr>';
            }
            
            // Récupération des parkings depuis l'API avec filtrage éventuel
            parkings = await ParkingsAPI.getAllParkings();
            
            // Filtrage côté client si un filtre est actif
            if (activeFilters.hotelId) {
                parkings = parkings.filter(parking => parking.hotel_id === activeFilters.hotelId);
            }
            
            // Affichage des parkings dans le tableau
            renderParkingsTable(parkings);
        } catch (error) {
            console.error('Erreur lors du chargement des parkings:', error);
            Notification.error(
                'Erreur de chargement',
                'Impossible de charger la liste des parkings'
            );
            
            // Affichage d'un message d'erreur dans le tableau
            if (parkingsTable) {
                const tbody = parkingsTable.querySelector('tbody');
                tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Erreur de chargement</td></tr>';
            }
        }
    };
    
    /**
     * Affiche les parkings dans le tableau
     * @param {Array} parkingsList - Liste des parkings à afficher
     */
    const renderParkingsTable = (parkingsList) => {
        if (!parkingsTable) return;
        
        const tbody = parkingsTable.querySelector('tbody');
        
        // Vérification si des parkings sont disponibles
        if (!parkingsList || parkingsList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Aucun parking trouvé</td></tr>';
            return;
        }
        
        // Génération des lignes du tableau
        tbody.innerHTML = '';
        
        parkingsList.forEach(parking => {
            const tr = document.createElement('tr');
            
            // Récupération du nom de l'hôtel associé
            const hotel = hotels.find(h => h.id === parking.hotel_id);
            const hotelName = hotel ? hotel.name : `Hôtel #${parking.hotel_id}`;
            
            tr.innerHTML = `
                <td>${parking.id}</td>
                <td>${parking.name}</td>
                <td>${hotelName}</td>
                <td>${parking.location || '-'}</td>
                <td>${parking.total_capacity || 0}</td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${parking.id}" title="Voir les détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${parking.id}" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${parking.id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // Ajout des gestionnaires d'événements pour les actions
            const viewBtn = tr.querySelector('.view-btn');
            const editBtn = tr.querySelector('.edit-btn');
            const deleteBtn = tr.querySelector('.delete-btn');
            
            viewBtn.addEventListener('click', () => viewParking(parking.id));
            editBtn.addEventListener('click', () => openEditParkingModal(parking.id));
            deleteBtn.addEventListener('click', () => confirmDeleteParking(parking.id));
            
            tbody.appendChild(tr);
        });
    };
    
    /**
     * Ouvre la modale d'ajout de parking
     */
    const openAddParkingModal = () => {
        // Réinitialisation du formulaire
        parkingForm.reset();
        
        // Mise à jour du titre de la modale
        document.getElementById('parking-modal-title').textContent = 'Ajouter un parking';
        
        // Réinitialisation du parking en cours d'édition
        currentParking = null;
        
        // Pré-sélection de l'hôtel si un filtre est actif
        if (activeFilters.hotelId) {
            const hotelSelect = document.getElementById('parking-hotel');
            if (hotelSelect) {
                hotelSelect.value = activeFilters.hotelId;
            }
        }
        
        // Ouverture de la modale
        Modal.open('parking-modal');
    };
    
    /**
     * Ouvre la modale d'édition de parking
     * @param {Number} parkingId - ID du parking à éditer
     */
    const openEditParkingModal = async (parkingId) => {
        try {
            // Récupération des détails du parking
            const parking = await ParkingsAPI.getParkingById(parkingId);
            
            // Mise à jour du parking en cours d'édition
            currentParking = parking;
            
            // Mise à jour du formulaire
            document.getElementById('parking-id').value = parking.id;
            document.getElementById('parking-hotel').value = parking.hotel_id;
            document.getElementById('parking-name').value = parking.name;
            document.getElementById('parking-description').value = parking.description || '';
            document.getElementById('parking-location').value = parking.location || '';
            
            // Mise à jour du titre de la modale
            document.getElementById('parking-modal-title').textContent = 'Modifier un parking';
            
            // Ouverture de la modale
            Modal.open('parking-modal');
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du parking:', error);
            Notification.error(
                'Erreur',
                'Impossible de récupérer les détails du parking'
            );
        }
    };
    
    /**
     * Enregistre un parking (création ou modification)
     */
    const saveParking = async () => {
        try {
            // Validation du formulaire
            if (!parkingForm.checkValidity()) {
                parkingForm.reportValidity();
                return;
            }
            
            // Récupération des données du formulaire
            const parkingData = {
                name: document.getElementById('parking-name').value,
                description: document.getElementById('parking-description').value,
                location: document.getElementById('parking-location').value,
            };
            
            let result;
            
            // Création ou mise à jour selon le contexte
            if (currentParking) {
                // Mise à jour d'un parking existant
                result = await ParkingsAPI.updateParking(currentParking.id, parkingData);
                Notification.success(
                    'Parking mis à jour',
                    `Le parking "${result.name}" a été mis à jour avec succès`
                );
            } else {
                // Création d'un nouveau parking
                const hotelId = parseInt(document.getElementById('parking-hotel').value);
                result = await ParkingsAPI.createParking(hotelId, parkingData);
                Notification.success(
                    'Parking créé',
                    `Le parking "${result.name}" a été créé avec succès`
                );
            }
            
            // Fermeture de la modale
            Modal.close('parking-modal');
            
            // Rechargement de la liste des parkings
            loadParkings();
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du parking:', error);
            Notification.error(
                'Erreur',
                'Impossible d\'enregistrer le parking'
            );
        }
    };
    
    /**
     * Affiche une confirmation avant de supprimer un parking
     * @param {Number} parkingId - ID du parking à supprimer
     */
    const confirmDeleteParking = (parkingId) => {
        // Récupération du parking
        const parking = parkings.find(p => p.id === parkingId);
        
        if (!parking) {
            Notification.error(
                'Erreur',
                'Parking introuvable'
            );
            return;
        }
        
        // Affichage de la confirmation
        Modal.confirm(
            'Supprimer un parking',
            `Êtes-vous sûr de vouloir supprimer le parking "${parking.name}" ? Cette action est irréversible.`,
            () => deleteParking(parkingId),
            'Supprimer'
        );
    };
    
    /**
     * Supprime un parking
     * @param {Number} parkingId - ID du parking à supprimer
     */
    const deleteParking = async (parkingId) => {
        try {
            // Récupération du parking
            const parking = parkings.find(p => p.id === parkingId);
            
            // Suppression du parking
            await ParkingsAPI.deleteParking(parkingId);
            
            // Notification
            Notification.success(
                'Parking supprimé',
                `Le parking "${parking.name}" a été supprimé avec succès`
            );
            
            // Rechargement de la liste des parkings
            loadParkings();
        } catch (error) {
            console.error('Erreur lors de la suppression du parking:', error);
            Notification.error(
                'Erreur',
                'Impossible de supprimer le parking'
            );
        }
    };
    
    /**
     * Affiche les détails d'un parking (ses emplacements)
     * @param {Number} parkingId - ID du parking à afficher
     */
    const viewParking = async (parkingId) => {
        try {
            // Récupération des détails du parking
            const parking = await ParkingsAPI.getParkingById(parkingId);
            
            // Activation de la page des emplacements avec filtrage par parking
            Sidebar.activatePage('spots');
            
            // Notification
            Notification.info(
                'Navigation',
                `Affichage des emplacements du parking "${parking.name}"`
            );
            
            // Déclenchement d'un événement pour informer le module des emplacements
            document.dispatchEvent(new CustomEvent('filterSpotsByParking', { 
                detail: { parkingId: parking.id } 
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du parking:', error);
            Notification.error(
                'Erreur',
                'Impossible de récupérer les détails du parking'
            );
        }
    };
    
    /**
     * Recherche des parkings selon un terme de recherche
     * @param {String} searchTerm - Terme de recherche
     */
    const searchParkings = (searchTerm) => {
        if (!searchTerm) {
            renderParkingsTable(parkings);
            return;
        }
        
        // Recherche dans la liste des parkings déjà chargés
        const searchTermLower = searchTerm.toLowerCase();
        const filteredParkings = parkings.filter(parking => 
            parking.name.toLowerCase().includes(searchTermLower) ||
            (parking.description && parking.description.toLowerCase().includes(searchTermLower)) ||
            (parking.location && parking.location.toLowerCase().includes(searchTermLower))
        );
        
        // Affichage des résultats
        renderParkingsTable(filteredParkings);
        
        // Notification du résultat
        Notification.info(
            'Recherche',
            `${filteredParkings.length} parking(s) trouvé(s) pour "${searchTerm}"`
        );
    };
    
    // Exposition de l'API publique
    return {
        init,
        loadParkings,
        openAddParkingModal,
        openEditParkingModal,
        viewParking
    };
})();

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', Parkings.init);

// Exportation pour utilisation dans les autres modules
window.Parkings = Parkings;
