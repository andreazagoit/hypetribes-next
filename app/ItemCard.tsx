import React from "react";
import Link from "next/link";
import Card from "@/components/Card";

interface IProps {
  item: Item;
}

const ItemCard = ({ item }: IProps) => {
  return (
    <Link href={`/items/${item.key}`}>
      <Card>
        <div className="flex">
          {/* <img
            src={item.images[0] as string}
            className="h-48 w-36 mr-4"
            alt={item.name}
          /> */}
          <div>
            <p className="text-blue-500 text-xs text-bold">
              {item.releaseDate}
            </p>
            <h1 className="text-xl font-bold mb-2">{item.name}</h1>
            <p className="mb-2 text-sm">{item.description}</p>
            <p className="font-bold">{item.price}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ItemCard;