import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import LeftSection from "../../components/userComponent/CheckoutComponent/Leftsection";
import RightSection from "../../components/userComponent/CheckoutComponent/Rightsection";
import Loading from "./LoadingPage";

import { useEffect, useState } from "react";
import { getCart } from "../../service/cartService";

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />

      <div className="py-10 px-4 sm:px-8 lg:px-30">
        <h2 className="font-bold text-3xl">Your Cart</h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
          <LeftSection
            cart={cart?.cart}
            refreshCart={loadCart}
          />

          <RightSection
            cart={cart?.cart}
            total={cart?.total}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;