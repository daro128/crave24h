import { UPLOADS_URL } from "../../../config";
import { useEffect, useState } from "react";
import ItemModal from "../RestaurantComponent/ItemModal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import Loading from "../../../pages/user_page/LoadingPage";

import { getProductsByRestaurant } from "../../../service/productService";
import { getRestaurantById } from "../../../service/restaurantService";
import placeholderFood from "../../../assets/image copy 2.png";

const RightSection = ({ setActiveCategory, setcartitems }) => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalopen, setModalopen] = useState(false);
  const [selectFood, setSelectfood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const res = await getRestaurantById(id);
        setRestaurant(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadRestaurant();
  }, [id]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const res = await getProductsByRestaurant(id);

        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Products error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[data-category]");
      let currentCategory = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) {
          currentCategory = section.id;
        }
      });

      if (currentCategory) {
        setActiveCategory(currentCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveCategory]);

  if (loading) return <div>
    <Loading/>
  </div>;
  if (!restaurant) return <div>Restaurant not found</div>;

  const categories = [
    ...new Set(products.map((item) => item.Category?.category_name)),
  ];

  return (
    <div className="flex-1 space-y-12">

      {categories.map((category) => (
        <section key={category} id={category} data-category className="scroll-mt-5">
          <h2 className="text-2xl font-bold mb-5 text-[#004953]">
            {category}
          </h2>

          <div className="grid lg:grid-cols-2 gap-5">
            {products
              .filter((food) => food.Category?.category_name === category)
              .map((food) => (
                <div
                  key={food.product_id}
                  className="card-hover bg-white shadow-lg border-l-4 border-[#004953] rounded-xl p-3 flex gap-4"
                >
                  <img
                    src={food.image ? `${UPLOADS_URL}/${food.image}` : placeholderFood}
                    className="w-24 h-24 rounded-lg object-cover shrink-0"
                    onError={(e) => { e.target.src = placeholderFood; }}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">
                      {food.product_name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {food.description}
                    </p>

                    <div className="flex justify-between mt-4">
                      <span className="font-semibold text-[#004953]">
                        ${food.price}
                      </span>

                      <button
                        onClick={() => {
                          setSelectfood(food);
                          setQuantity(1);
                          setModalopen(true);
                        }}
                        className="btn-press border px-6 py-1.5 hover:bg-[#004953] hover:text-white rounded-lg"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      <section className="bg-white p-4 rounded-2xl border-l-4 border-[#004953]">
        <h2 className="text-2xl font-bold mb-3">
          About {restaurant.restaurant_name}
        </h2>

        <p>{restaurant.description}</p>

        <div className="mt-3">
          <div>Address: {restaurant.address}</div>
          <div>Contact: {restaurant.phone}</div>
        </div>
      </section>

      <ItemModal
        isOpen={modalopen}
        food={selectFood}
        qauntity={quantity}
        setqauntity={setQuantity}
        setcartitems={setcartitems}
        onClose={() => {
          setModalopen(false);
          setSelectfood(null);
        }}
      />
    </div>
  );
};

export default RightSection;