import { UPLOADS_URL } from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../path";
import { addToCart } from "../../../service/cartService";
import placeholderFood from "../../../assets/image copy 2.png";

const Card = ({ cartitems, setcartitems }) => {
  const navigate = useNavigate();

  const subtotal = cartitems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const deliveryFee = 1.5;
  const total = subtotal + deliveryFee;

  const increaseQuantity = (productId) => {
    setcartitems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setcartitems((prev) =>
      prev
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: Number(item.quantity) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

const handleCheckout = async () => {
  try {
    console.log("Cart Items:", cartitems);

    for (const item of cartitems) {
      console.log("Sending:", {
        product_id: item.product_id,
        quantity: item.quantity,
      });

      await addToCart({
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }

    setcartitems([]);
    navigate(PATH.USER.Checkout);
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message);
  }
};

  return (
    <div className="bg-white rounded-3xl shadow-xl border p-5 w-full max-w-md h-90 overflow-y-auto">

      <div className="bg-[#004953] rounded-2xl p-2 flex justify-center">
        <h3 className="font-bold text-white text-lg">
          Your Items
        </h3>
      </div>

      <div className="mt-3 space-y-3">
        {cartitems.map((item) => (
          <div key={item.product_id} className="border-b pb-3">

            <div className="flex justify-between items-center gap-4">

              <div className="flex gap-4 items-center flex-1">
                <img
                  src={item.image ? `${UPLOADS_URL}/${item.image}` : placeholderFood}
                  alt={item.product_name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={(e) => { e.target.src = placeholderFood; }}
                />

                <div>
                  <h4 className="font-semibold">
                    {item.product_name}
                  </h4>

                  <p className="font-bold text-[#004953] mt-1">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-gray-100 rounded-full p-1">

                <button
                  onClick={() => decreaseQuantity(item.product_id)}
                  className="btn-press w-8 h-8 flex items-center justify-center bg-white rounded-full"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>

                <span className="px-3 font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.product_id)}
                  className="btn-press w-8 h-8 flex items-center justify-center bg-[#004953] text-white rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">

        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-[#004953]">
            ${total.toFixed(2)}
          </span>
        </div>

      </div>

      <button
        disabled={cartitems.length === 0}
        onClick={handleCheckout}
        className={`btn-press w-full mt-5 py-4 rounded-2xl font-semibold transition-all ${
          cartitems.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#004953] text-white hover:scale-[1.03]"
        }`}
      >
        Proceed to Checkout
      </button>

    </div>
  );
};

export default Card;