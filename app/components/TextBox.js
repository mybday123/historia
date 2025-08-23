import styles from "../styles/TextBox.module.css";
import Button from "./Button";
import Icon from "./Icon";

function TextBox({ value, onChange, onSend, disabled }) {
  return (
    <div className={styles.textboxcontainer}>
      <input
        type="text"
        className={styles.textbox}
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) onSend();
        }}
      />
      <Button
        className={styles.sendbutton}
        icon={"send"}
        color={"#D6C7B7"}
        onClick={onSend}
        disabled={disabled}
      ></Button>
    </div>
  );
}

export default TextBox;
