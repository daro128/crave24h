import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faTrash,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import placeholderFood from "../../../assets/image copy 2.png";
import { useEffect, useState } from "react";

import {
  getCart,
  updateCartItem,
  deleteCartItem,
} from "../../../service/cartService";
import Loading from "../../../pages/user_page/LoadingPage";
import { useNavigate } from "react-router-dom";
import { getProductsByRestaurant } from "../../../service/productService";

const Leftsection = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState(null); 
  const [suggestProducts, setSuggestProducts] = useState([]);

  const loadCart = async () => {
    try {
      const res = await getCart();

      // backend returns cart.CartItems
      const items = res.data.cart.CartItems || [];

      setOrderItems(items);

      if (items.length > 0) {
        const restaurantId = items[0].Product.restaurant_id;

        setRestaurantId(restaurantId);

        const productRes = await getProductsByRestaurant(restaurantId);

        const suggestions = productRes.data.products
          .filter(
            (p) =>
              !items.some(
                (cartItem) => cartItem.product_id === p.product_id
              )
          )
          .slice(0, 3);

        setSuggestProducts(suggestions);
      }
    } catch (err) {
      console.log(err);

      if (err.response?.status === 404) {
        setOrderItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Increase quantity
  const increaseQuantity = async (item) => {
    try {
      await updateCartItem(item.cart_item_id, {
        quantity: item.quantity + 1,
      });

      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (item) => {
    try {
      if (item.quantity === 1) {
        await deleteCartItem(item.cart_item_id);
      } else {
        await updateCartItem(item.cart_item_id, {
          quantity: item.quantity - 1,
        });
      }

      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete item
  const removeItem = async (item) => {
    try {
      await deleteCartItem(item.cart_item_id);

      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div> <Loading /></div>;
  }

  return (
    <div className="lg:col-span-3">
      <div className="bg-gray-100 rounded-3xl shadow-xl border border-gray-100 p-5 h-[500px] overflow-y-auto">

        {orderItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500">
            <FontAwesomeIcon icon={faCartShopping} className="text-4xl mb-3 text-gray-300" />
            <p className="font-medium">Your cart is empty.</p>
            <p className="text-sm text-gray-400 mt-1">
              Browse restaurants and add items to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">

            {orderItems.map((item) => (
              <div
                key={item.cart_item_id}
                className="shadow-md hover:shadow-lg bg-white rounded-xl p-3 transition"
              >
                <div className="flex gap-4">
                  <img
                    src={item.Product.image ? `http://localhost:5000/uploads/${item.Product.image}` : placeholderFood}
                    alt={item.Product.product_name}
                    className="w-24 h-24 rounded-xl object-cover"
                    onError={(e) => { e.target.src = placeholderFood; }}
                  />

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <h4 className="font-semibold text-lg">
                        {item.Product.product_name}
                      </h4>

                      <button
                        onClick={() => removeItem(item)}
                        className="btn-press w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition"
                        title="Remove item"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-gray-400 hover:text-red-500"
                        />
                      </button>

                    </div>

                    <p className="text-[#004953] mt-2">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    <div className="flex justify-between items-center mt-4">

                      <div className="flex items-center bg-gray-100 rounded-full px-1">

                        <button
                          onClick={() => decreaseQuantity(item)}
                          className="btn-press w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition"
                        >
                          <FontAwesomeIcon icon={faMinus} className="text-sm" />
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item)}
                          className="btn-press w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-sm" />
                        </button>

                      </div>

                      <div className="font-bold text-[#004953]">
                        $
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toFixed(2)}
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      <button
        onClick={() => navigate(`/restaurant/${restaurantId}`)}
        disabled={!restaurantId || orderItems.length === 0}
        className={`btn-press mt-6 w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-2
          ${
            !restaurantId || orderItems.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#004953] text-white hover:bg-[#00343b]"
          }`}
      >
        <FontAwesomeIcon icon={faPlus} />
        Add More Items
      </button>

      {suggestProducts.length > 0 && (
      <div className="mt-8">
        <h3 className="font-semibold text-[#004953] mb-3">You might also like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestProducts.map((product) => (
            <div
              key={product.product_id}
              className="card-hover bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/restaurant/${restaurantId}`)}
            >
              <img
                src={product.image ? `http://localhost:5000/uploads/${product.image}` : placeholderFood}
                className="w-full h-28 object-cover rounded-t-xl"
                alt={product.product_name}
                onError={(e) => { e.target.src = placeholderFood; }}
              />

              <div className="p-3">
                <h3 className="font-semibold line-clamp-1">
                  {product.product_name}
                </h3>

                <p className="text-[#004953] font-bold mt-1">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default Leftsection;