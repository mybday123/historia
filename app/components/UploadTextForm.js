"use client";

import { useState } from "react";
import UploadUI from "./UploadUI";
import TextBox from "./TextBox";
import Button from "./Button";

function UploadTextForm() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFileUploaded = (file) => {
    setUploadedFile(file);
    setResponse("");
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSend = async () => {
    if (!uploadedFile) {
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("text", text);

    try {
      const res = await fetch("/api/dummy-submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
      console.log(data);
    } catch (err) {
      setResponse({ error: "Failed to send" });
    }
    setUploading(false);
  };

  return (
    <>
      <UploadUI
        onFileUploaded={(fileObj) => {
          setUploadedFile(fileObj);
          setResponse(null);
        }}
      />
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
