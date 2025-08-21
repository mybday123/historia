"use client";

import styles from "../styles/UploadUI.module.css";
import { useRef } from "react";
import Button from "./Button";
import Icon from "./Icon";

function UploadUI() {
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File: ", file);
    }
  };

  return (
    <div className={styles.container}>
      <Icon name={"upload"} color={"#D6C7B7"} size={64} weight="800"></Icon>
      <Button onClick={handleBrowseClick}>Browse</Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png image/jpg image/jpeg"
        style={{ display: "none" }}
      />
      <p className={styles.p}>or drop an image here</p>
      <p className={styles.pSmall}>PNG,JPG,JPEG</p>
      <p className={styles.pSmall}>Max size: 15MB</p>
    </div>
  );
}

export default UploadUI;
