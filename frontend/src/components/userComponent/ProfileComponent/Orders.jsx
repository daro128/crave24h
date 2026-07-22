import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faReceipt,
  faCircleCheck,
  faSpinner,
  faMotorcycle,
  faArrowRight,
  faStore,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { PATH } from "../../../path";
import { getOrders } from "../../../service/orderService";
import {
  getFavouriteRestaurants,
  removeFavouriteRestaurant,
} from "../../../service/favouriteService";
import placeholderRestaurant from "../../../assets/image copy 2.png";
import Loading from "../../../pages/user_page/LoadingPage";
import RateOrderModal from "./RateOrderModal";

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "ready", "on_the_way", "out_for_delivery"];
const PAST_STATUSES   = ["delivered", "completed", "cancelled"];

const getStatusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (ACTIVE_STATUSES.includes(s)) return "bg-amber-50 text-amber-700 border border-amber-200";
  if (s === "cancelled")           return "bg-red-50 text-red-600 border border-red-200";
  if (PAST_STATUSES.includes(s))   return "bg-green-50 text-green-700 border border-green-200";
  return "bg-gray-50 text-gray-500 border border-gray-200";
};

const Orders = ({ setactiveMenu }) => {
  const navigate = useNavigate();

  const [orders,         setOrders]        = useState([]);
  const [loading,        setLoading]       = useState(true);
  const [select,         setSelect]        = useState("All");
  const [favRestaurants, setFavRestaurants] = useState([]);
  const [removingFavId,  setRemovingFavId] = useState(null);
  const [ratingOrder,    setRatingOrder]   = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data.orders || res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchFavourites = async () => {
      try {
        const res = await getFavouriteRestaurants();
        setFavRestaurants(res.data || []);
      } catch { /* silent */ }
    };
    fetchOrders();
    fetchFavourites();
  }, []);

  const handleRemoveFav = async (e, restaurantId) => {
    e.stopPropagation();
    if (removingFavId === restaurantId) return;
    setRemovingFavId(restaurantId);
    try {
      await removeFavouriteRestaurant(restaurantId);
      setFavRestaurants(prev => prev.filter(f => f.Restaurant.restaurant_id !== restaurantId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingFavId(null);
    }
  };

  const isActive = (status) => ACTIVE_STATUSES.includes((status || "").toLowerCase());

  const activeCount = orders.filter(o => isActive(o.order_status)).length;
  const pastCount   = orders.filter(o => PAST_STATUSES.includes((o.order_status || "").toLowerCase())).length;

  const filteredOrders = orders.filter(order => {
    const status = (order.order_status || "").toLowerCase();
    if (select === "Active") return ACTIVE_STATUSES.includes(status);
    if (select === "Past")   return PAST_STATUSES.includes(status);
    return true;
  });

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={faReceipt} color="bg-[#004953]/10" iconColor="text-[#004953]" value={orders.length} label="Total Orders" />
        <StatCard icon={faSpinner} color="bg-amber-50" iconColor="text-amber-600" value={activeCount} label="Active"       />
        <StatCard icon={faCircleCheck} color="bg-green-50" iconColor="text-green-600"  value={pastCount} label="Completed"    />
      </div>

      {/* Orders section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#004953] text-lg">Order History</h2>

          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {[
              { key: "All",    count: orders.length },
              { key: "Active", count: activeCount   },
              { key: "Past",   count: pastCount     },
            ].map(({ key, count }) => (
              <button
                key={key}
                onClick={() => setSelect(key)}
                className={`btn-press px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${select === key
                    ? "bg-white text-[#004953] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {key}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-medium
                  ${select === key ? "bg-[#004953]/10 text-[#004953]" : "bg-gray-200 text-gray-400"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faReceipt} className="text-2xl text-gray-300" />
              </div>
              <p className="font-semibold text-gray-400">No orders here yet</p>
              <p className="text-sm text-gray-300 mt-1">Your {select.toLowerCase()} orders will appear here</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const active    = isActive(order.order_status);
              const itemCount = order.OrderItems?.reduce((t, i) => t + i.quantity, 0) ?? 0;
              const items     = order.OrderItems?.slice(0, 2) || [];
              const moreItems = (order.OrderItems?.length || 0) - 2;

              return (
                <div
                  key={order.order_id}
                  className="flex items-stretch group hover:bg-gray-50/70 transition-colors duration-150"
                >
                  <div className="w-28 shrink-0 overflow-hidden">
                    <img
                      src={order.Restaurant?.logo
                        ? `http://localhost:5000/uploads/${order.Restaurant.logo}`
                        : placeholderRestaurant}
                      alt={order.Restaurant?.restaurant_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.src = placeholderRestaurant; }}
                    />
                  </div>

                  <div className="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#004953] text-base truncate">
                          {order.Restaurant?.restaurant_name || "Restaurant"}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Order #{order.order_id} · {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </p>
                        {items.length > 0 && (
                          <p className="text-gray-500 text-xs mt-1.5 truncate">
                            {items.map(i => `${i.Product?.product_name || "Item"} ×${i.quantity}`).join(" · ")}
                            {moreItems > 0 && ` +${moreItems} more`}
                          </p>
                        )}
                      </div>

                      <span className={`shrink-0 inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${getStatusStyle(order.order_status)}`}>
                        {(order.order_status || "unknown").replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#004953] text-lg">
                          ${Number(order.total_amount || 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {(order.order_status || "").toLowerCase() === "delivered" && (
                          <button
                            onClick={() => setRatingOrder(order)}
                            className="btn-press flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-200"
                          >
                            <FontAwesomeIcon icon={faStar} className="text-xs" />
                            Rate Order
                          </button>
                        )}
                        <button
                          onClick={() =>
                            active
                              ? navigate(`${PATH.USER.Trackorder}/${order.order_id}`)
                              : navigate(PATH.USER.HOME)
                          }
                          className={`btn-press flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                            ${active
                              ? "bg-[#004953] text-white hover:bg-[#003940] shadow-sm"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          <FontAwesomeIcon icon={active ? faMotorcycle : faStore} className="text-xs" />
                          {active ? "Track Order" : "Reorder"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Favourite Restaurants */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[#004953] text-lg">Favourite Restaurants</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {favRestaurants.length > 0
                ? `${favRestaurants.length} saved restaurant${favRestaurants.length !== 1 ? "s" : ""}`
                : "None saved yet"}
            </p>
          </div>
          {favRestaurants.length > 0 && (
            <button
              onClick={() => setactiveMenu("Favourite")}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#004953] hover:text-[#002d33] transition-colors group"
            >
              View all
              <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {favRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={faHeart} className="text-rose-300 text-lg" />
            </div>
            <p className="font-semibold text-gray-400 text-sm">No favourites yet</p>
            <p className="text-xs text-gray-300 mt-1">Tap the heart on any restaurant to save it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favRestaurants.slice(0, 3).map(item => {
              const r = item.Restaurant;
              return (
                <div
                  key={item.favourite_id}
                  onClick={() => navigate(`/restaurant/${r.restaurant_id}`)}
                  className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={r.logo ? `http://localhost:5000/uploads/${r.logo}` : placeholderRestaurant}
                      alt={r.restaurant_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.src = placeholderRestaurant; }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                    <button
                      onClick={e => handleRemoveFav(e, r.restaurant_id)}
                      disabled={removingFavId === r.restaurant_id}
                      title="Remove from favourites"
                      className="btn-press absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faHeart} className="text-red-500 text-sm" />
                    </button>
                    <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${r.status === "open" ? "bg-green-500 text-white" : "bg-gray-600 text-white"}`}>
                      {r.status === "open" ? "Open" : "Closed"}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                      <h3 className="font-bold text-white text-sm truncate drop-shadow">{r.restaurant_name}</h3>
                    </div>
                  </div>

                  <div className="px-3 py-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[10px]" />
                      <span className="font-semibold text-[#004953]">{r.average_rating || "—"}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
                      ${r.fee || 0} delivery
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {ratingOrder && (
        <RateOrderModal order={ratingOrder} onClose={() => setRatingOrder(null)} />
      )}

    </div>
  );
};

const StatCard = ({ icon, color, iconColor, value, label }) => (
  <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm border border-gray-100">
    <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}>
      <FontAwesomeIcon icon={icon} className={`${iconColor} text-base`} />
    </div>
    <div>
      <p className="text-2xl font-black text-[#004953] leading-none">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
    </div>
  </div>
);

export default Orders;
