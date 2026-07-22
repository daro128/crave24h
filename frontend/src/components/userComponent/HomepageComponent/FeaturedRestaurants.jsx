import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faLocationDot,
    faStore,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../path";
import placeholderRestaurant from "../../../assets/image copy 2.png";

const FeaturedRestaurants = ({ restaurants }) => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="px-4 sm:px-10 mt-10 py-3 bg-gray-200 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#004953]">
                        Featured Restaurants
                    </h2>

                    <button onClick={() => navigate(PATH.USER.AllRestaurants)} className="btn-press self-start sm:self-auto px-5 py-2 rounded-2xl hover:cursor-pointer bg-[#004953] text-white hover:bg-black transition">
                        View All
                    </button>
                </div>

                <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-3">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.restaurant_id}
                            onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)}
                            className="card-hover bg-white rounded-3xl shadow-lg min-w-80 max-w-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
                        >
                            <div className="relative">
                                <img
                                    src={restaurant.logo ? `http://localhost:5000/uploads/${restaurant.logo}` : placeholderRestaurant}
                                    alt={restaurant.restaurant_name}
                                    className="w-full h-44 object-cover"
                                    onError={(e) => { e.target.src = placeholderRestaurant; }}
                                />

                                <div className="absolute top-3 left-3 bg-[#004953] text-white px-3 py-1 rounded-full text-xs">
                                    Featured
                                </div>

                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow">
                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                    {restaurant.average_rating}
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-1">

                                <h3 className="text-xl font-bold text-[#004953] truncate">
                                    {restaurant.restaurant_name}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                                    <FontAwesomeIcon icon={faStore} />
                                    Restaurant
                                </div>

                                <div className="flex gap-2 text-gray-500 text-sm ">
                                    <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="text-[#004953] mt-1"
                                    />
                                    <p className="line-clamp-2 h-10">
                                        {restaurant.address}
                                    </p>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2 h-10">
                                    {restaurant.description}
                                </p>

                                {/* Push button to bottom */}
                                <div className="mt-auto">
                                    <button className="btn-press w-full py-2 rounded-xl bg-[#004953] text-white hover:bg-black transition">
                                        View Restaurant
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedRestaurants;