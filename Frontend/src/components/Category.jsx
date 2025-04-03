import { useParams } from "react-router-dom";

const Category = () => {
  const { category } = useParams();

  return <div>Showing products for category: {category}</div>;
};
export default Category