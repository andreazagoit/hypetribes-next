import React from "react";

interface IProps {
  item: Item;
}

const CardItem = ({ item }: IProps) => {
  return (
    <div style={{ border: "2px solid red", padding: 20, background: "white" }}>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>{item.releaseDate}</p>
      <p>{item.price}</p>
    </div>
  );
};

export default CardItem;
