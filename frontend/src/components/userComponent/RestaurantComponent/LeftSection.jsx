
import Card from "../../userComponent/RestaurantComponent/Card";

const LeftSection = ({ activeCategory, cartitems, setcartitems, categories = [] }) => {

  const handleScroll = (category) => {
    const element = document.getElementById(category);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="w-full sticky top-3 flex flex-col gap-6">
      
      {/* CATEGORY LIST */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <h2 className="text-xl font-bold mb-5">Categories</h2>

        <div className="space-y-1.5">
          {categories.map((name) => (
            <button
              key={name}
              onClick={() => handleScroll(name)}
              className={`btn-press w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-200
                ${
                  activeCategory === name
                    ? "bg-[#004953] text-white"
                    : "bg-gray-100 hover:bg-[#004953] hover:text-white"
                }
              `}
            >
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CART */}
      <div>
        <Card setcartitems={setcartitems} cartitems={cartitems} />
      </div>
    </div>
  );
};

export default LeftSection;