import Link from "next/link";
import React from "react";

interface IProps {
  item: Item;
}

const CardItem = ({ item }: IProps) => {
  return (
    <Link href={`/items/${item._id}`}>
      <div
        style={{ border: "2px solid red", padding: 20, background: "white" }}
      >
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <p>{item.releaseDate}</p>
        <p>{item.price}</p>
        <p>{`${item.comments.length} comment${
          item.comments.length === 1 ? "o" : "i"
        }`}</p>
      </div>
    </Link>
  );
};

export default CardItem;
