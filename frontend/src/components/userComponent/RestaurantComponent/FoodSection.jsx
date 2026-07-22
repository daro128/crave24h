import LeftSection from "./LeftSection";
import RightSection from "../../userComponent/RestaurantComponent/RightSection";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductsByRestaurant } from "../../../service/productService";
import Loading from "../../../pages/user_page/LoadingPage";

const FoodSection = () => {
  const { id } = useParams();

  const [activeCategory, setActiveCategory] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await getProductsByRestaurant(id);

        // IMPORTANT: backend returns { products: [] }
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);
  const categories = [
    ...new Set(products.map((p) => p.Category?.category_name)),
  ];

  if (loading) {
    return <div className="p-10"><Loading/></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 px-4 sm:px-5 gap-8">

      <div className="lg:col-span-2">
        <LeftSection
          activeCategory={activeCategory}
          cartitems={cartItems}
          setcartitems={setCartItems}
          categories={categories}
        />
      </div>

      <div className="lg:col-span-4">
        <RightSection
          products={products}
          setActiveCategory={setActiveCategory}
          setcartitems={setCartItems}
        />
      </div>

    </div>
  );
};

export default FoodSection;