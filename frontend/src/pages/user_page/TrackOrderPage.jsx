import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import Map from "../../components/userComponent/TrackOrderComponent/Map";
import Orderstatus from "../../components/userComponent/TrackOrderComponent/Orderstatus";
import LeftSection from "../../components/userComponent/TrackOrderComponent/LeftSection";
import RightSection from "../../components/userComponent/TrackOrderComponent/RightSection";

import { getOrderById } from "../../service/orderService";

const TrackOrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data.order);
      } catch (err) {
        console.log(err);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="px-4 sm:px-8 lg:px-30 py-3">
        <Map order={order} />
        <Orderstatus order={order} />
        <div className="grid gap-5 mt-2 grid-cols-1 lg:grid-cols-2">
          <LeftSection order={order} />
          <RightSection order={order} />
        </div>
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default TrackOrderPage;