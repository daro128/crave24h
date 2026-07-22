import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faClock,
  faLocationDot,
  faHeart,
  faShareNodes,
  faUser,
  faUserGroup,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import placeholderRestaurant from "../../assets/image copy 2.png";
import { plansByRestaurant } from "../../data/monthlyMealData";
import { getRestaurantById } from "../../service/restaurantService";
import { getActiveSubscription } from "../../service/subscriptionService";
import { saveDraft } from "../../utils/subscriptionStorage";
import { PATH } from "../../path";

const PLAN_ICONS = { basic: faUser, standard: faUserGroup, family: faPeopleGroup };
const TABS = ["Plans", "About", "Menu", "Reviews"];

const MonthlyPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Plans");
  const [selectedPlanId, setSelectedPlanId] = useState(
    plansByRestaurant.plans.find((p) => p.popular)?.id || plansByRestaurant.plans[0].id
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getRestaurantById(id);
        setRestaurant(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();

    getActiveSubscription()
      .then(() => navigate(PATH.USER.MySubscription))
      .catch(() => {});
  }, [id, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Restaurant not found
      </div>
    );
  }

  const selectedPlan = plansByRestaurant.plans.find((p) => p.id === selectedPlanId);
  const totalMeals = selectedPlan.mealsPerDay * plansByRestaurant.duration;

  const handleContinue = () => {
    saveDraft({
      restaurantId: restaurant.restaurant_id,
      restaurantName: restaurant.restaurant_name,
      restaurantImage: restaurant.logo,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      mealsPerDay: selectedPlan.mealsPerDay,
      duration: plansByRestaurant.duration,
    });
    navigate(PATH.USER.MonthlyMealPayment);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src={restaurant.logo ? `http://localhost:5000/uploads/${restaurant.logo}` : placeholderRestaurant}
                alt={restaurant.restaurant_name}
                className="w-full h-64 object-cover"
                onError={(e) => { e.target.src = placeholderRestaurant; }}
              />
              <span className="absolute top-4 left-4 bg-[#004953] text-white text-xs font-bold px-3 py-1 rounded-full">
                Monthly Meal
              </span>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="btn-press w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faShareNodes} className="text-gray-500" />
                </button>
                <button className="btn-press w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-[#004953] mt-5">{restaurant.restaurant_name}</h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <FontAwesomeIcon icon={faStar} /> {restaurant.average_rating || "—"}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} /> {restaurant.status === "open" ? "Open now" : "Closed"}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} /> {restaurant.address}
              </span>
            </div>

            <div className="flex gap-6 border-b border-gray-200 mt-6 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn-press pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                    activeTab === tab
                      ? "border-[#004953] text-[#004953]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "Plans" && (
                <>
                  <h2 className="text-xl font-bold text-[#004953] mb-4">Choose Your Plan</h2>
                  <div className="space-y-4">
                    {plansByRestaurant.plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`btn-press w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 transition-colors text-left cursor-pointer relative ${
                          selectedPlanId === plan.id
                            ? "border-[#004953] bg-[#004953]/5"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 left-4 bg-[#004953] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            POPULAR
                          </span>
                        )}
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedPlanId === plan.id ? "bg-[#004953] text-white" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <FontAwesomeIcon icon={PLAN_ICONS[plan.id]} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{plan.name}</p>
                            <p className="text-sm text-gray-400">{plan.description}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-[#004953]">${plan.price}</p>
                          <p className="text-xs text-gray-400">/ {plansByRestaurant.duration} days</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeTab === "About" && (
                <p className="text-gray-600 leading-7">
                  {restaurant.description || "No description available for this restaurant yet."}
                </p>
              )}

              {activeTab === "Menu" && (
                <p className="text-gray-400">Menu preview is available once you choose your plan.</p>
              )}

              {activeTab === "Reviews" && (
                <p className="text-gray-400">Reviews from other monthly subscribers will appear here.</p>
              )}
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div>
            <div className="bg-white rounded-3xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#004953] mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Plan</span>
                  <span className="font-semibold text-gray-800">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-gray-800">{plansByRestaurant.duration} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Meals Included</span>
                  <span className="font-semibold text-gray-800">{totalMeals} Total</span>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 text-sm">Total Price</span>
                  <span className="text-2xl font-bold text-[#004953]">${selectedPlan.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Renews automatically every {plansByRestaurant.duration} days. Cancel anytime in your profile settings.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="btn-press w-full mt-5 py-3.5 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition"
              >
                Continue to Payment →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

export default MonthlyPlanPage;
