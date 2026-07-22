import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCalendarDay, faMugSaucer } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import SubscriptionSteps from "../../components/userComponent/MonthlyMealComponent/SubscriptionSteps";
import { mealTimeOptions, deliveryDayOptions } from "../../data/monthlyMealData";
import { getDraft, saveDraft } from "../../utils/subscriptionStorage";
import { PATH } from "../../path";

const MEAL_ICONS = { lunch: faSun, dinner: faMoon, supper: faMoon, breakfast: faMugSaucer };

const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const DEFAULT_MEAL_PRIORITY = ["lunch", "dinner", "supper", "breakfast"];

const defaultEnabledMeals = (mealsPerDay) => {
  const enabledIds = new Set(DEFAULT_MEAL_PRIORITY.slice(0, mealsPerDay));
  return mealTimeOptions.reduce((acc, meal) => {
    acc[meal.id] = enabledIds.has(meal.id);
    return acc;
  }, {});
};

const to24Hour = (time12) => {
  const [time, period] = time12.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const defaultMealTimeValues = () =>
  mealTimeOptions.reduce((acc, meal) => {
    acc[meal.id] = to24Hour(meal.window.split(" - ")[0]);
    return acc;
  }, {});

const MonthlyDeliveryTimePage = () => {
  const navigate = useNavigate();
  const [draft] = useState(() => getDraft());
  const mealsPerDay = draft?.mealsPerDay || mealTimeOptions.length;
  const [enabledMeals, setEnabledMeals] = useState(() => defaultEnabledMeals(mealsPerDay));
  const [mealTimeValues, setMealTimeValues] = useState(defaultMealTimeValues);
  const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [startDate, setStartDate] = useState(tomorrowISO());

  useEffect(() => {
    if (!draft?.planId) navigate(PATH.USER.MonthlyMeal);
  }, [draft, navigate]);

  if (!draft?.planId) return null;

  const selectedMealCount = Object.values(enabledMeals).filter(Boolean).length;

  const toggleMeal = (id) =>
    setEnabledMeals((prev) => {
      const turningOn = !prev[id];
      if (turningOn && selectedMealCount >= mealsPerDay) return prev;
      return { ...prev, [id]: !prev[id] };
    });

  const toggleDay = (day) =>
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));

  const handleContinue = () => {
    const enabledOptions = mealTimeOptions.filter((m) => enabledMeals[m.id]);
    const mealTimes = enabledOptions.map((m) => m.label);
    const mealTimeSlots = enabledOptions.map((m) => ({ label: m.label, time: mealTimeValues[m.id] }));
    saveDraft({ mealTimes, mealTimeSlots, deliveryDays: days, startDate });
    navigate(PATH.USER.MonthlyMealConfirm);
  };

  const canContinue = days.length > 0 && Object.values(enabledMeals).some(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />

        <div className="mt-8 mb-8">
          <SubscriptionSteps currentStep={3} />
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[#004953]">Set Up Delivery Time</h1>
          <p className="text-gray-500 mt-1 mb-6">Choose when you want to receive your meals.</p>

          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Select Meal Times</h3>
              <span className="text-xs text-gray-400">
                {selectedMealCount}/{mealsPerDay} selected
              </span>
            </div>
            <div className="space-y-3">
              {mealTimeOptions.map((meal) => {
                const isEnabled = enabledMeals[meal.id];
                const isDisabled = !isEnabled && selectedMealCount >= mealsPerDay;
                return (
                  <div key={meal.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#004953]/10 text-[#004953] flex items-center justify-center">
                        <FontAwesomeIcon icon={MEAL_ICONS[meal.id]} />
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800">{meal.label}</p>
                        <p className="text-xs text-gray-400">{meal.window}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {isEnabled && (
                        <input
                          type="time"
                          value={mealTimeValues[meal.id]}
                          onChange={(e) =>
                            setMealTimeValues((prev) => ({ ...prev, [meal.id]: e.target.value }))
                          }
                          className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#004953]"
                        />
                      )}
                      <button
                        onClick={() => toggleMeal(meal.id)}
                        disabled={isDisabled}
                        className={`w-11 h-6 shrink-0 rounded-full relative transition-colors ${
                          isEnabled ? "bg-[#004953]" : "bg-gray-200"
                        } ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            isEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
            <h3 className="font-bold text-gray-800 mb-4">Select Delivery Days</h3>
            <div className="flex flex-wrap gap-2">
              {deliveryDayOptions.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`btn-press px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    days.includes(day)
                      ? "bg-[#004953] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
            <h3 className="font-bold text-gray-800 mb-4">Start Date</h3>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              <FontAwesomeIcon icon={faCalendarDay} className="text-[#004953]" />
              <input
                type="date"
                value={startDate}
                min={tomorrowISO()}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 focus:outline-none text-gray-700"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Your first meal box will arrive on this date.</p>
          </div>

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="btn-press w-full mt-6 py-3.5 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

export default MonthlyDeliveryTimePage;
