// dataService.js - Version corrigée
export class DataService {
  constructor() {
    this.clients = [];
    this.parkingPlaces = {};
    this.carBrands = new Set();
    this.carModels = new Set();
    this.licensePlates = new Set();
  }

  async loadData() {
    try {
      // Charger les données clients - Correction du chemin
      const clientsResponse = await fetch('../mocks/clients.json');
      if (!clientsResponse.ok) {
        throw new Error(`Erreur HTTP: ${clientsResponse.status} lors du chargement des clients`);
      }
      this.clients = await clientsResponse.json();
      
      // Charger les données des places de parking - Correction du chemin
      const parkingResponse = await fetch('../mocks/parking_places.json');
      if (!parkingResponse.ok) {
        throw new Error(`Erreur HTTP: ${parkingResponse.status} lors du chargement des places de parking`);
      }
      this.parkingPlaces = await parkingResponse.json();
      
      // Extraire les marques et modèles de voitures des données existantes
      this._extractVehicleData();
      
      console.log('Données chargées avec succès');
      return { clients: this.clients, parkingPlaces: this.parkingPlaces };
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      
      // En cas d'erreur, charger des données statiques pour la démo
      this._loadStaticData();
      return { clients: this.clients, parkingPlaces: this.parkingPlaces };
    }
  }

  // Méthode de secours qui charge des données statiques si les fichiers JSON ne sont pas accessibles
  _loadStaticData() {
    console.log('Chargement des données statiques de secours');
    
    // Quelques clients pour la démo
    this.clients = [
      {
        room_number: 422,
        check_in_date: "2025-05-31",
        check_out_date: "2025-06-07",
        name: "Ronald Barker"
      },
      {
        room_number: 209,
        check_in_date: "2025-05-21",
        check_out_date: "2025-06-25",
        name: "John Robbins"
      },
      {
        room_number: 315,
        check_in_date: "2025-05-16",
        check_out_date: "2025-05-19",
        name: "KOTHÂRI"
      },
      {
        room_number: 514,
        check_in_date: "2025-05-16",
        check_out_date: "2025-05-18",
        name: "THIRIET"
      }
    ];
    
    // Places de parking pour la démo
    this.parkingPlaces = {
      "Philibert": [
        { number: "1 PMR", type: "PMR" },
        { number: "2", type: "standard" },
        { number: "3 PMR", type: "PMR" },
        { number: "4", type: "standard" },
        { number: "5", type: "standard" },
        { number: "6", type: "standard" },
        { number: "7", type: "standard" },
        { number: "8", type: "standard" },
        { number: "9 PMR", type: "PMR" },
        { number: "10", type: "standard" },
        { number: "11", type: "standard" }
      ],
      "Seytour": [
        { number: "1", type: "standard" },
        { number: "2", type: "standard" },
        { number: "3", type: "standard" },
        { number: "4", type: "standard" },
        { number: "5", type: "standard" },
        { number: "6", type: "standard" },
        { number: "7", type: "standard" },
        { number: "8", type: "standard" },
        { number: "9 (2)", type: "standard" },
        { number: "10", type: "standard" },
        { number: "11", type: "standard" },
        { number: "12", type: "standard" }
      ]
    };
    
    // Appeler quand même _extractVehicleData pour initialiser les autocompletions
    this._extractVehicleData();
  }

  _extractVehicleData() {
    // Cette méthode serait utilisée dans un vrai système pour extraire 
    // les marques et modèles de voitures des données existantes
    // Pour notre démonstration, nous allons ajouter des données factices
    
    // Marques de voitures courantes
    const commonBrands = [
      'RENAULT', 'PEUGEOT', 'CITROEN', 'BMW', 'MERCEDES', 
      'TOYOTA', 'VOLKSWAGEN', 'AUDI', 'FORD', 'OPEL',
      'HONDA', 'HYUNDAI', 'KIA', 'SKODA', 'SEAT',
      'FIAT', 'NISSAN', 'MAZDA', 'VOLVO', 'DACIA'
    ];
    
    // Modèles de voitures (simplifiés)
    const commonModels = [
      'SUV', 'CLIO', '208', 'C3', 'SERIE 3', 
      'CLASSE A', 'COROLLA', 'GOLF', 'A3', 'FIESTA',
      'ASTRA', 'CIVIC', 'TUCSON', 'SPORTAGE', 'OCTAVIA',
      'LEON', 'PANDA', 'QASHQAI', 'CX-5', 'V40', 'SANDERO',
      'CAPTUR', 'FAVIA', '307', 'TURAN'
    ];
    
    // Quelques plaques d'immatriculation factices
    const samplePlates = [
      'AB-123-CD', 'XY-456-ZW', 'GK4826D', 'HK6243J',
      'E98M460', 'GV927VA', 'EN 368 RR', 'FR-794-FD',
      'DH-514-VF', 'TCX782'
    ];
    
    // Ajouter les données aux ensembles
    commonBrands.forEach(brand => this.carBrands.add(brand));
    commonModels.forEach(model => this.carModels.add(model));
    samplePlates.forEach(plate => this.licensePlates.add(plate));
  }

  // Méthodes pour obtenir les clients, les places de parking, etc.
  getClients() {
    return this.clients;
  }

  getParkingPlaces(parkingName) {
    return this.parkingPlaces[parkingName] || [];
  }

  getAllParkingNames() {
    return Object.keys(this.parkingPlaces);
  }

  getCarBrands() {
    return [...this.carBrands];
  }

  getCarModels() {
    return [...this.carModels];
  }

  getLicensePlates() {
    return [...this.licensePlates];
  }

  // Trouver un client par numéro de chambre
  findClientByRoomNumber(roomNumber) {
    // Convertir en nombre pour la comparaison
    const roomNum = parseInt(roomNumber, 10);
    return this.clients.find(client => client.room_number === roomNum);
  }

  // Ajouter un nouveau véhicule
  addVehicleData(brand, model, licensePlate) {
    if (brand) this.carBrands.add(brand.toUpperCase());
    if (model) this.carModels.add(model.toUpperCase());
    if (licensePlate) this.licensePlates.add(licensePlate.toUpperCase());
  }

  // Assigner une place de parking (simplifié pour la démonstration)
  assignParkingSlot(parkingName, slotNumber, data) {
    console.log(`Assigning parking slot: ${parkingName}, Slot ${slotNumber}`, data);
    // Dans une vraie application, cette méthode mettrait à jour la base de données
    // Pour l'instant, nous allons simplement l'afficher dans la console
    return true;
  }
}