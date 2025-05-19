import React, { useState, useEffect } from "react";
import { FiSave, FiX } from "react-icons/fi";
import styles from "./HotelForm.module.css";

const HotelForm = ({ hotel, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    // Ajoutez d'autres champs si nécessaire
  });

  // Charger les données de l'hôtel si disponibles (mode édition)
  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        description: hotel.description || "",
        address: hotel.address || "",
        city: hotel.city || "",
        country: hotel.country || "",
        phone: hotel.phone || "",
        email: hotel.email || "",
        // Initialiser d'autres champs si nécessaire
      });
    }
  }, [hotel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-content"]}>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Nom de l'hôtel*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles["form-input"]}
                placeholder="Nom de l'hôtel"
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Adresse email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="contact@hotel.com"
              />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={styles["form-textarea"]}
              placeholder="Description de l'hôtel"
            ></textarea>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles["form-input"]}
              placeholder="123 Rue de l'Hôtel"
            />
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Ville"
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Pays</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={styles["form-input"]}
                placeholder="Pays"
              />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles["form-input"]}
              placeholder="+33 1 23 45 67 89"
            />
          </div>

          <div className={styles["form-footer"]}>
            <button
              type="button"
              onClick={onCancel}
              className={styles["form-button-cancel"]}
              disabled={loading}
            >
              <FiX className={styles["button-icon"]} />
              Annuler
            </button>

            <button
              type="submit"
              className={styles["form-button-submit"]}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className={styles["loading-spinner"]}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className={styles["spinner-track"]}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className={styles["spinner-path"]}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <FiSave className={styles["button-icon"]} />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
