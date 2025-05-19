import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSun, FiMoon, FiUser } from "react-icons/fi";
import styles from "./Header.module.css";

const Header = ({
  toggleSidebar,
  sidebarOpen,
  minimal = false,
  toggleTheme,
  theme,
}) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {!minimal && (
        <button
          className={`${styles["header-action-button"]} ${styles["menu-button"]}`}
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <FiMenu size={20} />
        </button>
      )}

      <div className={styles["header-title"]}>
        Dashboard de Gestion de Parking
      </div>

      <div className={styles["header-actions"]}>
        {toggleTheme && (
          <button
            className={styles["header-action-button"]}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        )}

        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          <FiUser className={styles.loginIcon} />
          Connexion
        </button>
      </div>
    </header>
  );
};

export default Header;
