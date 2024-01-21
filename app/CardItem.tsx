import Link from "next/link";
import React from "react";

interface IProps {
  item: Item;
}

const CardItem = ({ item }: IProps) => {
  return (
    <Link href={`/items/${item.id}`}>
      <div
        style={{
          border: "2px solid red",
          padding: 20,
          background: "white",
        }}
      >
        <img
          src={item.images[0] as string}
          style={{ height: 400, width: 300 }}
        />
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <p>{item.releaseDate}</p>
        <p>{item.price}</p>
      </div>
    </Link>
  );
};

export default CardItem;
