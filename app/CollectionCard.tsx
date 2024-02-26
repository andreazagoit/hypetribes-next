import Card from "@/components/Card";
import Link from "next/link";

interface IProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: IProps) => {
  return (
    <Link href={`/collections/${collection.key}`}>
      <Card title={collection.name}>ciao</Card>
    </Link>
  );
};

export default CollectionCard;
