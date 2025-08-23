import { useState } from "react";
import Button from "./Button";
import styles from "../styles/TopBar.module.css";
import emailMenuStyles from "../styles/EmailMenu.module.css";

function TopBar({ onNewChat, onSendEmail, chatMessages }) {
  const [showMenu, setShowMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = () => {
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    setError("");
    setShowMenu(false);
    if (onSendEmail) onSendEmail(email, chatMessages);
    setEmail("");
  };

  return (
    <div className={styles.topBarContainer} style={{ position: "relative" }}>
      <Button icon={"add"} onClick={onNewChat}>
        New Chat
      </Button>
      <h2 className={styles.h2}>Historia</h2>
      <Button icon={"mail"} onClick={() => setShowMenu((v) => !v)}>
        Send to Email
      </Button>
      {showMenu && (
        <div className={emailMenuStyles.emailMenuContainer}>
          <div>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailMenuStyles.emailInput}
            />
          </div>
          {error && <div className={emailMenuStyles.errorText}>{error}</div>}
          <Button onClick={handleSend}>Send</Button>
        </div>
      )}
    </div>
  );
}

export default TopBar;
