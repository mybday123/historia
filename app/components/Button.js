import React from "react";
import styles from "../styles/Button.module.css";

function Button({ children, icon, onClick, ...props }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {icon && <span className={"material-symbols-outlined"}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export default Button;
