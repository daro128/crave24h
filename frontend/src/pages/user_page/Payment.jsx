import { useEffect, useState } from "react";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import ProcessStep from "../../components/userComponent/CheckoutComponent/ProcessStep";

import LeftSection from "../../components/userComponent/PaymentComponent/LeftSection";
import RightSection from "../../components/userComponent/PaymentComponent/RightSection";

import KHQRPayment from "../../components/userComponent/PaymentComponent/KHQRPayment";
import CashPayment from "../../components/userComponent/PaymentComponent/CashPayment";

import { getCart } from "../../service/cartService";
import { createOrder } from "../../service/orderService";
import {
  getAppliedCouponCode,
  revalidateAppliedCoupon,
  clearAppliedCoupon,
} from "../../service/couponService";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../path";

const paymentMethods = [
  { id: "KHQR", label: "KHQR Pay", component: KHQRPayment },
  { id: "cash", label: "Cash", component: CashPayment },
];

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState("KHQR");
  const [cart, setCart] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const selectedPayment = paymentMethods.find(
    (item) => item.id === selectedMethod
  );

  const PaymentComponent = selectedPayment?.component;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        const cartSubtotal = Number(res.data.total) || 0;

        setCart(res.data.cart);
        setSubtotal(cartSubtotal);
        setDeliveryFee(Number(res.data.deliveryFee) || 0);

        const coupon = await revalidateAppliedCoupon(cartSubtotal);
        setDiscount(coupon?.discount || 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const res = await createOrder({
        payment_method: selectedMethod,
        delivery_address: address || "Phnom Penh",
        coupon_code: getAppliedCouponCode() || undefined,
      });
      clearAppliedCoupon();
      window.dispatchEvent(new Event("cartUpdated"));
    alert("Order created successfully!");
    navigate(`${PATH.USER.SucessPayment}/${res.data.order_id}`);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };
    const total = Math.max(subtotal + deliveryFee - discount, 0);

  return (
    <div>
      <Navbar />
      <div className="px-4 sm:px-8 lg:px-30 py-5">
        <div className="mx-auto mt-5 max-w-2xl">
          <ProcessStep currentStep={2} />
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-6 gap-5">
          <div className="lg:col-span-4">
            <LeftSection
              methods={paymentMethods}
              selected={selectedMethod}
              onChange={setSelectedMethod}
            />

            <div className="shadow-2xl bg-gray-100 mt-2 w-full">
              {PaymentComponent && (
                <PaymentComponent total={total} cart={cart} />
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <RightSection
            subtotal={subtotal}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            total={total}
            deliveryFee={deliveryFee}
            discount={discount}
            cart={cart}
          />
        </div>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Payment;