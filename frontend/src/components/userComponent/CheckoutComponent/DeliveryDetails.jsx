import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCheck,
  faLock,
  faPen,
  faPhone,
  faTruck,
  faTag,
  faGift,
  faCreditCard,
  faChevronRight,
  faShieldHalved,
  faMap,
  faBuilding,
  faXmark,
  faCircleInfo,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../path";
import { updateProfile } from "../../../service/profileService";

const DeliveryDetails = ({
  customer,
  summary,
  reload,
}) => {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (customer) {
      setFullName(customer.User?.full_name || "");
      setPhone(customer.User?.phone || "");
      setAddress(customer.address || "");
      setCity(customer.city || "");
    }
  }, [customer]);

  const saveAddress = async () => {
    try {
      await updateProfile({
        full_name: fullName,
        phone,
        address,
        city,
      });

      setEditing(false);
      reload();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-[#004953] text-white w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faHouse} className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#004953]">
                  Delivery Details
                </h2>
                <p className="text-gray-500 text-sm mt-1 max-w-md">
                  Please confirm your delivery information so we can get your
                  order to you safely.
                </p>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="btn-press flex items-center gap-2 border border-gray-200 text-[#004953] px-5 py-2 rounded-xl hover:bg-gray-50 transition shrink-0"
              >
                <FontAwesomeIcon icon={faPen} />
                <span className="font-semibold">Edit</span>
              </button>
            ) : (
              <button
                onClick={saveAddress}
                className="btn-press bg-[#004953] text-white px-6 py-2.5 rounded-xl hover:bg-black transition shrink-0 font-semibold"
              >
                Save
              </button>
            )}
          </div>
          {showSafetyBanner && (
            <div className="mt-6 flex items-start justify-between gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-500 text-white w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <div>
                  <p className="font-semibold text-[#004953]">
                    Your information is safe with us
                  </p>
                  <p className="text-gray-500 text-sm">
                    We use secure encryption to protect your data.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSafetyBanner(false)}
                className="btn-press text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          <div className="mt-4 border-2 border-[#004953] rounded-2xl p-2">

            {!editing ? (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#004953] text-white w-8 h-8 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} className="text-sm" />
                      </div>
                      <span className="text-[#004953] font-semibold">
                        Deliver to
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                        <h3 className=" text-2xl font-bold">
                        {customer?.User?.full_name}
                      </h3>

                      <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-[#004953]" />
                        {customer?.User?.phone || "No phone number"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-gray-300" />

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 text-[#004953] w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faMap} />
                  </div>
                  <div>
                    <p className="font-semibold">Street Address</p>
                    <p className="text-gray-600">
                      {customer?.address || "No address yet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mt-5">
                  <div className="bg-emerald-50 text-[#004953] w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div>
                    <p className="font-semibold">City</p>
                    <p className="text-gray-600">{customer?.city || "-"}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="text-blue-500 mt-0.5"
                  />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-700">Tip:</span>{" "}
                    Double-check your address to help us deliver your order
                    accurately.
                  </p>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#004953] text-white w-8 h-8 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faPen} className="text-sm" />
                  </div>
                  <span className="text-[#004953] font-semibold">
                    Edit delivery details
                  </span>
                </div>

                <div className="space-y-5 mt-6">

                  <div>
                    <label className="font-semibold">Full Name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-2 w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#004953]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Phone Number</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#004953]"
                      placeholder="012345678"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Street Address</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-2 w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#004953]"
                      placeholder="Street Address"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-2 w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#004953]"
                      placeholder="City"
                    />
                  </div>

                </div>
              </div>
            )}

          </div>

          <button
            onClick={() => navigate(PATH.USER.Payment)}
            className="btn-press w-full mt-8 bg-[#004953] text-white py-4 rounded-2xl text-lg font-semibold hover:bg-black transition flex items-center justify-center gap-3"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Continue To Payment
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          <p className="mt-4 text-center text-gray-500 flex items-center justify-center gap-2 text-sm">
            <FontAwesomeIcon icon={faShieldHalved} />
            You can review your order on the next step
          </p>

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow-xl p-8 h-fit sticky top-28">

          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-50 text-[#004953] w-11 h-11 rounded-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBagShopping} />
            </div>
            <h2 className="text-2xl font-bold">Order Summary</h2>
          </div>

          <div className="space-y-5">

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">
                ${summary.subtotal.toFixed(2)}
              </span>
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-3 text-gray-600">
                <span className="bg-emerald-50 text-[#004953] w-8 h-8 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faTruck} className="text-sm" />
                </span>
                Delivery Fee
              </span>
              <span className="font-bold">${summary.deliveryFee.toFixed(2)}</span>
            </div>

            {summary.discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-3 text-gray-600">
                  <span className="bg-amber-50 text-amber-500 w-8 h-8 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTag} className="text-sm" />
                  </span>
                  Discount {summary.couponCode ? `(${summary.couponCode})` : ""}
                </span>
                <span className="font-bold text-green-700">
                  -${summary.discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center bg-emerald-50 rounded-2xl p-5">
              <span className="text-xl font-bold text-[#004953]">Total</span>
              <span className="text-2xl font-bold text-[#004953]">
                ${summary.total.toFixed(2)}
              </span>
            </div>

          </div>

          <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="bg-amber-400 text-white w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faGift} />
            </div>
            <div>
              <p className="font-semibold text-amber-700">
                Thank you for choosing us!
              </p>
              <p className="text-gray-600 text-sm">
                We're preparing your delicious meal with care. 
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
            <div className="bg-emerald-50 text-[#004953] w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div>
              <p className="font-semibold">Secure Checkout</p>
              <p className="text-gray-500 text-sm">
                Your payment information is encrypted and safe.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DeliveryDetails;