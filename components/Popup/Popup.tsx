import React from "react";
import styles from "./styles.module.scss";

interface IProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Popup = ({ children, onClose }: IProps) => {
  return (
    <div className={styles.overlayContainer}>
      <div
        className={`${styles.popup} bg-blue-900 bg-opacity-75 backdrop-filter backdrop-blur-lg text-white dark:bg-gray-800 dark:bg-opacity-75 dark:text-white `}
      >
        <button onClick={onClose}>chiudi</button>
        <div>{children}</div>
      </div>
      <div
        className={`${styles.overlay} bg-opacity-75 backdrop-filter backdrop-blur-lg`}
        onClick={onClose}
      />
    </div>
  );
};

export default Popup;
