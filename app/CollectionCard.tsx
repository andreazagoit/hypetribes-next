import Card from "@/components/Card";
import Link from "next/link";

interface IProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: IProps) => {
  return (
    <Link key={collection.id} href={`/collections/${collection.key}`}>
      <Card title={collection.name} content="ciao!" />
    </Link>
  );
};

export default CollectionCard;
