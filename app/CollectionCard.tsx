import Link from "next/link";

interface IProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: IProps) => {
  return (
    <Link href={`/collections/${collection.id}`}>
      <div
        style={{ border: "2px solid red", padding: 20, background: "white" }}
      >
        <h1>{collection.name}</h1>
      </div>
    </Link>
  );
};

export default CollectionCard;
