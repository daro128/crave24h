import { UPLOADS_URL } from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import placeholderFood from "../../../assets/image copy 2.png";

const ItemModal = ({
  isOpen,
  onClose,
  food,
  qauntity,
  setqauntity,
  setcartitems,
}) => {
  if (!isOpen || !food) return null;

  const increaseQuantity = () => {
    setqauntity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setqauntity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const total = qauntity * Number(food.price);

  const addToCart = () => {
    setcartitems((prev) => {
      const existing = prev.find(
        (item) => item.product_id === food.product_id
      );

      if (existing) {
        return prev.map((item) =>
          item.product_id === food.product_id
            ? {
                ...item,
                quantity: item.quantity + qauntity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          product_id: food.product_id,
          product_name: food.product_name,
          image: food.image,
          price: Number(food.price),
          quantity: qauntity,
          note: "",
        },
      ];
    });

    setqauntity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="animate-fade-in-scale bg-white w-full max-w-107 rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-press absolute right-4 top-4 text-xl hover:text-red-500 z-10"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Product Image */}
        <img
          src={food.image ? `${UPLOADS_URL}/${food.image}` : placeholderFood}
          alt={food.product_name}
          className="w-full h-60 object-cover"
          onError={(e) => { e.target.src = placeholderFood; }}
        />

        <div className="p-6">

          {/* Name & Price */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#004953]">
              {food.product_name}
            </h2>

            <p className="text-xl font-bold text-[#004953]">
              ${Number(food.price).toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-500 mt-3">
            {food.description}
          </p>

          {/* Note */}
          <div className="mt-5">
            <label className="font-semibold text-[#004953]">
              Special Request
            </label>

            <textarea
              rows={4}
              placeholder="Add a note for the restaurant..."
              className="mt-2 w-full border rounded-xl p-3 outline-none focus:border-[#004953]"
            />
          </div>

          {/* Quantity */}
          <div className="flex justify-between items-center mt-6">

            <div className="flex items-center gap-4">

              <button
                onClick={decreaseQuantity}
                className="btn-press w-9 h-9 rounded-full border hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>

              <span className="font-bold text-lg">
                {qauntity}
              </span>

              <button
                onClick={increaseQuantity}
                className="btn-press w-9 h-9 rounded-full border hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>

            </div>

            <div className="font-bold text-xl text-[#004953]">
              Total: ${total.toFixed(2)}
            </div>

          </div>

          {/* Add to Cart */}
          <button
            onClick={addToCart}
            className="btn-press w-full mt-6 bg-[#004953] text-white py-3 rounded-xl hover:bg-black transition"
          >
            Add To Cart
          </button>

        </div>
      </div>
    </div>
  );
};

export default ItemModal;