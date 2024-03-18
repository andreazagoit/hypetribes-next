import Card from "@/components/Card";
import Link from "next/link";

interface IProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: IProps) => {
  return (
    <Link href={`/collections/${collection.key}`}>
      <Card style={{ padding: 20, textAlign: "center" }}>
        <h2 className="text-lg font-semibold">{collection.name}</h2>
      </Card>
    </Link>
  );
};

export default CollectionCard;
