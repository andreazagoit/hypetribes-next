import React, { useState } from "react";
import Popup from "@/components/Popup/Popup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

interface IProps {
  onClose: () => void;
  collectionKey: string;
}

const PopupNewCollection = ({ onClose, collectionKey }: IProps) => {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const router = useRouter();

  const [addCollection] = useMutation(ADD_COLLECTION);
  const createCollection = async () => {
    try {
      const { data } = await addCollection({
        variables: {
          key,
          name,
          collections: [collectionKey],
        },
      });
      router.push(data.addCollection.key);

      /* router.push() */
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  return (
    <Popup onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "self-start",
          gap: "1rem",
        }}
      >
        <p>Aggiungi alla collezione: {collectionKey}</p>
        <input
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
        <button onClick={createCollection}>Aggiungi</button>
      </div>
    </Popup>
  );
};

export default PopupNewCollection;

const ADD_COLLECTION = gql`
  mutation AddCollection(
    $key: String!
    $name: String!
    $collections: [String]!
  ) {
    addCollection(key: $key, name: $name, collections: $collections) {
      id
      key
      name
    }
  }
`;
