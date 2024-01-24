import Link from "next/link";

interface IProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: IProps) => {
  return (
    <Link href={`/collections/${collection.key}`}>
      <div
        style={{
          border: "2px solid white",
          padding: 20,
          background: "var(--background-dark)",
        }}
      >
        <h1>{collection.name}</h1>
      </div>
    </Link>
  );
};

export default CollectionCard;
