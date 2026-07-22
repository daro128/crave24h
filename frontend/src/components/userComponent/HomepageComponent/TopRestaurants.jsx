import { useNavigate } from "react-router-dom";
import placeholderRestaurant from "../../../assets/image copy 2.png";

const TopRestaurants = ({ restaurants }) => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="px-4 sm:px-8 lg:px-15 py-5 mt-10 rounded-2xl bg-gray-300">
                <h1 className="text-2xl sm:text-3xl text-[#004953] font-bold mb-8">
                    World-Class Dining Experience
                </h1>

                <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-4">
                    {restaurants.map((item, index) => (
                        <div
                            key={item.restaurant_id}
                            onClick={() => navigate(`/restaurant/${item.restaurant_id}`)}
                            className="relative min-w-[75%] sm:min-w-[45%] lg:min-w-[24%] shrink-0 overflow-hidden rounded-3xl group cursor-pointer"
                        >
                            <img
                                src={item.logo ? `http://localhost:5000/uploads/${item.logo}` : placeholderRestaurant}
                                alt={item.restaurant_name}
                                className="w-full h-80 object-cover transition-all duration-500 group-hover:scale-110"
                                onError={(e) => { e.target.src = placeholderRestaurant; }}
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent"></div>

                            <div className="absolute top-4 left-4 bg-[#004953] text-white px-4 py-1 rounded-full font-bold">
                                #{index + 1}
                            </div>

                            <div className="absolute bottom-24 left-4">
                                <div className="bg-[#004953] text-white text-xs px-4 py-1 rounded-full">
                                    ⭐ {item.average_rating} Rating
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h2 className="text-2xl font-bold">
                                    {item.restaurant_name}
                                </h2>

                                <p className="text-sm text-gray-200">
                                    {item.User?.full_name}
                                </p>

                                <p className="text-sm text-gray-300 mt-1">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TopRestaurants;