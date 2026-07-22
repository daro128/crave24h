import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Store,
  TrendingUp,
  BadgePercent,
  Star,
  Bike,
  Sparkles,
  Trophy,
} from "lucide-react";

const menuActions = {
  "All Foods":     { type: "navigate", target: "/user/allfood" },
  "Restaurants":   { type: "scroll",   target: "section-restaurants" },
  "Trending":      { type: "scroll",   target: "section-trending" },
  "Discounts":     { type: "scroll",   target: "section-discounts" },
  "Top Rate":      { type: "scroll",   target: "section-top-rate" },
  "Fast Delivery": { type: "scroll",   target: "section-fast-delivery" },
  "New Arrivals":  { type: "scroll",   target: "section-new-arrivals" },
  "The Best":      { type: "scroll",   target: "section-top-rate" },
};

const Menu = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("All Foods");

  const items = [
    { name: "All Foods", icon: Utensils },
    { name: "Restaurants", icon: Store },
    { name: "Trending", icon: TrendingUp },
    { name: "Discounts", icon: BadgePercent },
    { name: "Top Rate", icon: Star },
    { name: "Fast Delivery", icon: Bike },
    { name: "New Arrivals", icon: Sparkles },
    { name: "The Best", icon: Trophy },
  ];

  const handleClick = (name) => {
    setActive(name);
    const action = menuActions[name];
    if (!action) return;
    if (action.type === "navigate") {
      navigate(action.target);
    } else {
      document.getElementById(action.target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="py-5 px-5">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => handleClick(item.name)}
              className={`btn-press flex items-center mt-2 mb-2 gap-3 px-7 py-4 rounded-2xl whitespace-nowrap transition-all hover:cursor-pointer duration-300 font-semibold
                ${
                  active === item.name
                    ? "bg-[#004953] text-white shadow-xl scale-105"
                    : "bg-white text-[#004953] hover:text-white hover:bg-[#004953] hover:scale-105 border border-gray-200"
                }`}
            >
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;