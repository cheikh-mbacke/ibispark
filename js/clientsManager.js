// clientsManager.js
export class ClientsManager {
  constructor(dataService) {
    this.dataService = dataService;
  }

  // Récupérer les informations d'un client par numéro de chambre
  getClientByRoomNumber(roomNumber) {
    return this.dataService.findClientByRoomNumber(roomNumber);
  }

  // Formater la date au format dd-MMM (ex: 17-mai)
  formatDate(dateString) {
    if (!dateString) return '--';
    
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

  // Vérifier si un client est en arrivée aujourd'hui
  isArrivalToday(client) {
    if (!client || !client.check_in_date) return false;
    
    const today = new Date();
    const checkInDate = new Date(client.check_in_date);
    
    return today.getDate() === checkInDate.getDate() && 
           today.getMonth() === checkInDate.getMonth() && 
           today.getFullYear() === checkInDate.getFullYear();
  }

  // Vérifier si un client est en départ tardif aujourd'hui
  isLateCheckoutToday(client) {
    if (!client || !client.check_out_date) return false;
    
    const today = new Date();
    const checkOutDate = new Date(client.check_out_date);
    
    return today.getDate() === checkOutDate.getDate() && 
           today.getMonth() === checkOutDate.getMonth() && 
           today.getFullYear() === checkOutDate.getFullYear();
  }

  // Déterminer le statut d'occupation approprié pour un client
  determineClientStatus(client) {
    if (this.isArrivalToday(client)) {
      return 'arrival-today';
    } else if (this.isLateCheckoutToday(client)) {
      return 'late-checkout';
    } else {
      return 'already-in';
    }
  }

  // Préparer les données client pour l'affichage
  prepareClientDisplayData(client) {
    if (!client) return null;
    
    return {
      name: client.name,
      roomNumber: client.room_number,
      checkInDate: this.formatDate(client.check_in_date),
      checkOutDate: this.formatDate(client.check_out_date),
      status: this.determineClientStatus(client)
    };
  }
}