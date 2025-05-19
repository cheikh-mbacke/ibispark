import React, { useState } from "react";
import { FiPlus, FiSearch, FiRefreshCw } from "react-icons/fi";
import HotelCard from "../HotelCard/HotelCard";
import { useNavigate } from "react-router-dom";
import styles from "./HotelList.module.css";

const HotelList = ({ hotels = [], onDelete, onRefresh, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filtrer les hôtels en fonction du terme de recherche
  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/hotels/${id}/edit`);
  };

  const handleViewDetails = (id) => {
    navigate(`/hotels/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>
            <FiSearch />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher un hôtel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm ? (
            <div>
              <p className={styles.emptyStateText}>
                Aucun hôtel ne correspond à votre recherche
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className={styles.clearSearchButton}
              >
                Effacer la recherche
              </button>
            </div>
          ) : (
            <div>
              <p className={styles.emptyStateText}>
                Aucun hôtel n'a été trouvé
              </p>
              <p className={styles.emptyStateSubtext}>
                Commencez par en ajouter un
              </p>
              <button
                onClick={() => navigate("/hotels/new")}
                className={styles.addEmptyButton}
              >
                <FiPlus className={styles.icon} />
                Ajouter un hôtel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.hotelGrid}>
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEdit={handleEdit}
              onDelete={onDelete}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;
