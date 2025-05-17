import { ClientsManager } from './clientsManager.js';
import { ParkingManager } from './parkingManager.js';
import { UIManager } from './uiManager.js';
import { DataService } from './dataService.js';

// Classe principale de l'application
class ParkingApp {
  constructor() {
    // Initialiser les services et managers
    this.dataService = new DataService();
    this.clientsManager = new ClientsManager(this.dataService);
    this.parkingManager = new ParkingManager(this.dataService);
    this.uiManager = new UIManager(this.clientsManager, this.parkingManager);
    
    // Initialiser l'application
    this.init();
  }

  async init() {
    try {
      // Mettre à jour la date actuelle
      this.updateCurrentDate();
      
      // Charger les données initiales
      await this.dataService.loadData();
      
      // Configurer les gestionnaires d'événements de l'interface
      this.uiManager.setupEventListeners();
      
      // Afficher les parkings initiaux
      this.uiManager.renderParking('Philibert');
      
      console.log('Application de gestion de parking initialisée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'application:', error);
      // Afficher une alerte à l'utilisateur
      alert('Une erreur est survenue lors de l\'initialisation de l\'application. Veuillez réessayer plus tard.');
    }
  }
  
  // Mettre à jour la date actuelle au format français
  updateCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
      dateElement.textContent = `${day}/${month}/${year}`;
    }
  }
}

// Démarrer l'application une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  window.parkingApp = new ParkingApp();
});