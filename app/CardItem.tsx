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
            style={{
              height: "auto",
              width: "calc(100%)",
              position: "relative", // Add this line to make the overlay position relative to the container
              paddingTop: "100%", // Make the height the same as the width
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `url(${item.images[0]})`,
              backgroundSize: "cover",
              backdropFilter: "blur(8px)", // Apply blur to the entire container including overlay
            }}
          >
            {/* Add the overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.6)", // Adjust the opacity as needed
                backdropFilter: "blur(4px)", // Apply blur to the overlay only
              }}
            ></div>
            <Image
              src={item.images[0]}
              alt="item"
              layout="fill"
              objectFit="contain"
              style={{ borderRadius: 8, padding: 10 }}
            />
          </div>
          <div style={{ padding: 12 }}>
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
