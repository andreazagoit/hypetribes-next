import React from "react";

interface IProps {
  params: {
    id: string;
  };
}

const ItemsPage = ({ params }: IProps) => {
  const { id } = params;
  return <div>ItemsPage{JSON.stringify(params)}</div>;
};

export default ItemsPage;
