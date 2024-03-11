"use client";
import usePopupStore from "@/state/popupStore";
import React from "react";
import Popup from "../Popup/Popup";

const PopupProvider = () => {
  const popupType = usePopupStore((state: any) => state.popupType);
  const setPopupType = usePopupStore((state: any) => state.setPopupType);

  if (!popupType) return;

  return (
    <Popup onClose={() => setPopupType(undefined)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "self-start",
          gap: "1rem",
        }}
      >
        <p>Aggiungi alla collezione: {/* {collectionKey} */}</p>
        {/* <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ color: "black" }}
        />
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ color: "black" }}
        />
        <button onClick={createCollection}>Aggiungi</button> */}
      </div>
    </Popup>
  );
};

export default PopupProvider;
