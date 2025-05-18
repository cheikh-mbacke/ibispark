/**
 * formatter.js - Module utilitaire pour le formatage des données
 * Fournit des méthodes de formatage réutilisables
 */

const Formatter = (function () {
  /**
   * Formate une date au format souhaité
   * @param {String|Date} date - Date à formater
   * @param {String} format - Format souhaité (default: DD/MM/YYYY)
   * @returns {String} - Date formatée
   */
  const formatDate = (date, format = CONFIG.UI.DATE_FORMAT) => {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "";

    // Formatage simple avec le format spécifié
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    // Remplacement des tokens dans le format
    return format
      .replace("DD", day)
      .replace("MM", month)
      .replace("YYYY", year)
      .replace("HH", hours)
      .replace("mm", minutes);
  };

  /**
   * Formate un nombre avec séparateur de milliers et décimales
   * @param {Number} number - Nombre à formater
   * @param {Number} decimals - Nombre de décimales (default: 2)
   * @param {String} decimalSep - Séparateur décimal (default: ,)
   * @param {String} thousandsSep - Séparateur de milliers (default:  )
   * @returns {String} - Nombre formaté
   */
  const formatNumber = (
    number,
    decimals = 2,
    decimalSep = ",",
    thousandsSep = " "
  ) => {
    if (number === null || number === undefined || isNaN(number)) return "";

    // Conversion en nombre
    const num = parseFloat(number);

    // Formatage avec les paramètres spécifiés
    const parts = num.toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

    return parts.join(decimalSep);
  };

  /**
   * Formate un prix avec symbole monétaire
   * @param {Number} price - Prix à formater
   * @param {String} currency - Symbole de la devise (default: €)
   * @param {Number} decimals - Nombre de décimales (default: 2)
   * @returns {String} - Prix formaté
   */
  const formatPrice = (price, currency = "€", decimals = 2) => {
    if (price === null || price === undefined || isNaN(price)) return "";

    return `${formatNumber(price, decimals)} ${currency}`;
  };

  /**
   * Tronque un texte à la longueur spécifiée
   * @param {String} text - Texte à tronquer
   * @param {Number} maxLength - Longueur maximale (default: 100)
   * @param {String} suffix - Suffixe à ajouter si tronqué (default: ...)
   * @returns {String} - Texte tronqué
   */
  const truncateText = (text, maxLength = 100, suffix = "...") => {
    if (!text) return "";

    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength - suffix.length) + suffix;
  };

  /**
   * Convertit un texte en slug (pour les URLs)
   * @param {String} text - Texte à convertir
   * @returns {String} - Slug généré
   */
  const slugify = (text) => {
    if (!text) return "";

    return text
      .toString()
      .normalize("NFD") // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Remplace les espaces par des tirets
      .replace(/[^\w-]+/g, "") // Supprime les caractères non alphanumériques
      .replace(/--+/g, "-"); // Remplace les tirets multiples par un seul
  };

  /**
   * Capitalise la première lettre de chaque mot
   * @param {String} text - Texte à capitaliser
   * @returns {String} - Texte capitalisé
   */
  const capitalize = (text) => {
    if (!text) return "";

    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  /**
   * Formate un statut d'emplacement avec sa couleur
   * @param {String} statusValue - Valeur du statut
   * @param {String} statusColor - Couleur du statut
   * @returns {String} - HTML du badge de statut
   */
  const formatStatusBadge = (statusValue, statusColor) => {
    if (!statusValue) return "";

    // Conversion de la valeur en libellé lisible
    const label = statusValue
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return `<span class="status-badge" style="background-color: ${statusColor}">${label}</span>`;
  };

  // Exposition de l'API publique
  return {
    formatDate,
    formatNumber,
    formatPrice,
    truncateText,
    slugify,
    capitalize,
    formatStatusBadge,
  };
})();

// Exportation pour utilisation dans les autres modules
window.Formatter = Formatter;
