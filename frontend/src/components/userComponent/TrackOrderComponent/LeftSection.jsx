import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faClock, faUtensils } from "@fortawesome/free-solid-svg-icons";
import placeholderFood from "../../../assets/image copy 2.png";

const LeftSection = ({ order }) => {
  const restaurant = order?.Restaurant?.restaurant_name || "Restaurant";
  const orderId = order?.order_id || "—";
  const items = order?.OrderItems || [];

  return (
    <div className="w-full rounded-3xl bg-white shadow-xl p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#004953] shrink-0">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {restaurant}
            </h3>
            <p className="text-sm text-[#004953]">Order #{orderId}</p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#004953]">
            <FontAwesomeIcon icon={faClock} />
            ARRIVING IN
          </span>
          <p className="mt-1.5 text-2xl font-bold text-[#004953]">25–35 min</p>
        </div>
      </div>

      <div className="my-5 border-t border-dashed border-gray-200" />

      {/* Items */}
      <div className="space-y-3 max-h-44 overflow-y-auto scroll-smooth pr-1">
        {items.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">
            No items found
          </p>
        ) : (
          items.map((item) => {
            const name = item.Product?.product_name || "Item";
            const quantity = item.quantity || 1;
            const price = Number(item.subtotal || 0).toFixed(2);

            return (
              <div
                key={item.order_item_id}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 transition hover:bg-emerald-50/50"
              >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 shrink-0 overflow-hidden">
                  {item.Product?.image ? (
                    <img
                      src={item.Product.image}
                      src={item.Product.image ? `http://localhost:5000/uploads/${item.Product.image}` : placeholderFood}
                      alt={name}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = placeholderFood; }}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUtensils} className="text-[#004953]" />
                  )}
                  {quantity > 1 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#004953] text-[10px] font-bold text-white">
                      {quantity}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Qty {quantity} · ${price}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default LeftSection;