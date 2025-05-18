/**
 * validator.js - Module utilitaire pour la validation des données
 * Fournit des méthodes de validation réutilisables
 */

const Validator = (function () {
  /**
   * Vérifie si une valeur est vide (null, undefined, chaîne vide, tableau vide)
   * @param {*} value - Valeur à vérifier
   * @returns {Boolean} - true si la valeur est vide
   */
  const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;

    return false;
  };

  /**
   * Vérifie si une chaîne a la longueur minimale requise
   * @param {String} value - Chaîne à vérifier
   * @param {Number} minLength - Longueur minimale (default: 3)
   * @returns {Boolean} - true si la chaîne est valide
   */
  const minLength = (value, minLength = 3) => {
    if (isEmpty(value)) return false;

    return String(value).length >= minLength;
  };

  /**
   * Vérifie si une chaîne ne dépasse pas la longueur maximale
   * @param {String} value - Chaîne à vérifier
   * @param {Number} maxLength - Longueur maximale (default: 100)
   * @returns {Boolean} - true si la chaîne est valide
   */
  const maxLength = (value, maxLength = 100) => {
    if (isEmpty(value)) return true; // Une valeur vide est valide pour maxLength

    return String(value).length <= maxLength;
  };

  /**
   * Vérifie si une valeur est un nombre
   * @param {*} value - Valeur à vérifier
   * @returns {Boolean} - true si la valeur est un nombre
   */
  const isNumber = (value) => {
    if (isEmpty(value)) return false;

    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  /**
   * Vérifie si un nombre est supérieur ou égal à une valeur minimale
   * @param {Number} value - Nombre à vérifier
   * @param {Number} min - Valeur minimale
   * @returns {Boolean} - true si le nombre est valide
   */
  const minValue = (value, min) => {
    if (!isNumber(value)) return false;

    return parseFloat(value) >= min;
  };

  /**
   * Vérifie si un nombre est inférieur ou égal à une valeur maximale
   * @param {Number} value - Nombre à vérifier
   * @param {Number} max - Valeur maximale
   * @returns {Boolean} - true si le nombre est valide
   */
  const maxValue = (value, max) => {
    if (!isNumber(value)) return false;

    return parseFloat(value) <= max;
  };

  /**
   * Vérifie si une valeur est une adresse email valide
   * @param {String} value - Email à vérifier
   * @returns {Boolean} - true si l'email est valide
   */
  const isEmail = (value) => {
    if (isEmpty(value)) return false;

    // Regex simplifiée pour la validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  /**
   * Vérifie si une valeur correspond à un format de date valide
   * @param {String} value - Date à vérifier
   * @returns {Boolean} - true si la date est valide
   */
  const isDate = (value) => {
    if (isEmpty(value)) return false;

    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  /**
   * Vérifie si un objet a tous les champs requis
   * @param {Object} obj - Objet à vérifier
   * @param {Array} requiredFields - Liste des champs requis
   * @returns {Object} - Objet avec les résultats de validation et les erreurs
   */
  const validateRequired = (obj, requiredFields) => {
    const errors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (isEmpty(obj[field])) {
        errors[field] = "Ce champ est requis";
        isValid = false;
      }
    });

    return { isValid, errors };
  };

  /**
   * Valide un formulaire complet avec des règles personnalisées
   * @param {Object} formData - Données du formulaire
   * @param {Object} rules - Règles de validation (champ: [fonctions de validation])
   * @returns {Object} - Objet avec les résultats de validation et les erreurs
   */
  const validateForm = (formData, rules) => {
    const errors = {};
    let isValid = true;

    // Parcourir toutes les règles
    Object.entries(rules).forEach(([field, fieldRules]) => {
      // Pour chaque règle du champ
      fieldRules.forEach((rule) => {
        // Extraire la fonction de validation et les paramètres
        const { validate, message, params = [] } = rule;

        // Appliquer la validation
        if (!validate(formData[field], ...params)) {
          errors[field] = message;
          isValid = false;

          // Arrêter le traitement des autres règles pour ce champ
          return;
        }
      });
    });

    return { isValid, errors };
  };

  // Exposition de l'API publique
  return {
    isEmpty,
    minLength,
    maxLength,
    isNumber,
    minValue,
    maxValue,
    isEmail,
    isDate,
    validateRequired,
    validateForm,
  };
})();

// Exportation pour utilisation dans les autres modules
window.Validator = Validator;
