"use client";

import { useState, useEffect } from "react";
import UploadUI from "./UploadUI";
import TextBox from "./TextBox";
import styles from "../styles/ChatUI.module.css";

function ChatBubble({ message }) {
  return (
    <div
      className={`${styles.bubble} ${message.role === "user" ? styles.user : styles.api}`}
    >
      <div
        className={
          message.role === "user" ? styles.userBubble : styles.apiBubble
        }
      >
        {message.file && (
          <img
            src={message.file.url}
            alt={message.file.name}
            className={styles.bubbleImage}
            draggable={false}
          />
        )}
        <div className={styles.bubbleText}>{message.text}</div>
      </div>
    </div>
  );
}

function ChatUI({ initialMessages = [], onChatChange }) {
  const [chat, setChat] = useState(initialMessages);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (onChatChange) onChatChange(chat);
  }, [chat, onChatChange]);

  const handleSend = async () => {
    if (!text && uploadedFile) return;
    const userMsg = {
      role: "user",
      text,
      file: uploadedFile
        ? { name: uploadedFile.name, url: URL.createObjectURL(uploadedFile) }
        : null,
    };
    setChat((prev) => [...prev, userMsg]);
    setUploading(true);

    const formData = new FormData();
    if (uploadedFile) formData.append("file", uploadedFile);
    formData.append("text", text);

    try {
      const res = await fetch("api/dummy-submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setChat((prev) => [
        ...prev,
        {
          role: "api",
          text: data.message || data.error || "No response",
          file: data.file
            ? { name: data.file.name, url: userMsg.file?.url }
            : null,
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: api, text: "Failed to send", file: null },
      ]);
    }
    setText("");
    setUploadedFile(null);
    setUploading(false);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHistory}>
        {chat.map((msg, idx) => (
          <ChatBubble key={idx} message={msg} />
        ))}
      </div>
      <div className={styles.textboxSticky}>
        {chat.length === 0 && <UploadUI onFileUploaded={setUploadedFile} />}
        <TextBox
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSend={handleSend}
          disabled={uploading}
        />
      </div>
    </div>
  );
}

export default ChatUI;
