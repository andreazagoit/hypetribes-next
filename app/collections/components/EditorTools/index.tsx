import { getCurrentUser } from "@/app/api/graphql/resolvers/user";
import React from "react";
import EditorToolsContainer from "./EditorToolsContainer";

interface IProps {
  collectionKey: string;
}

const EditorTools = ({ collectionKey }: IProps) => {
  const user: User | undefined = getCurrentUser();

  if (!(user && (user.role === "admin" || user.role === "editor"))) return null;

  return <EditorToolsContainer collectionKey={collectionKey} />;
};

export default EditorTools;
