import React from "react";
import styles from "./styles.module.scss";

interface IProps {
  openPopup: React.Dispatch<
    React.SetStateAction<"newCollection" | "newItem" | undefined>
  >;
}

const EditorToolsActions = ({ openPopup }: IProps) => {
  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          openPopup("newCollection");
        }}
      >
        Crea collezione
      </button>
      <button onClick={() => openPopup("newItem")}>Crea item</button>
    </div>
  );
};

export default EditorToolsActions;
