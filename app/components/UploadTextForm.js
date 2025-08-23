"use client";

import { useState } from "react";
import UploadUI from "./UploadUI";
import TextBox from "./TextBox";

function UploadTextForm({ onFirstSubmit }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSend = async () => {
    if (!uploadedFile && !text) return;
    setUploading(true);
    const formData = new FormData();
    if (uploadedFile) formData.append("file", uploadedFile);
    formData.append("text", text);

    try {
      const res = await fetch("/api/dummy-submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onFirstSubmit({
        user: {
          text,
          file: uploadedFile
            ? {
                name: uploadedFile.name,
                url: URL.createObjectURL(uploadedFile),
              }
            : null,
        },
        api: {
          text: data.message || data.error || "No response",
          file: data.file
            ? {
                name: data.file.name,
                url: uploadedFile ? URL.createObjectURL(uploadedFile) : null,
              }
            : null,
        },
      });
    } catch (err) {
      setResponse({ error: "Failed to send" });
    }
    setUploading(false);
  };

  return (
    <>
      <UploadUI onFileUploaded={setUploadedFile} />
      {uploadedFile && (
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
