import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faLocationDot,
  faMagnifyingGlass,
  faStore,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import placeholderRestaurant from "../../assets/image copy 2.png";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import { getAllRestaurants } from "../../service/restaurantService";
import {
  getFavouriteRestaurants,
  addFavouriteRestaurant,
  removeFavouriteRestaurant,
} from "../../service/favouriteService";
import Loading from "./LoadingPage";
import Reveal from "../../components/common/Reveal";

const AllRestaurantsPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [togglingId, setTogglingId] = useState(null);
  const [poppedId, setPoppedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, fRes] = await Promise.all([
          getAllRestaurants(),
          getFavouriteRestaurants().catch(() => ({ data: [] })),
        ]);
        setRestaurants(rRes.data);
        const ids = new Set((fRes.data || []).map((f) => f.Restaurant.restaurant_id));
        setFavouriteIds(ids);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleFavourite = async (e, restaurantId) => {
    e.stopPropagation();
    if (togglingId === restaurantId) return;
    setTogglingId(restaurantId);
    try {
      if (favouriteIds.has(restaurantId)) {
        await removeFavouriteRestaurant(restaurantId);
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          next.delete(restaurantId);
          return next;
        });
      } else {
        await addFavouriteRestaurant(restaurantId);
        setFavouriteIds((prev) => new Set([...prev, restaurantId]));
        setPoppedId(restaurantId);
        setTimeout(() => setPoppedId(null), 400);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = restaurants
    .filter(
      (r) =>
        r.restaurant_name.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "rating") return b.average_rating - a.average_rating;
      if (sort === "name") return a.restaurant_name.localeCompare(b.restaurant_name);
      return 0;
    });

    if (loading) {
      return <Loading/>;
    }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />


        <div className="mt-10 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#004953]">All Restaurants</h1>
          <p className="text-gray-500 mt-2">
            {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>


        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="relative flex-1 min-w-full sm:min-w-64 max-w-full sm:max-w-md">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-[#004953] transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "Default", value: "default" },
              { label: "Top Rated", value: "rating" },
              { label: "A–Z", value: "name" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSort(option.value)}
                className={`btn-press px-5 py-3 rounded-2xl font-semibold transition ${
                  sort === option.value
                    ? "bg-[#004953] text-white shadow-md"
                    : "bg-white text-[#004953] border border-gray-400 hover:bg-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-gray-500 text-lg">No restaurants found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, index) => {
              const isFav = favouriteIds.has(r.restaurant_id);
              const isPopped = poppedId === r.restaurant_id;
              return (
                <Reveal key={r.restaurant_id} delay={Math.min(index, 6) * 80}>
                <div
                  onClick={() => navigate(`/restaurant/${r.restaurant_id}`)}
                  className="card-hover bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={r.image ? `http://localhost:5000/uploads/${r.image}` : placeholderRestaurant}
                      alt={r.restaurant_name}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.src = placeholderRestaurant; }}
                    />

                    {/* Heart button */}
                    <button
                      onClick={(e) => toggleFavourite(e, r.restaurant_id)}
                      disabled={togglingId === r.restaurant_id}
                      title={isFav ? "Remove from favourites" : "Add to favourites"}
                      className={`btn-press absolute top-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md
                        transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed z-10
                        ${isPopped ? "scale-125" : "scale-100"}`}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`text-lg transition-all duration-200 ${
                          isFav ? "text-red-500 drop-shadow-sm" : "text-gray-300"
                        }`}
                      />
                    </button>

                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow text-sm font-semibold">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                      {r.average_rating || "—"}
                    </div>

                    <div
                      className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                        r.status === "open" ? "bg-green-500" : "bg-red-400"
                      }`}
                    >
                      {r.status === "open" ? "Open" : "Closed"}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-xl font-bold text-[#004953] truncate">{r.restaurant_name}</h2>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                      <FontAwesomeIcon icon={faStore} />
                      <span>{r.User?.full_name || "Restaurant"}</span>
                    </div>

                    <div className="flex gap-2 items-start text-gray-500 text-sm mt-1">
                      <FontAwesomeIcon icon={faLocationDot} className="text-[#004953] mt-0.5 shrink-0" />
                      <p className="line-clamp-1">{r.address}</p>
                    </div>

                    <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-1">{r.description}</p>

                    <button className="btn-press mt-4 w-full py-2.5 rounded-xl bg-[#004953] text-white hover:bg-black transition font-semibold">
                      View Restaurant
                    </button>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

export default AllRestaurantsPage;
