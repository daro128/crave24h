import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faClock,
  faLocationDot,
  faEnvelope,
  faPersonRunning,
  faHeadset,
  faUtensils,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import { PATH } from "../../../path.js";
import { getOrderById } from "../../../service/orderService";
import Loading from "../../../pages/user_page/LoadingPage.jsx";

const Success = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // matches the :id in your route

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data.order || res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="py-5 px-2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-200 rounded-[30px] shadow-2xl p-10">

            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faBurger} className="text-5xl text-[#004953]" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-[#004953] font-semibold text-lg">Order Placed!</h2>
              <p className="text-gray-500 text-sm mt-2">
                Your delicious meal is being prepared with love.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="bg-[#f7f2fb] p-5 rounded-lg">
                <p className="text-[#004953] text-xs font-semibold mb-2">ORDER NUMBER</p>
                <p className="font-medium text-gray-700">
                  #{order?.order_number || order?.id || id}
                </p>
              </div>

              <div className="bg-[#f7f2fb] p-5 rounded-lg">
                <p className="text-[#004953] text-xs font-semibold mb-2">ESTIMATED ARRIVAL</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <FontAwesomeIcon icon={faClock} className="text-[#004953]" />
                  <span>{order?.eta || "25–35 mins"}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f7f2fb] p-5 rounded-lg mt-4">
              <p className="text-[#004953] text-xs font-semibold mb-2">DELIVERY TO</p>
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#004953] mt-1" />
                <div>
                  <p className="font-medium text-gray-700">
                    {order?.delivery_address || "No address"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order?.city || ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <div className="bg-pink-50 px-6 py-3 rounded-full flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#004953]" />
                <span className="text-sm text-gray-600">
                  Email sent to {order?.User?.email || order?.email || "your inbox"}
                </span>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-10">
              Track your order in real-time on our live map.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate(`${PATH.USER.Trackorder}/${id}`)}
                className="btn-press px-8 py-3 rounded-full hover:cursor-pointer bg-[#004953] text-white shadow-lg hover:bg-gray-500 hover:text-black transition"
              >
                <FontAwesomeIcon icon={faPersonRunning} className="mr-2" />
                Track My Order
              </button>
              <button
                onClick={() => navigate(PATH.USER.HOME)}
                className="btn-press px-8 py-3 rounded-full border-2 border-[#004953] text-black hover:cursor-pointer hover:text-white hover:bg-[#004953] transition"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* feature cards unchanged */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-[#004953] flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeadset} className="text-white" />
              </div>
              <h4 className="font-medium text-gray-700">24/7 Support</h4>
              <p className="text-sm text-gray-500 mt-2">Need help with your order?</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-[#004953] flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUtensils} className="text-white" />
              </div>
              <h4 className="font-medium text-gray-700">Hygiene First</h4>
              <p className="text-sm text-gray-500 mt-2">Safely sealed packaging</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-[#004953] flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faLeaf} className="text-white" />
              </div>
              <h4 className="font-medium text-gray-700">Go Green</h4>
              <p className="text-sm text-gray-500 mt-2">Sustainable packaging</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Success;