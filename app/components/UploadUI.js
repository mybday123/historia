"use client";

import styles from "../styles/UploadUI.module.css";
import { useCallback, useRef, useState } from "react";
import Button from "./Button";
import Icon from "./Icon";

function UploadUI({ onFileUploaded }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleBrowseClick = () => {
    if (!uploading) fileInputRef.current.click();
  };

  const handleFileUpload = (file) => {
    setError("");
    setErrorType("");

    if (file.size > 15 * 1024 * 1024) {
      setError("File too large");
      setErrorType("tooLarge");
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedFile({ name: file.name, url: url });
    if (onFileUploaded) onFileUploaded(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
      if (uploading) return;
      const file = event.dataTransfer.files && event.dataTransfer.files[0];
      handleFileUpload(file);
    },
    [uploading],
  );

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!uploading) setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleClearUpload = () => {
    setUploadedFile(null);
    setError("");
    setErrorType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileUploaded) onFileUploaded(null);
  };
  if (uploadedFile) {
    return (
      <div className={styles.uploadedcontainer}>
        <button
          className={styles.closebutton}
          onClick={handleClearUpload}
          aria-label="Close"
        >
          <Icon name={"close"} color="#d6c7b7" size={24} />
        </button>
        <img
          src={uploadedFile.url}
          alt={uploadedFile.name}
          className={styles.uploadedimage}
          draggable={false}
        />
        <div className={styles.filenamebox}>
          <Icon name={"image"} color="#d6c7b7" size={20} />
          <span className={styles.filenametext}>{uploadedFile.name}</span>
        </div>
      </div>
    );
  } else if (error) {
    return (
      <div className={styles.container}>
        <Icon
          name={"broken_image"}
          color={"#D6C7B7"}
          size={64}
          weight="800"
        ></Icon>
        {errorType === "tooLarge" ? (
          <p className={styles.p}>File too large</p>
        ) : (
          <p className={styles.p}>Something went wrong</p>
        )}
        <Button onClick={handleBrowseClick} disable={uploading}>
          {uploading ? "Uploading..." : "Browse..."}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png image/jpg image/jpeg"
          style={{ display: "none" }}
          disabled={uploading}
        />
      </div>
    );
  }
  return (
    <div
      className={styles.container}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Icon name={"upload"} color={"#D6C7B7"} size={64} weight="800"></Icon>
      <Button onClick={handleBrowseClick} disable={uploading}>
        {uploading ? "Uploading..." : "Browse..."}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png image/jpg image/jpeg"
        style={{ display: "none" }}
        disabled={uploading}
      />
      {error && <p className={styles.p}>{error}</p>}
      <p className={styles.p}>or drop an image here</p>
      <p className={styles.pSmall}>PNG, JPG, JPEG</p>
      <p className={styles.pSmall}>Max size: 15MB</p>
    </div>
  );
}

export default UploadUI;
