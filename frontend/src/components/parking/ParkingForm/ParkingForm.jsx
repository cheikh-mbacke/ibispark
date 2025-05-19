import React, { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import styles from "./ParkingForm.module.css";

const ParkingForm = ({ parking, hotelId, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    if (parking) {
      setFormData({
        name: parking.name || "",
        location: parking.location || "",
        capacity: parking.capacity || "",
      });
    } else {
      // Réinitialiser le formulaire pour un nouveau parking
      setFormData({
        name: "",
        location: "",
        capacity: "",
      });
    }
  }, [parking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convertir la capacité en nombre
    if (name === "capacity" && value !== "") {
      processedValue = parseInt(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajouter l'ID de l'hôtel si c'est un nouveau parking
    const finalData = { ...formData };
    if (!parking) {
      finalData.hotel_id = hotelId;
    }
    onSubmit(finalData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Nom du parking*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="Ex: Parking Principal"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Emplacement</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="Ex: Entrée principale, côté nord"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Capacité</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="Nombre d'emplacements"
          min="0"
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
          {parking ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </form>
  );
};

export default ParkingForm;
