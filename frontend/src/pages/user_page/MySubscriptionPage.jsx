import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPen, faClock } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import CancelSubscriptionModal from "../../components/userComponent/MonthlyMealComponent/CancelSubscriptionModal";
import EditScheduleModal from "../../components/userComponent/MonthlyMealComponent/EditScheduleModal";
import { getActiveSubscription, normalizeSubscription, getMealChoice } from "../../service/subscriptionService";
import { getProductsByRestaurant } from "../../service/productService";
import { PATH } from "../../path";

const isoDaysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const daysBetween = (a, b) => Math.floor((b - a) / (1000 * 60 * 60 * 24));

const formatTime = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const MySubscriptionPage = () => {
  const navigate = useNavigate();
  const [sub, setSub] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showEditSchedule, setShowEditSchedule] = useState(false);
  const [focusMealTime, setFocusMealTime] = useState(null);
  const [menuById, setMenuById] = useState({});
  const [dayChoices, setDayChoices] = useState({ today: null, tomorrow: null });

  const refreshSubscription = async () => {
    let normalized;
    try {
      const { data } = await getActiveSubscription();
      normalized = normalizeSubscription(data.subscription);
      setSub(normalized);
    } catch {
      setSub(null);
      setLoaded(true);
      return;
    }

    try {
      const { data: productsData } = await getProductsByRestaurant(normalized.restaurantId);
      const map = {};
      (productsData.products || []).forEach((p) => {
        map[String(p.product_id)] = p.product_name;
      });
      setMenuById(map);
    } catch {
      setMenuById({});
    }

    const [todayChoice, tomorrowChoice] = await Promise.all([
      getMealChoice(normalized.subscription_id, isoDaysFromNow(0)).catch(() => null),
      getMealChoice(normalized.subscription_id, isoDaysFromNow(1)).catch(() => null),
    ]);
    setDayChoices({
      today: todayChoice?.data?.choice || null,
      tomorrow: tomorrowChoice?.data?.choice || null,
    });

    setLoaded(true);
  };

  useEffect(() => {
    refreshSubscription();
  }, []);

  if (!loaded) return null;

  if (!sub) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-8 lg:px-15 py-5">
          <Navbar />
          <div className="text-center py-32">
            <h1 className="text-2xl font-bold text-[#004953]">No Active Subscription</h1>
            <p className="text-gray-500 mt-2">Subscribe to a monthly meal plan to see it here.</p>
            <button
              onClick={() => navigate(PATH.USER.MonthlyMeal)}
              className="btn-press mt-6 px-6 py-3 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition"
            >
              Browse Monthly Meals
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const today = new Date();
  const start = new Date(sub.startDate);
  const elapsed = Math.min(Math.max(daysBetween(start, today) + 1, 0), sub.duration);
  const percent = Math.round((elapsed / sub.duration) * 100);
  const totalMeals = sub.duration * sub.mealsPerDay;
  const remainingMeals = Math.max(totalMeals - elapsed * sub.mealsPerDay, 0);

  const MEAL_TIME_FIELD = {
    Breakfast: "breakfast_item_id",
    Lunch: "lunch_item_id",
    Dinner: "dinner_item_id",
    "Supper (Optional)": "supper_item_id",
  };

  const mealName = (choice, field) => {
    if (!choice || !choice[field]) return "Not selected yet";
    return menuById[choice[field]] || "Not selected yet";
  };

  const activeMealTimes = (sub.mealTimes || []).filter((mt) => MEAL_TIME_FIELD[mt]);
  const mealTimesToShow = activeMealTimes.length > 0 ? activeMealTimes : ["Lunch"];

  const upcoming = [
    { key: "today", label: "TODAY", choice: dayChoices.today, statusIfChosen: "Preparing" },
    { key: "tomorrow", label: "TOMORROW", choice: dayChoices.tomorrow, statusIfChosen: "Scheduled" },
  ].flatMap(({ key, label, choice, statusIfChosen }) =>
    mealTimesToShow.map((mealTime) => {
      const field = MEAL_TIME_FIELD[mealTime];
      const time = formatTime(sub.deliveryTimes?.[mealTime]);
      return {
        key: `${key}-${mealTime}`,
        label,
        name: mealName(choice, field),
        mealTime,
        window: time ? `${mealTime} · ${time}` : mealTime,
        status: choice?.[field] ? statusIfChosen : "Pending",
        editable: true,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />

        <div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-bold text-[#004953]">My Subscription</h1>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ● {sub.status === "paused" ? "Paused" : "Active"}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs text-gray-400">Restaurant</p>
              <p className="font-bold text-gray-800">{sub.restaurantName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Plan Type</p>
              <p className="font-bold text-gray-800">{sub.planName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Billing Cycle</p>
              <p className="font-bold text-gray-800">{formatDate(sub.startDate)} - {formatDate(sub.endDate)}</p>
            </div>
            <div className="min-w-48">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Day {elapsed} of {sub.duration}</span>
                <span>{percent}% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#004953] rounded-full" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Upcoming Meals</h2>
              <button
                onClick={() => navigate(PATH.USER.DailyMealChoice)}
                className="text-sm font-semibold text-[#004953] hover:underline"
              >
                View full calendar →
              </button>
            </div>

            <div className="space-y-4">
              {upcoming.map((meal) => (
                <div key={meal.key} className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap sm:flex-nowrap items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#004953]/10 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-[#004953]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400">{meal.label}</p>
                    <p className="font-semibold text-gray-800 truncate">{meal.name}</p>
                    <button
                      onClick={() => {
                        setFocusMealTime(meal.mealTime);
                        setShowEditSchedule(true);
                      }}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#004953] transition"
                    >
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                      {meal.window}
                    </button>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                      meal.status === "Preparing" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {meal.status}
                  </span>
                  <button
                    onClick={() => navigate(PATH.USER.DailyMealChoice)}
                    disabled={!meal.editable}
                    className={`btn-press flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border shrink-0 transition ${
                      meal.editable
                        ? "border-[#004953] text-[#004953] hover:bg-[#004953] hover:text-white"
                        : "border-gray-200 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <FontAwesomeIcon icon={faPen} className="text-[10px]" />
                    Change Meal
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Manage Plan</h3>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Remaining Meals</span>
                <span className="font-bold text-[#004953] text-lg">{remainingMeals}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Delivery Days</span>
                <span className="font-semibold text-gray-700 text-right">{sub.deliveryDays?.join(", ")}</span>
              </div>

              <button
                onClick={() => navigate(PATH.USER.MonthlyMeal)}
                className="btn-press w-full py-3 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition mb-2"
              >
                Renew / Upgrade Plan ⤴
              </button>
              <button
                onClick={() => navigate(PATH.USER.PauseSubscription)}
                className="btn-press w-full py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition mb-2"
              >
                Pause Subscription
              </button>
              <button
                onClick={() => setShowCancel(true)}
                className="btn-press w-full py-2 text-sm font-semibold text-red-500 hover:text-red-600 transition"
              >
                Cancel Subscription ✕
              </button>

              <button
                onClick={() => {
                  setFocusMealTime(null);
                  setShowEditSchedule(true);
                }}
                className="btn-press w-full mt-3 text-xs font-semibold text-[#004953] hover:underline"
              >
                Want to change your delivery time? Edit here →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>

      {showCancel && (
        <CancelSubscriptionModal
          subscription={sub}
          remainingMeals={remainingMeals}
          onClose={() => setShowCancel(false)}
          onCancelled={() => {
            setShowCancel(false);
            refreshSubscription();
          }}
        />
      )}

      {showEditSchedule && (
        <EditScheduleModal
          subscription={sub}
          focusMealTime={focusMealTime}
          onClose={() => setShowEditSchedule(false)}
          onUpdated={() => {
            setShowEditSchedule(false);
            refreshSubscription();
          }}
        />
      )}
    </div>
  );
};

export default MySubscriptionPage;
