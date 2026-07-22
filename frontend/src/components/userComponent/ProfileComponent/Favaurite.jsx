import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUtensils, faStore, faStar } from "@fortawesome/free-solid-svg-icons";
import {
  getFavouriteRestaurants,
  removeFavouriteRestaurant,
  getFavouriteProducts,
  removeFavouriteProduct,
} from "../../../service/favouriteService";
import placeholderImg from "../../../assets/image copy 2.png";
import Loading from "../../../pages/user_page/LoadingPage";
import { PATH } from "../../../path";

const Favaurite = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [rRes, pRes] = await Promise.all([
          getFavouriteRestaurants(),
          getFavouriteProducts(),
        ]);
        setRestaurants(rRes.data || []);
        setProducts(pRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleRemoveRestaurant = async (restaurantId) => {
    setRemovingId(restaurantId);
    try {
      await removeFavouriteRestaurant(restaurantId);
      setRestaurants((prev) =>
        prev.filter((r) => r.Restaurant.restaurant_id !== restaurantId)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleRemoveProduct = async (productId) => {
    setRemovingId(productId);
    try {
      await removeFavouriteProduct(productId);
      setProducts((prev) =>
        prev.filter((p) => p.Product.product_id !== productId)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">My Favourites</h1>
        <p className="text-gray-400 text-sm">
          {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} &amp;{" "}
          {products.length} product{products.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`btn-press flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeTab === "restaurants"
              ? "bg-[#004953] text-white shadow-md"
              : "bg-white border border-gray-200 text-gray-500 hover:border-[#004953] hover:text-[#004953]"
          }`}
        >
          <FontAwesomeIcon icon={faStore} />
          Restaurants ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`btn-press flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeTab === "products"
              ? "bg-[#004953] text-white shadow-md"
              : "bg-white border border-gray-200 text-gray-500 hover:border-[#004953] hover:text-[#004953]"
          }`}
        >
          <FontAwesomeIcon icon={faUtensils} />
          Products ({products.length})
        </button>
      </div>

      {/* Restaurants Tab */}
      {activeTab === "restaurants" && (
        <>
          {restaurants.length === 0 ? (
            <EmptyState
              icon={faStore}
              title="No favourite restaurants yet"
              subtitle="Browse restaurants and tap the heart to save them here"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((item) => {
                const r = item.Restaurant;
                return (
                  <div
                    key={item.favourite_id}
                    onClick={() => navigate(PATH.USER.Restaurant(r.restaurant_id))}
                    className="card-hover bg-white rounded-3xl overflow-hidden border border-[#004953] shadow-sm transition-all duration-300 hover:cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={r.logo ? `http://localhost:5000/uploads/${r.logo}` : placeholderImg}
                        alt={r.restaurant_name}
                        className="w-full h-40 object-cover"
                        onError={(e) => { e.target.src = placeholderImg; }}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveRestaurant(r.restaurant_id); }}
                        disabled={removingId === r.restaurant_id}
                        className="btn-press absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:scale-110 transition-transform disabled:opacity-50"
                        title="Remove from favourites"
                      >
                        <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                      </button>
                      <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                          r.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {r.status === "open" ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-lg text-[#22223B] truncate">
                        {r.restaurant_name}
                      </h3>
                      {r.address && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{r.address}</p>
                      )}
                      <div className="flex justify-between items-center mt-2 text-sm text-[#004953]">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                          {r.average_rating || "—"}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${r.fee || 0} delivery
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <>
          {products.length === 0 ? (
            <EmptyState
              icon={faUtensils}
              title="No favourite products yet"
              subtitle="Browse menus and tap the heart to save dishes here"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((item) => {
                const p = item.Product;
                return (
                  <div
                    key={item.favourite_id}
                    onClick={() => navigate(PATH.USER.Restaurant(p.restaurant_id))}
                    className="card-hover bg-white rounded-3xl overflow-hidden border border-pink-200 shadow-sm transition-all duration-300 hover:cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={p.image ? `http://localhost:5000/uploads/${p.image}` : placeholderImg}
                        alt={p.product_name}
                        className="w-full h-40 object-cover"
                        onError={(e) => { e.target.src = placeholderImg; }}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveProduct(p.product_id); }}
                        disabled={removingId === p.product_id}
                        className="btn-press absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:scale-110 transition-transform disabled:opacity-50"
                        title="Remove from favourites"
                      >
                        <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                      </button>
                      <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                          p.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.status === "available" ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-lg text-[#22223B] truncate">
                        {p.product_name}
                      </h3>
                      {p.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{p.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[#FF6B35] font-bold text-sm">
                          ${parseFloat(p.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
      <FontAwesomeIcon icon={icon} className="text-3xl text-pink-300" />
    </div>
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-sm text-gray-400 mt-1 max-w-xs">{subtitle}</p>
  </div>
);

export default Favaurite;
