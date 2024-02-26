import Card from "@/components/Card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IProps {
  item: Item;
}

const CardItem = ({ item }: IProps) => {
  return (
    <Link href={`/items/${item.id}`}>
      <Card title={item.name}>
        <div className="flex items-center justify-start border-2 border-white p-4 bg-background-dark">
          <div className="relative h-48 w-36 mr-4">
            <img
              src={item.images[0] as string}
              className="h-48 w-36 mr-4"
              alt={item.name}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold mb-2">{item.name}</h1>
            <p className="mb-2">{item.description}</p>
            <p className="mb-2">{item.releaseDate}</p>
            <p className="font-bold">{item.price}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CardItem;
