"use client";

import { useState } from "react";
import UploadUI from "./UploadUI";
import TextBox from "./TextBox";

function UploadTextForm({ onFirstSubmit }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // helper convert file ke base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSend = async () => {
    if (!uploadedFile && !text) return;
    setUploading(true);
    setWaiting(true);

    const userMsg = {
      role: "user",
      text,
      file: uploadedFile
        ? {
            name: uploadedFile.name,
            url: URL.createObjectURL(uploadedFile),
          }
        : null,
    };
    const waitingMsg = {
      role: "waiting",
      text: "Waiting for response...",
      file: null,
    };
    const initialMsgs = [userMsg, waitingMsg];
    setMessages(initialMsgs);
    onFirstSubmit({ user: userMsg, api: waitingMsg });

    try {
      let imageBase64 = null;
      if (uploadedFile) {
        imageBase64 = await fileToBase64(uploadedFile);
      }

      const res = await fetch("/api/unli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: text || "Tolong analisis gambar ini.",
            },
          ],
          imageBase64,
        }),
      });

      const data = await res.json();

      const apiMsg = {
        role: "api",
        text: data.reply || data.error || "No response",
        file: null,
      };
      const finalMsgs = [userMsg, apiMsg];
      setMessages(finalMsgs);
      onFirstSubmit({ user: userMsg, api: apiMsg });
    } catch (err) {
      console.error("UploadTextForm error:", err);
      const apiMsg = { role: "api", text: "Failed to send", file: null };
      setMessages([userMsg, apiMsg]);
      onFirstSubmit({ user: userMsg, api: apiMsg });
    }

    setUploading(false);
    setWaiting(false);
  };

  return (
    <>
      <UploadUI onFileUploaded={setUploadedFile} />
      {(uploadedFile || text) && (
        <TextBox
          value={text}
          onChange={handleTextChange}
          onSend={handleSend}
          disabled={uploading}
        />
      )}
    </>
  );
}

export default UploadTextForm;
