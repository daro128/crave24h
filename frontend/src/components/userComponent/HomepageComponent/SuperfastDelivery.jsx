import { useNavigate } from "react-router-dom";
import placeholderRestaurant from "../../../assets/image copy 2.png";

const SuperfastDelivery = ({ restaurants }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="px-4 sm:px-10 rounded-2xl py-5 bg-gray-200 mt-15">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-2xl text-[#004953] font-bold p-4">
            Superfast Delivery
          </h1>

          <button className="btn-press bg-[#004953] text-white px-4 py-2 rounded-full self-start sm:self-auto ml-4 sm:ml-0">
            View All Fast Eats
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2 pb-4">
          {restaurants.map((item) => (
            <div
              key={item.restaurant_id}
              onClick={() => navigate(`/restaurant/${item.restaurant_id}`)}
              className="card-hover relative min-w-[75%] sm:min-w-[45%] lg:min-w-[24%] bg-white rounded-3xl p-4 hover:shadow-xl transition cursor-pointer"
            >
              <img
                src={item.image ? `http://localhost:5000/uploads/${item.image}` : placeholderRestaurant}
                alt={item.restaurant_name}
                className="w-full h-60 object-cover rounded-2xl"
                onError={(e) => { e.target.src = placeholderRestaurant; }}
              />

              <p className="absolute top-6 right-6 bg-[#004953] text-white px-3 py-1 rounded-full text-sm">
                {item.delivery_time || "30 mins"}
              </p>

              <h2 className="text-xl font-bold text-[#004953] mt-4">
                {item.restaurant_name}
              </h2>

              <p className="text-gray-500">
                {item.cuisine_type} • {item.distance || "0.5 km"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperfastDelivery;