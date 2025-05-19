import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import { useTheme } from "../../hooks/useTheme";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Détermine si c'est une page de connexion
  const isLoginPage = location.pathname === "/login";

  // Si c'est la page de connexion, afficher une mise en page simplifiée
  if (isLoginPage) {
    return (
      <div className={styles.layout}>
        <Header minimal={true} toggleTheme={toggleTheme} theme={theme} />
        <main className={styles.loginMain}>{children}</main>
        <Footer />
      </div>
    );
  }

  // Sinon, afficher la mise en page complète avec la barre latérale
  return (
    <div className={styles.layout}>
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        toggleTheme={toggleTheme}
        theme={theme}
      />
      <div className={styles["layout-content"]}>
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <main
          className={`${styles["layout-main"]} ${
            sidebarCollapsed ? styles["layout-main-collapsed"] : ""
          }`}
        >
          {children}
        </main>
      </div>
      <Footer
        className={sidebarCollapsed ? styles.footerCollapsed : styles.footer}
      />
    </div>
  );
};

export default Layout;
