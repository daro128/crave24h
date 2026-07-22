import { faCreditCard, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const CardPayment = () => {
  const [saveCard, setSaveCard] = useState(false);
  return (
    <div className="space-y-6 p-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Saved Cards
          </h3>
          <div className="flex items-center justify-between rounded-full border border-pink-200 bg-pink-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-gray-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Visa •••• 4521
              </span>

              <span className="rounded-full bg-[#004953] px-2 py-0.5 text-[10px] font-semibold text-white">
                DEFAULT
              </span>
            </div>

            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#004953]">
              <div className="h-2.5 w-2.5 rounded-full bg-[#004953]" />
            </div>
          </div>

          <button className="btn-press mt-4 text-sm font-medium text-[#004953] hover:underline">
            + Use a new card
          </button>
        </div>

        <div className="mt-8">
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            New Card Details
          </h3>
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Card Number
            </label>

            <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-4">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-gray-500"
              />

              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Expiry (MM/YY)
              </label>

              <input
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-600">
                CVV
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="text-[10px]"
                />
              </label>

              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Name on Card
            </label>
            <input
              type="text"
              placeholder="e.g. SARAH MILLER"
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
            />
          </div>
          <label className="mt-5 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={() => setSaveCard(!saveCard)}
              className="h-4 w-4 rounded border-gray-300"
            />

            <span className="text-sm text-gray-600">
              Save card for future orders
            </span>
          </label>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"> <img className="h-8" src="https://png.pngtree.com/png-vector/20250307/ourmid/pngtree-encrypted-file-icon-png-image_15744476.png" alt="" /> </div>
          <span className="text-sm font-medium text-gray-700">
            256-bit encrypted · Safe to pay
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <img
            src="https://1000logos.net/wp-content/uploads/2021/11/VISA-logo.png"
            alt="Visa"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-8"
          />
          <span className="font-bold text-gray-400">
            <img className="h-8 rounded-2xl" src="https://yt3.googleusercontent.com/ytc/AIdro_ljV-vXKHv8x9yHY_Z6RuI9jutIh6f8D0O1oYIY43fJiNo=s900-c-k-c0x00ffffff-no-rj" alt="" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;