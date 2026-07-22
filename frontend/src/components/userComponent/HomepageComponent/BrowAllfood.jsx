import { UPLOADS_URL } from "../../../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import image18 from "../../../assets/image copy 18.png";
import placeholderFood from "../../../assets/image copy 2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const BrowAllfood = ({ products }) => {
  const navigate = useNavigate();
  const [select, setSelect] = useState("Nearby");
  const [loves, setLoves] = useState({});

  const toggleLove = (id) => {
    setLoves((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filter = ["Nearby", "Popular", "Lowest Price"];

  let displayProducts = [...products];

  if (select === "Popular") {
    displayProducts.sort((a, b) => b.sold_count - a.sold_count);
  }

  if (select === "Lowest Price") {
    displayProducts.sort((a, b) => a.price - b.price);
  }

  return (
    <div className="py-5 px-4 sm:px-10 rounded-2xl bg-gray-300">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-2">
        <h1 className="font-bold text-[#004953] text-2xl">
          Browse All Food
        </h1>

        <div className="flex gap-2 bg-white rounded-2xl text-black overflow-x-auto scrollbar-hide">
          {filter.map((item) => (
            <button
              key={item}
              onClick={() => setSelect(item)}
              className={`btn-press shrink-0 transition-all ${
                select === item
                  ? "bg-[#004953] text-white rounded-2xl px-4 py-2"
                  : "px-4 py-2"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide gap-6 p-2">
        {displayProducts.map((food) => (
          <div
            key={food.product_id}
            onClick={() => navigate(`/restaurant/${food.Restaurant?.restaurant_id}`)}
            className="bg-white min-w-76 rounded-3xl p-2 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all relative cursor-pointer"
          >
            <img
              src={food.image ? `${UPLOADS_URL}/${food.image}` : placeholderFood}
              alt={food.product_name}
              className="w-full h-52 object-cover rounded-2xl"
              onError={(e) => { e.target.src = placeholderFood; }}
            />

            <button
              className="btn-press absolute top-7 left-7"
              onClick={(e) => { e.stopPropagation(); toggleLove(food.product_id); }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={`text-xl ${
                  loves[food.product_id]
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            <div className="mt-2 flex justify-between items-center">
              <h2 className="font-bold text-lg">
                {food.product_name}
              </h2>

              <span className="font-bold text-[#004953]">
                ${food.price}
              </span>
            </div>

            <p className="text-gray-500 text-sm h-8 overflow-hidden">
              {food.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <img
                  src={image18}
                  className="w-5 h-5"
                  alt=""
                />
                <span>4.8</span>
              </div>

              <span>{food.sold_count} Sold</span>
            </div>

            {food.discount > 0 && (
              <div className="mt-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {food.discount}% OFF
                </span>
              </div>
            )}

            <button className="btn-press mt-2 hover:cursor-pointer w-full py-3 rounded-xl border border-[#004953] text-[#004953] hover:bg-[#004953] hover:text-white transition">
              Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowAllfood;