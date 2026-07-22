import { UPLOADS_URL } from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import placeholderFood from "../../../assets/image copy 2.png";

const NewMenu = ({ products }) => {
  const navigate = useNavigate();
  const newFoods = [...products]
    .sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
    .slice(0, 6);

  return (
    <div>
      <div className="px-4 sm:px-8 lg:px-15 mt-10 py-5 bg-gray-300 rounded-2xl">
        <div>
          <h1 className="text-black font-bold text-2xl p-4">
            New on Crave24H
          </h1>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide p-2">
          {newFoods.map((item) => (
            <button
              key={item.product_id}
              onClick={() => navigate(`/restaurant/${item.Restaurant?.restaurant_id}`)}
              className="card-hover btn-press relative w-[85vw] sm:w-155 max-w-155 shrink-0 bg-white rounded-3xl p-4 flex gap-4 items-start transition-all hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={item.image ? `${UPLOADS_URL}/${item.image}` : placeholderFood}
                  alt={item.product_name}
                  className="w-40 h-35 object-cover rounded-3xl"
                  onError={(e) => { e.target.src = placeholderFood; }}
                />
                <div className="absolute top-0 left-0 bg-[#004953] text-white px-3 py-1 rounded-br-3xl rounded-tl-3xl text-sm font-semibold">
                  NEW
                </div>
              </div>

              <div className="flex flex-col flex-1 items-start">
                <h2 className="text-lg font-bold">
                  {item.product_name}
                </h2>

                <p className="text-start text-sm text-gray-600 mt-2 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center w-full mt-4">
                  <div>
                    <p className="text-xl font-bold text-[#004953]">
                      ${item.price}
                    </p>

                    {item.discount > 0 && (
                      <p className="text-red-500 text-sm">
                        {item.discount}% OFF
                      </p>
                    )}
                  </div>

                  <div className="w-10 h-10 bg-[#004953] rounded-full flex items-center justify-center hover:scale-105 transition">
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-white"
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewMenu;