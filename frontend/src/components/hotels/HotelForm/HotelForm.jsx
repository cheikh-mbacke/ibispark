import React, { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import styles from "./HotelForm.module.css";

const HotelForm = ({ hotel, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  // Charger les données de l'hôtel si disponibles (mode édition)
  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        address: hotel.address || "",
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Nom de l'hôtel*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.formInput}
          placeholder="Nom de l'hôtel"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Adresse</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="123 Rue de l'Hôtel"
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.loadingSpinner}></span>
          ) : (
            <FiSave className={styles.buttonIcon} />
          )}
          {hotel ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
