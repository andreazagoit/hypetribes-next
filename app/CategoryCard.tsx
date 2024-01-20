import Link from "next/link";

interface IProps {
  category: Category;
}

const CategoryCard = ({ category }: IProps) => {
  return (
    <Link href={`/categories/${category.id}`}>
      <div
        style={{ border: "2px solid red", padding: 20, background: "white" }}
      >
        <h1>{category.name}</h1>
      </div>
    </Link>
  );
};

export default CategoryCard;
