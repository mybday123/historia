import React from "react";
import styles from "../styles/Button.module.css";

function Button({
  children,
  icon,
  onClick,
  className = "",
  alwaysShowText = false,
  ...props
}) {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
      {icon && <span className={"material-symbols-outlined"}>{icon}</span>}
      {children && (
        <span
          className={`${styles.buttonText} ${alwaysShowText ? styles.alwaysShowText : ""}`}
        >
          {children}
        </span>
      )}
    </button>
  );
}

export default Button;
