import { UPLOADS_URL } from "../../../config";
import image20 from "../../../assets/image copy 20.png";
import placeholderFood from "../../../assets/image copy 2.png";
import { useNavigate } from "react-router-dom";

const Tredingfood = ({ products }) => {
  const navigate = useNavigate();
  const trendingFoods = [...products]
    .sort((a, b) => b.sold_count - a.sold_count)
    .slice(0, 6);

  return (
    <div className="px-4 sm:px-8 lg:px-15 mt-10 rounded-2xl py-12 lg:py-20 bg-gray-300">
      {/* Header */}
      <div className="flex items-center gap-2">
          <img src={image20} className="w-5 h-3" alt="" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#004953]">
            Trending Now
          </h1>
        </div>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide p-2">
        {trendingFoods.map((food) => (
          <div
            key={food.product_id}
            onClick={() => navigate(`/restaurant/${food.Restaurant?.restaurant_id}`)}
            className="card-hover bg-white rounded-3xl shadow-md min-w-[75%] sm:min-w-[45%] lg:min-w-[31%] shrink-0 overflow-hidden relative cursor-pointer"
          >
            <img
              src={food.image ? `${UPLOADS_URL}/${food.image}` : placeholderFood}
              alt={food.product_name}
              className="w-full h-60 object-cover"
              onError={(e) => { e.target.src = placeholderFood; }}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>

            <div className="absolute bottom-5 left-5 text-white">
              <div className="bg-pink-600 inline-block px-3 py-1 rounded-full text-xs">
                {food.sold_count}+ Orders
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {food.product_name}
              </h2>

              <p>${food.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tredingfood;