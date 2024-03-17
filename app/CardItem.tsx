import React from "react";
import Link from "next/link";
import Card from "@/components/Card";
import Image from "next/image";
import moment from "moment";

interface IProps {
  item: Item;
}

const ItemCard = ({ item }: IProps) => {
  return (
    <Link href={`/items/${item.key}`}>
      <Card>
        <div className="flex" style={{ flexDirection: "column" }}>
          <div
            style={{ position: "relative", width: "100%", paddingTop: "100%" }}
          >
            <Image
              src={item.images[0]}
              alt="item"
              layout="fill"
              objectFit="contain"
              style={{ borderRadius: 8 }}
            />
          </div>
          <div>
            <p className="text-blue-500 text-xs text-bold mt-2">
              {moment(item.releaseDate).format("MMMM DD, YYYY")}
            </p>
            <h1 className="font-bold mb-2">{item.name}</h1>
            <p className="mb-2 text-sm">{item.description}</p>
            <p className="font-bold">{item.price}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ItemCard;
