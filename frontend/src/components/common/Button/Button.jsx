
import React from "react";
import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  icon,
}) => {
  // Utiliser les classes du module CSS
  const getButtonClasses = () => {
    // Classe de base
    let classes = [styles.btn];

    // Ajouter la classe de variante si elle existe dans le module
    if (styles[variant]) {
      classes.push(styles[variant]);
    }

    // Ajouter la classe de taille
    if (size === "sm") {
      classes.push(styles.small);
    } else if (size === "lg") {
      classes.push(styles.large);
    }

    // Ajouter les classes personnalisées
    if (className) {
      classes.push(className);
    }

    return classes.join(" ");
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;