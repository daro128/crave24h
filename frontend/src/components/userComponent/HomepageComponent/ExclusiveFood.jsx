import { useNavigate } from "react-router-dom";
import placeholderFood from "../../../assets/image copy 2.png";
import Reveal from "../../common/Reveal";

const ExclusiveFood = ({ products }) => {
  const navigate = useNavigate();
  const exclusiveProducts = products.slice(0, 5);

  return (
    <div className="bg-gray-200 rounded-3xl mt-10">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#004953]">
              Exclusive Deals For You
            </h1>

            <p className="text-gray-600 mt-1">
              Save more on our most popular dishes today.
            </p>
          </div>

          <button className="btn-press bg-[#004953] text-white px-6 py-3 rounded-full hover:bg-black transition self-start sm:self-auto">
            View All Deals
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {exclusiveProducts.map((product, index) => (
            <Reveal key={product.product_id} delay={Math.min(index, 6) * 80}>
            <div
              onClick={() => navigate(`/restaurant/${product.Restaurant?.restaurant_id}`)}
              className="card-hover relative overflow-hidden rounded-3xl group cursor-pointer"
            >
              <img
                src={product.image ? `http://localhost:5000/uploads/${product.image}` : placeholderFood}
                alt={product.product_name}
                className="w-full h-72 object-cover transition duration-500 group-hover:scale-110"
                onError={(e) => { e.target.src = placeholderFood; }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>

              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                {product.discount > 0
                  ? `${product.discount}% OFF`
                  : "Special"}
              </div>
              <div className="absolute top-4 right-4 bg-white/90 text-[#004953] px-3 py-1 rounded-full text-xs font-semibold">
                🔥 {product.sold_count} Sold
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h2 className="text-xl font-bold">
                  {product.product_name}
                </h2>

                <p className="text-sm text-gray-200 line-clamp-2 mt-1">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold">
                      ${product.price}
                    </p>

                    {product.discount > 0 && (
                      <p className="text-sm line-through text-gray-300">
                        $
                        {(
                          product.price /
                          (1 - product.discount / 100)
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <button className="btn-press bg-[#004953] hover:bg-[#006b63] px-5 py-2 rounded-full transition">
                    Order
                  </button>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExclusiveFood;