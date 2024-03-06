"use client";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PopupNewCollection from "./PopupNewCollection";
import EditorToolsActions from "./EditorToolsActions";

interface IProps {
  collectionKey: string;
}

const EditorToolsContainer = ({ collectionKey }: IProps) => {
  const [activePopup, setActivePopup] = useState<
    undefined | "newCollection" | "newItem"
  >(undefined);

  return (
    <>
      {activePopup === "newCollection" && (
        <PopupNewCollection
          onClose={() => setActivePopup(undefined)}
          collectionKey={collectionKey}
        />
      )}
      <EditorToolsActions openPopup={setActivePopup} />
    </>
  );
};

export default EditorToolsContainer;
