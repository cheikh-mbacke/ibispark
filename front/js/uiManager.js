// uiManager.js - Gère l'interface utilisateur et les interactions
export class UIManager {
  constructor(clientsManager, parkingManager) {
    this.clientsManager = clientsManager;
    this.parkingManager = parkingManager;
    
    // Éléments du DOM que nous allons utiliser
    this.elements = {
      tabs: null,
      roomNumberInput: null,
      guestNameInput: null,
      checkInInput: null,
      checkOutInput: null,
      carMakeInput: null,
      carModelInput: null,
      licensePlateInput: null,
      statusTypeSelect: null,
      parkingSpotSelect: null,
      assignButton: null,
      resetButton: null,
      parkingGrid: null
    };
    
    // Parking actuellement affiché
    this.currentParking = 'Philibert';
  }

  // Configuration de tous les gestionnaires d'événements
  setupEventListeners() {
    // Initialiser les références aux éléments du DOM
    this._initializeElements();
    
    // Configurer les onglets de parking
    this.elements.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this._handleTabChange(e.target);
      });
    });
    
    // Gestionnaire pour l'entrée du numéro de chambre
    this.elements.roomNumberInput.addEventListener('blur', () => {
      this._handleRoomNumberChange();
    });
    
    // Configurer l'autocomplétion pour les véhicules
    this._setupAutocompleteLists();
    
    // Gérer la soumission du formulaire
    this.elements.assignButton.addEventListener('click', (e) => {
      e.preventDefault();
      this._handleFormSubmit();
    });
    
    // Réinitialiser le formulaire
    this.elements.resetButton.addEventListener('click', () => {
      this._resetForm();
    });
  }

  // Initialiser les références aux éléments du DOM
  _initializeElements() {
    this.elements.tabs = document.querySelectorAll('.tab');
    this.elements.roomNumberInput = document.getElementById('room-number');
    this.elements.guestNameInput = document.getElementById('guest-name');
    this.elements.checkInInput = document.getElementById('check-in');
    this.elements.checkOutInput = document.getElementById('check-out');
    this.elements.carMakeInput = document.getElementById('car-make');
    this.elements.carModelInput = document.getElementById('car-model');
    this.elements.licensePlateInput = document.getElementById('license-plate');
    this.elements.statusTypeSelect = document.getElementById('status-type');
    this.elements.parkingSpotSelect = document.getElementById('parking-spot');
    this.elements.assignButton = document.querySelector('.btn-primary');
    this.elements.resetButton = document.querySelector('.btn-secondary');
    this.elements.parkingGrid = document.querySelector('.parking-grid');
  }

  // Configurer les listes d'autocomplétion
  _setupAutocompleteLists() {
    // Obtenir les listes du gestionnaire de données
    const dataService = this.parkingManager.dataService;
    const carBrands = dataService.getCarBrands();
    const carModels = dataService.getCarModels();
    const licensePlates = dataService.getLicensePlates();
    
    // Configurer les datalists
    this._updateDatalist('car-makes', carBrands);
    this._updateDatalist('car-models', carModels);
    
    // Ajouter un datalist pour les plaques d'immatriculation si ce n'est pas déjà fait
    const licensePlatesList = document.getElementById('license-plates');
    if (!licensePlatesList) {
      const newDatalist = document.createElement('datalist');
      newDatalist.id = 'license-plates';
      document.body.appendChild(newDatalist);
      this.elements.licensePlateInput.setAttribute('list', 'license-plates');
    }
    
    this._updateDatalist('license-plates', licensePlates);
  }

  // Mettre à jour une liste d'autocomplétion
  _updateDatalist(datalistId, options) {
    const datalist = document.getElementById(datalistId);
    if (!datalist) return;
    
    // Effacer les options existantes
    datalist.innerHTML = '';
    
    // Ajouter les nouvelles options
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      datalist.appendChild(optionElement);
    });
  }

  // Gérer le changement d'onglet
  _handleTabChange(tabElement) {
    // Mettre à jour les onglets actifs
    this.elements.tabs.forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
    
    // Mettre à jour le parking actuel
    const parkingName = tabElement.textContent.replace('Parking ', '');
    this.currentParking = parkingName;
    
    // Mettre à jour l'affichage
    this.renderParking(parkingName);
    this._updateParkingSpotOptions(parkingName);
  }

  // Gérer le changement de numéro de chambre
  _handleRoomNumberChange() {
    const roomNumber = this.elements.roomNumberInput.value.trim();
    if (!roomNumber) return;
    
    // Rechercher le client
    const client = this.clientsManager.getClientByRoomNumber(roomNumber);
    if (client) {
      // Remplir les champs avec les données du client
      this.elements.guestNameInput.value = client.name || '';
      
      // Formater les dates pour les champs input date
      if (client.check_in_date) {
        this.elements.checkInInput.value = client.check_in_date;
      }
      
      if (client.check_out_date) {
        this.elements.checkOutInput.value = client.check_out_date;
      }
      
      // Déterminer automatiquement le statut
      const status = this.clientsManager.determineClientStatus(client);
      this.elements.statusTypeSelect.value = status;
    }
  }

  // Gérer la soumission du formulaire
  _handleFormSubmit() {
    // Récupérer toutes les valeurs du formulaire
    const formData = {
      roomNumber: this.elements.roomNumberInput.value.trim(),
      name: this.elements.guestNameInput.value.trim(),
      checkInDate: this._formatDateForDisplay(this.elements.checkInInput.value),
      checkOutDate: this._formatDateForDisplay(this.elements.checkOutInput.value),
      carMake: this.elements.carMakeInput.value.trim().toUpperCase(),
      carModel: this.elements.carModelInput.value.trim().toUpperCase(),
      licensePlate: this.elements.licensePlateInput.value.trim().toUpperCase(),
      status: this.elements.statusTypeSelect.value,
      parkingSpot: this.elements.parkingSpotSelect.value
    };
    
    // Valider les données
    if (!formData.parkingSpot) {
      alert('Veuillez sélectionner une place de parking');
      return;
    }
    
    // Assigner la place de parking
    const success = this.parkingManager.assignParkingSlot(
      this.currentParking,
      formData.parkingSpot,
      formData
    );
    
    if (success) {
      // Ajouter les nouvelles données de véhicule pour l'autocomplétion future
      this.parkingManager.dataService.addVehicleData(
        formData.carMake,
        formData.carModel,
        formData.licensePlate
      );
      
      // Mettre à jour l'affichage
      this.renderParking(this.currentParking);
      
      // Réinitialiser le formulaire
      this._resetForm();
      
      alert('Place de parking attribuée avec succès !');
    } else {
      alert('Erreur lors de l\'attribution de la place de parking.');
    }
  }

  // Réinitialiser le formulaire
  _resetForm() {
    document.querySelector('form').reset();
  }

  // Mettre à jour les options de place de parking
  _updateParkingSpotOptions(parkingName) {
    const slots = this.parkingManager.getParkingSlots(parkingName);
    const select = this.elements.parkingSpotSelect;
    
    // Effacer les options existantes
    select.innerHTML = '<option value="">Sélectionner une place</option>';
    
    // Ajouter les nouvelles options
    slots.forEach(slot => {
      const slotNumber = slot.number.split(' ')[0]; // Juste le numéro
      const optionText = `Place ${slot.number}${slot.type === 'PMR' ? ' (PMR)' : ''}`;
      
      const option = document.createElement('option');
      option.value = slotNumber;
      option.textContent = optionText;
      
      // Désactiver les options pour les places déjà occupées
      if (slot.status !== 'empty') {
        option.disabled = true;
        option.textContent += ' - Occupée';
      }
      
      select.appendChild(option);
    });
  }

  // Afficher les places de parking
  renderParking(parkingName) {
    // Mettre à jour le titre
    document.querySelector('h2:not(.search-form h2)').textContent = 
      `Parking ${parkingName} - Vue d'ensemble`;
    
    // Obtenir les places de parking
    const slots = this.parkingManager.getParkingSlots(parkingName);
    
    // Effacer la grille existante
    this.elements.parkingGrid.innerHTML = '';
    
    // Ajouter les places à la grille
    slots.forEach(slot => {
      const slotNumber = slot.number.split(' ')[0]; // Juste le numéro
      
      // Créer l'élément de place
      const slotElement = document.createElement('div');
      
      if (slot.status === 'empty') {
        // Place vide
        slotElement.className = 'parking-slot empty-slot';
        slotElement.innerHTML = `
          <div>Place ${slot.number} - Disponible</div>
        `;
      } else {
        // Place occupée
        const occupiedBy = slot.occupiedBy;
        slotElement.className = `parking-slot slot-${slot.status}`;
        
        slotElement.innerHTML = `
          <div class="slot-header">
            <div class="slot-number">Place ${slot.number}</div>
            <div class="slot-type">${slot.type === 'PMR' ? 'PMR' : 'Standard'}</div>
          </div>
          <div class="slot-content">
            <div class="slot-info">
              <div class="slot-label">${this._getLabelByStatus(slot.status)}:</div>
              <div class="slot-data">${occupiedBy.name}${occupiedBy.roomNumber ? ` (${occupiedBy.roomNumber})` : ''}</div>
            </div>
            <div class="slot-info">
              <div class="slot-label">Véhicule:</div>
              <div class="slot-data">${occupiedBy.carMake}${occupiedBy.carModel ? ` ${occupiedBy.carModel}` : ''}</div>
            </div>
            <div class="slot-info">
              <div class="slot-label">Immat.:</div>
              <div class="slot-data">${occupiedBy.licensePlate || '--'}</div>
            </div>
            <div class="slot-info">
              <div class="slot-label">Période:</div>
              <div class="slot-data">${occupiedBy.checkInDate || '--'} - ${occupiedBy.checkOutDate || '--'}</div>
            </div>
          </div>
        `;
      }
      
      // Ajouter un gestionnaire d'événements pour la suppression (optionnel)
      slotElement.addEventListener('dblclick', () => {
        if (slot.status !== 'empty') {
          this._handleSlotDblClick(parkingName, slotNumber);
        }
      });
      
      // Ajouter à la grille
      this.elements.parkingGrid.appendChild(slotElement);
    });
  }

  // Obtenir le libellé approprié en fonction du statut
  _getLabelByStatus(status) {
    switch (status) {
      case 'personnel':
        return 'Personnel';
      case 'external-company':
        return 'Société';
      case 'unknown-occupation':
        return 'Inconnu';
      default:
        return 'Client';
    }
  }

  // Formater une date pour l'affichage (format dd-mmm)
  _formatDateForDisplay(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate();
    
    // Tableau des noms de mois en français abrégés
    const monthNames = [
      'jan', 'fév', 'mar', 'avr', 'mai', 'juin',
      'juil', 'août', 'sep', 'oct', 'nov', 'déc'
    ];
    
    const month = monthNames[date.getMonth()];
    return `${day}-${month}`;
  }

  // Gérer le double-clic sur une place (pour libérer)
  _handleSlotDblClick(parkingName, slotNumber) {
    if (confirm(`Voulez-vous libérer la place ${slotNumber} du parking ${parkingName} ?`)) {
      const success = this.parkingManager.freeParkingSlot(parkingName, slotNumber);
      if (success) {
        this.renderParking(parkingName);
        this._updateParkingSpotOptions(parkingName);
        alert('Place libérée avec succès');
      } else {
        alert('Erreur lors de la libération de la place');
      }
    }
  }
}