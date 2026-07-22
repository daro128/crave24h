import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import placeholderFood from "../../assets/image copy 2.png";
import {
  getActiveSubscription,
  normalizeSubscription,
  getMealChoicesRange,
  saveMealChoice,
} from "../../service/subscriptionService";
import { getProductsByRestaurant } from "../../service/productService";
import { PATH } from "../../path";

const buildWeek = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      key: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: d.getDate(),
    };
  });
};

const DailyMealChoicePage = () => {
  const navigate = useNavigate();
  const [sub, setSub] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [menu, setMenu] = useState([]);
  const week = useMemo(() => buildWeek(), []);
  const [selectedDay, setSelectedDay] = useState(week[0].key);
  const [choices, setChoices] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
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
        const [{ data: choicesData }, { data: productsData }] = await Promise.all([
          getMealChoicesRange(normalized.subscription_id),
          getProductsByRestaurant(normalized.restaurantId),
        ]);

        const map = {};
        choicesData.choices.forEach((c) => {
          map[c.choice_date] = {
            lunch: c.lunch_item_id,
            dinner: c.dinner_item_id,
            supper: c.supper_item_id,
            breakfast: c.breakfast_item_id,
          };
        });
        setChoices(map);

        setMenu(
          (productsData.products || [])
            .filter((p) => p.status === "available")
            .map((p) => ({
              id: String(p.product_id),
              name: p.product_name,
              tag: p.Category?.category_name || "",
              image: p.image ? `http://localhost:5000/uploads/${p.image}` : placeholderFood,
            }))
        );
      } catch {
        setChoices({});
        setMenu([]);
      }

      setLoaded(true);
    };

    load();
  }, []);

  useEffect(() => {
    if (loaded && !sub) navigate(PATH.USER.MonthlyMeal);
  }, [loaded, sub, navigate]);

  if (!sub) return null;

  const hasSupper = (sub.mealTimes || []).some((mt) => mt.startsWith("Supper"));
  const hasBreakfast = (sub.mealTimes || []).some((mt) => mt.startsWith("Breakfast"));

  const defaultLunch = menu[1]?.id || menu[0]?.id;
  const defaultDinner = menu[0]?.id;
  const defaultSupper = menu[2]?.id || menu[0]?.id;
  const defaultBreakfast = menu[0]?.id;
  const dayChoice =
    choices[selectedDay] || {
      lunch: defaultLunch,
      dinner: defaultDinner,
      supper: hasSupper ? defaultSupper : undefined,
      breakfast: hasBreakfast ? defaultBreakfast : undefined,
    };

  const pick = (meal, id) => {
    setSaved(false);
    setChoices((prev) => ({ ...prev, [selectedDay]: { ...dayChoice, [meal]: id } }));
  };

  const lunchName = menu.find((m) => m.id === dayChoice.lunch)?.name;
  const dinnerName = menu.find((m) => m.id === dayChoice.dinner)?.name;
  const supperName = menu.find((m) => m.id === dayChoice.supper)?.name;
  const breakfastName = menu.find((m) => m.id === dayChoice.breakfast)?.name;

  const handleSave = async () => {
    await saveMealChoice(sub.subscription_id, selectedDay, dayChoice);
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />

        <div className="mt-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#004953]">Choose Your Meals</h1>
            <p className="text-gray-500 mt-1">Pick your favorite dish for each day before 9:00 PM for next-day delivery.</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full shrink-0 self-start">
            <FontAwesomeIcon icon={faClock} /> 9:00 PM Cutoff
          </span>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {week.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`btn-press w-16 py-3 rounded-2xl text-center font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedDay === day.key ? "bg-[#004953] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <p className="text-[10px]">{day.label}</p>
              <p className="text-lg">{day.date}</p>
            </button>
          ))}
        </div>

        {menu.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            This restaurant hasn't added any menu items yet.
          </p>
        ) : (
          <>
            {hasBreakfast && (
              <MealSection
                title="Breakfast Choice"
                icon="🥐"
                options={menu}
                selectedId={dayChoice.breakfast}
                onSelect={(id) => pick("breakfast", id)}
              />
            )}

            <MealSection
              title="Lunch Choice"
              icon="☀️"
              options={menu}
              selectedId={dayChoice.lunch}
              onSelect={(id) => pick("lunch", id)}
            />

            <MealSection
              title="Dinner Choice"
              icon="🌙"
              options={menu}
              selectedId={dayChoice.dinner}
              onSelect={(id) => pick("dinner", id)}
            />

            {hasSupper && (
              <MealSection
                title="Supper Choice"
                icon="🌃"
                options={menu}
                selectedId={dayChoice.supper}
                onSelect={(id) => pick("supper", id)}
              />
            )}
          </>
        )}

        <div className="bg-white rounded-2xl shadow-md p-4 mt-8 flex items-center justify-between sticky bottom-4">
          <p className="text-sm text-gray-500">
            Selected:{" "}
            {hasBreakfast && (
              <>
                <span className="font-semibold text-gray-800">{breakfastName} (Breakfast)</span>,{" "}
              </>
            )}
            <span className="font-semibold text-gray-800">{lunchName} (Lunch)</span>,{" "}
            <span className="font-semibold text-gray-800">{dinnerName} (Dinner)</span>
            {hasSupper && (
              <>
                ,{" "}
                <span className="font-semibold text-gray-800">{supperName} (Supper)</span>
              </>
            )}
            <br />
            <span className="text-xs text-gray-400">You can change this until 9:00 PM today</span>
          </p>
          <button
            onClick={handleSave}
            className="btn-press px-6 py-3 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition shrink-0"
          >
            {saved ? "Saved ✓" : "Save Meal Choice"}
          </button>
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

const MealSection = ({ title, icon, options, selectedId, onSelect }) => (
  <div className="mb-8">
    <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
      <span>{icon}</span> {title}
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
      {options.map((opt) => {
        const isSelected = opt.id === selectedId;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`btn-press card-hover bg-white rounded-2xl overflow-hidden text-left border-2 transition-colors cursor-pointer ${
              isSelected ? "border-[#004953]" : "border-transparent hover:border-gray-200"
            }`}
          >
            <div className="relative">
              <img src={opt.image} alt={opt.name} className="w-full h-32 object-cover" />
              {isSelected && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#004953] text-white flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="font-semibold text-gray-800 text-sm">{opt.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.tag}</p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default DailyMealChoicePage;
