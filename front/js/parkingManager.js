export class ParkingManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.currentParkingSlots = {};
    
    // État des places de parking mises à jour (pour la démo)
    this.updatedSlots = {
      Philibert: {
        // Places actuellement occupées (pour simuler des données)
        // Dans une vraie application, cela viendrait de la base de données
        occupiedSlots: {
          '4': {
            name: 'KOTHÂRI',
            roomNumber: '315',
            carMake: 'BMW',
            carModel: 'SUV',
            licensePlate: 'HK6243J',
            checkInDate: '16-mai',
            checkOutDate: '19-mai',
            status: 'already-in'
          },
          '5': {
            name: 'THIRIET',
            roomNumber: '514',
            carMake: 'CITROEN',
            carModel: 'SUV',
            licensePlate: 'GK4826D',
            checkInDate: '16-mai',
            checkOutDate: '18-mai',
            status: 'personnel'
          },
          '6': {
            name: 'TRIVALIC',
            roomNumber: '218/203',
            carMake: 'HYUNDAY',
            carModel: '',
            licensePlate: 'E98M460',
            checkInDate: '16-mai',
            checkOutDate: '18-mai',
            status: 'contact-hotel'
          },
          '7': {
            name: 'CAPRARA',
            roomNumber: '314',
            carMake: 'SKODA',
            carModel: 'FAVIA',
            licensePlate: '',
            checkInDate: '',
            checkOutDate: '',
            status: 'arrival-today'
          },
          '9': {
            name: 'POIRIER',
            roomNumber: '414',
            carMake: 'AUSTRAL',
            carModel: '',
            licensePlate: 'GV927VA',
            checkInDate: '16-mai',
            checkOutDate: '18-mai',
            status: 'external-company'
          },
          '10': {
            name: '',
            roomNumber: '',
            carMake: 'Inconnu',
            carModel: '',
            licensePlate: 'Inconnue',
            checkInDate: '16-mai',
            checkOutDate: '',
            status: 'unknown-occupation'
          },
          '11': {
            name: 'ACÉTOSA',
            roomNumber: '507',
            carMake: 'RENAULT',
            carModel: 'CAPTUR',
            licensePlate: 'EN 368 RR (13)',
            checkInDate: '16-mai',
            checkOutDate: '18-mai',
            status: 'late-checkout'
          }
        }
      },
      Seytour: {
        occupiedSlots: {
          '4': {
            name: 'SANCHEZ',
            roomNumber: '618',
            carMake: '',
            carModel: '',
            licensePlate: '',
            checkInDate: '16-mai',
            checkOutDate: '18-mai',
            status: 'already-in'
          },
          '5': {
            name: 'MÜLLER',
            roomNumber: '',
            carMake: '',
            carModel: '',
            licensePlate: 'FR-794-FD',
            checkInDate: '01-sept',
            checkOutDate: '31-mai',
            status: 'personnel'
          },
          '7': {
            name: 'LAVERGNE',
            roomNumber: '',
            carMake: 'MERCEDES',
            carModel: '',
            licensePlate: 'FR-497-FV',
            checkInDate: '',
            checkOutDate: '',
            status: 'external-company'
          },
          '8': {
            name: 'MR DE WULF',
            roomNumber: '',
            carMake: 'PEUGEOT',
            carModel: '307',
            licensePlate: 'DH-514-VF',
            checkInDate: '',
            checkOutDate: '',
            status: 'external-company'
          },
          '11': {
            name: 'TAYAKOUT',
            roomNumber: '404',
            carMake: 'VAN',
            carModel: '',
            licensePlate: 'FR',
            checkInDate: '11-mai',
            checkOutDate: '16-mai',
            status: 'arrival-today'
          }
        }
      }
    };
  }

  // Obtenir toutes les places de parking pour un parking donné
  getParkingSlots(parkingName) {
    const slots = this.dataService.getParkingPlaces(parkingName);
    return slots.map(slot => {
      const slotNumber = slot.number.split(' ')[0]; // Extraire juste le numéro
      
      // Vérifier si cette place est occupée dans nos données mises à jour
      const updatedData = this.updatedSlots[parkingName]?.occupiedSlots[slotNumber];
      
      return {
        number: slot.number,
        type: slot.type,
        status: updatedData ? updatedData.status : 'empty',
        occupiedBy: updatedData || null
      };
    });
  }

  // Obtenir les noms de tous les parkings disponibles
  getAllParkingNames() {
    return this.dataService.getAllParkingNames();
  }

  // Assigner une place de parking avec les données fournies
  assignParkingSlot(parkingName, slotNumber, data) {
    // Dans une vraie application, cela appellerait un service de base de données
    // Pour la démo, nous allons simplement mettre à jour notre objet local
    
    // S'assurer que le parking existe dans notre structure de données
    if (!this.updatedSlots[parkingName]) {
      this.updatedSlots[parkingName] = { occupiedSlots: {} };
    }
    
    // Mettre à jour l'emplacement
    this.updatedSlots[parkingName].occupiedSlots[slotNumber] = {
      name: data.name,
      roomNumber: data.roomNumber,
      carMake: data.carMake,
      carModel: data.carModel,
      licensePlate: data.licensePlate,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      status: data.status
    };
    
    // Dans une vraie application, nous enregistrerions aussi ces informations
    return this.dataService.assignParkingSlot(parkingName, slotNumber, data);
  }

  // Libérer une place de parking
  freeParkingSlot(parkingName, slotNumber) {
    if (this.updatedSlots[parkingName]?.occupiedSlots[slotNumber]) {
      delete this.updatedSlots[parkingName].occupiedSlots[slotNumber];
      return true;
    }
    return false;
  }

  // Obtenir les statuts de parking possibles et leurs couleurs
  getParkingStatusOptions() {
    return [
      { id: 'personnel', label: 'Personnel hôtel', color: '#F4CCCC' },
      { id: 'late-checkout', label: 'Départ tardif', color: '#FF9900' },
      { id: 'arrival-today', label: 'Arrivée du jour', color: '#00FF00' },
      { id: 'already-in', label: 'Déjà présent', color: '#D9A384' },
      { id: 'contact-hotel', label: 'Contact hôtel/téléphone', color: '#FF00FF' },
      { id: 'external-company', label: 'Société extérieure', color: '#FFFF00' },
      { id: 'unknown-occupation', label: 'Occupation inconnue', color: '#FF0000' }
    ];
  }
}