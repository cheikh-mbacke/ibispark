/**
 * @typedef {Object} Hotel
 * @property {number|string} id - L'identifiant unique de l'hôtel
 * @property {string} name - Le nom de l'hôtel
 * @property {string} [description] - La description de l'hôtel (optionnelle)
 * @property {string} [address] - L'adresse de l'hôtel (optionnelle)
 * @property {string} [city] - La ville de l'hôtel (optionnelle)
 * @property {string} [country] - Le pays de l'hôtel (optionnelle)
 * @property {Array<Parking>} [parkings] - Liste des parkings associés (optionnelle)
 */

/**
 * @typedef {Object} Parking
 * @property {number|string} id - L'identifiant unique du parking
 * @property {number|string} hotel_id - L'identifiant de l'hôtel associé
 * @property {string} name - Le nom du parking
 * @property {string} [description] - La description du parking (optionnelle)
 * @property {number} [capacity] - La capacité totale du parking (optionnelle)
 * @property {string} [location] - L'emplacement du parking (optionnelle)
 * @property {Array<Spot>} [spots] - Liste des emplacements associés (optionnelle)
 */

/**
 * @typedef {Object} Spot
 * @property {number|string} id - L'identifiant unique de l'emplacement
 * @property {number|string} parking_id - L'identifiant du parking associé
 * @property {string} [number] - Le numéro de l'emplacement (optionnel)
 * @property {string} [type] - Le type d'emplacement (optionnel)
 * @property {boolean} [available] - Disponibilité de l'emplacement (optionnelle)
 * @property {Array<Status>} [statuses] - Statuts associés à l'emplacement (optionnel)
 */

/**
 * @typedef {Object} Status
 * @property {number|string} id - L'identifiant unique du statut
 * @property {string} name - Le nom du statut
 * @property {string} [description] - La description du statut (optionnelle)
 * @property {string} [color] - La couleur associée au statut (optionnelle)
 */

/**
 * @typedef {Object} Type
 * @property {number|string} id - L'identifiant unique du type
 * @property {string} name - Le nom du type
 * @property {string} [description] - La description du type (optionnelle)
 */

export {};
