"use client";

import { useState, useEffect } from "react";
import UploadUI from "./UploadUI";
import TextBox from "./TextBox";
import styles from "../styles/ChatUI.module.css";
import stripMarkdown from "@/lib/stripMarkdown";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ChatBubble({ message }) {
  if (message.role === "waiting") {
    return (
      <div className={`${styles.bubble} ${styles.api}`}>
        <div className={styles.apiBubble}>
          <div
            className={styles.bubbleText}
            style={{ fontStyle: "italic", opacity: 0.7 }}
          >
            {message.text}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`${styles.bubble} ${
        message.role === "user" ? styles.user : styles.api
      }`}
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
        {message.text && (
          <div className={styles.bubbleText}>{stripMarkdown(message.text)}</div>
        )}
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
    if (!text.trim() && !uploadedFile) return;

    const userMsg = {
      role: "user",
      text,
      file: uploadedFile
        ? { name: uploadedFile.name, url: URL.createObjectURL(uploadedFile) }
        : null,
    };

    setChat((prev) => [
      ...prev,
      userMsg,
      { role: "waiting", text: "Waiting for response...", file: null },
    ]);
    setUploading(true);

    try {
      const res = await fetch("/api/unli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...chat.map((msg) => ({
              role: msg.role === "api" ? "assistant" : msg.role,
              content: msg.text,
            })),
            { role: "user", content: text },
          ],
          imageBase64: uploadedFile ? await toBase64(uploadedFile) : null,
        }),
      });

      const data = await res.json();
      setChat((prev) => {
        const waitingIndex = prev.findIndex(
          (msg, idx) => msg.role === "waiting" && idx === prev.length - 1,
        );
        let newChat =
          waitingIndex !== -1
            ? [...prev.slice(0, waitingIndex), ...prev.slice(waitingIndex + 1)]
            : [...prev];
        return [
          ...newChat,
          {
            role: "api",
            text: data.reply || data.error || "No response",
            file: null,
          },
        ];
      });
    } catch (err) {
      setChat((prev) => {
        let newChat = [...prev];
        if (newChat.length && newChat[newChat.length - 1].role === "waiting") {
          newChat = newChat.slice(0, -1);
        }
        return [
          ...newChat,
          { role: "api", text: "Failed to send", file: null },
        ];
      });
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
