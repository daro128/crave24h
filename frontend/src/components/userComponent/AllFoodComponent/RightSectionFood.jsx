import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholderFood from "../../../assets/image copy 2.png";
import { PATH } from "../../../path";
import Reveal from "../../common/Reveal";
import {
  getFavouriteProducts,
  addFavouriteProduct,
  removeFavouriteProduct,
} from "../../../service/favouriteService";

const RightSectionFood = ({ products = [] }) => {
  const navigate = useNavigate();
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [togglingId, setTogglingId] = useState(null);
  const [poppedId, setPoppedId] = useState(null);

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const res = await getFavouriteProducts();
        const ids = new Set((res.data || []).map((f) => f.Product.product_id));
        setFavouriteIds(ids);
      } catch {
        // not logged in — leave empty
      }
    };
    loadFavourites();
  }, []);

  const toggleFavourite = async (e, productId) => {
    e.stopPropagation();
    if (togglingId === productId) return;
    setTogglingId(productId);
    try {
      if (favouriteIds.has(productId)) {
        await removeFavouriteProduct(productId);
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await addFavouriteProduct(productId);
        setFavouriteIds((prev) => new Set([...prev, productId]));
        setPoppedId(productId);
        setTimeout(() => setPoppedId(null), 400);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="lg:col-span-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.length > 0 ? (
          products.map((product, index) => {
            const isFav = favouriteIds.has(product.product_id);
            const isPopped = poppedId === product.product_id;
            return (
              <Reveal key={product.product_id} delay={Math.min(index, 6) * 80}>
              <div
                onClick={() => navigate(PATH.USER.Restaurant(product.restaurant_id))}
                className="card-hover bg-white rounded-2xl shadow-md overflow-hidden transition-all cursor-pointer relative"
              >
                <img
                  src={product.image ? `http://localhost:5000/uploads/${product.image}` : placeholderFood}
                  alt={product.product_name}
                  className="w-full h-52 object-cover"
                  onError={(e) => { e.target.src = placeholderFood; }}
                />

                <button
                  onClick={(e) => toggleFavourite(e, product.product_id)}
                  disabled={togglingId === product.product_id}
                  title={isFav ? "Remove from favourites" : "Add to favourites"}
                  className={`btn-press absolute top-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md
                    transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed
                    ${isPopped ? "scale-125" : "scale-100"}`}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`text-lg transition-all duration-200 ${
                      isFav ? "text-red-500 drop-shadow-sm" : "text-gray-300"
                    }`}
                  />
                </button>

                <div className="p-4">
                  <h2 className="font-bold text-lg text-[#004953]">{product.product_name}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-[#004953] text-lg">${product.price}</span>
                    <span className="text-sm text-gray-500">{product.Restaurant?.restaurant_name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="flex items-center gap-1 text-yellow-500">
                      <FontAwesomeIcon icon={faStar} />
                      {product.Restaurant?.average_rating || "4.8"}
                    </span>
                    <span className="text-sm text-gray-500">{product.Category?.category_name}</span>
                  </div>
                </div>
              </div>
              </Reveal>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">No food found.</div>
        )}
      </div>
    </div>
  );
};

export default RightSectionFood;
