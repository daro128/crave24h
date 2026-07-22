import { useEffect, useState } from "react";

import ProcessStep from "../../components/userComponent/CheckoutComponent/ProcessStep";
import DeliveryDetails from "../../components/userComponent/CheckoutComponent/DeliveryDetails";
import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";

import Loading from "../user_page/LoadingPage";

import { getProfile } from "../../service/profileService";
import { getCart } from "../../service/cartService";
import { revalidateAppliedCoupon } from "../../service/couponService";

const AddAdressPage = () => {
  const [loading, setLoading] = useState(true);

  const [customer, setCustomer] = useState(null);

  const [summary, setSummary] = useState({
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    couponCode: null,
    total: 0,
  });

  const loadData = async () => {
    try {
      const [profileRes, cartRes] = await Promise.all([
        getProfile(),
        getCart(),
      ]);

      setCustomer(profileRes);

      const subtotal = Number(cartRes.data.total || 0);
      const deliveryFee = Number(cartRes.data.deliveryFee || 0);
      const coupon = await revalidateAppliedCoupon(subtotal);
      const discount = coupon?.discount || 0;

      setSummary({
        subtotal,
        deliveryFee,
        discount,
        couponCode: coupon?.code || null,
        total: Math.max(subtotal + deliveryFee - discount, 0),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="mx-auto max-w-2xl">
          <ProcessStep />
        </div>

        <div className="mt-10">
          <DeliveryDetails
            customer={customer}
            summary={summary}
            reload={loadData}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddAdressPage;