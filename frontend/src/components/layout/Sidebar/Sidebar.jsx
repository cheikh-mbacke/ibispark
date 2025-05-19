import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiMap,
  FiMapPin,
  FiActivity,
  FiList,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import styles from "./Sidebar.module.css";

// Définition des liens de navigation
const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FiHome className={styles.navIcon} />,
  },
  {
    name: "Hôtels",
    path: "/hotels",
    icon: <FiBook className={styles.navIcon} />,
  },
  {
    name: "Parkings",
    path: "/parkings",
    icon: <FiMap className={styles.navIcon} />,
  },
  {
    name: "Emplacements",
    path: "/spots",
    icon: <FiMapPin className={styles.navIcon} />,
  },
  {
    name: "Statuts",
    path: "/statuses",
    icon: <FiActivity className={styles.navIcon} />,
  },
  {
    name: "Types",
    path: "/types",
    icon: <FiList className={styles.navIcon} />,
  },
];

const Sidebar = ({ open, setOpen, collapsed, setCollapsed }) => {
  return (
    <>
      {/* Overlay pour mobile */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${styles.sidebar} 
          ${collapsed ? styles.collapsed : ""} 
          ${!open ? styles.hidden : styles.show}
        `}
      >
        <div
          className={`${styles.brand} ${
            collapsed ? styles.collapsedBrand : ""
          }`}
        >
          {!collapsed && <span>Parking Management</span>}
          {collapsed && <span>PM</span>}
        </div>
        <div className={styles.nav}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.text}>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Bouton pour replier/déplier la sidebar */}
        <button
          className={styles.toggleButton}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {collapsed ? (
            <FiChevronRight size={16} />
          ) : (
            <FiChevronLeft size={16} />
          )}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
