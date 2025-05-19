import React from "react";
import styles from "./Footer.module.css";

const Footer = ({ className }) => {
  // Déterminer la classe CSS à appliquer
  const footerClasses = className
    ? `${styles.footer} ${styles[className] || className}`
    : styles.footer;

  return (
    <footer className={footerClasses}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Parking Management Dashboard
        </p>
      </div>
    </footer>
  );
};

export default Footer;
