import placeholder from "../assets/image copy 2.png";

export const monthlyMealRestaurants = [
  {
    id: "rice-house",
    name: "Rice House",
    cuisine: "Khmer",
    tagline: "Traditional Khmer & Fusion Cuisine",
    about:
      "Rice House brings authentic Khmer flavors to your daily table, pairing time-honoured recipes with fresh, locally sourced ingredients.",
    rating: 4.8,
    reviews: "1.2k+",
    prepTime: "15-20 min",
    distance: "1.2 km",
    image: placeholder,
    tags: ["Chef's Choice", "Best Seller"],
  },
  {
    id: "healthy-bowl",
    name: "Healthy Bowl",
    cuisine: "Healthy",
    tagline: "Clean Eating & Fresh Salads",
    about:
      "Healthy Bowl curates balanced, portion-controlled meals for people who want to eat well without sacrificing flavor.",
    rating: 4.9,
    reviews: "980+",
    prepTime: "10-20 min",
    distance: "0.8 km",
    image: placeholder,
    tags: ["Vegan", "Low Carb"],
  },
  {
    id: "khmer-kitchen",
    name: "Khmer Kitchen",
    cuisine: "Khmer",
    tagline: "Authentic Local Home Cooking",
    about:
      "Khmer Kitchen delivers home-style Cambodian dishes cooked fresh every day, just like a family meal.",
    rating: 4.6,
    reviews: "540+",
    prepTime: "20-30 min",
    distance: "2.1 km",
    image: placeholder,
    tags: ["Home Style", "Traditional"],
  },
  {
    id: "green-delight",
    name: "Green Delight",
    cuisine: "Vegan",
    tagline: "Plant-Based Organic Meals",
    about:
      "Green Delight is a fully plant-based kitchen focused on organic, eco-friendly ingredients and high-protein vegan meals.",
    rating: 4.7,
    reviews: "710+",
    prepTime: "15-25 min",
    distance: "1.5 km",
    image: placeholder,
    tags: ["High Protein", "Eco-friendly"],
  },
];

export const plansByRestaurant = {
  duration: 30,
  plans: [
    { id: "basic", name: "Basic Plan", description: "1 meal per day", mealsPerDay: 1, price: 60 },
    { id: "standard", name: "Standard Plan", description: "2 meals per day", mealsPerDay: 2, price: 110, popular: true },
    { id: "family", name: "Family Plan", description: "3 meals per day", mealsPerDay: 3, price: 150 },
  ],
};

export const getRestaurantById = (id) =>
  monthlyMealRestaurants.find((r) => r.id === id);

export const getPlanById = (planId) =>
  plansByRestaurant.plans.find((p) => p.id === planId);

export const mealTimeOptions = [
  { id: "breakfast", label: "Breakfast", window: "7:00 AM - 9:00 AM", optional: true },
  { id: "lunch", label: "Lunch", window: "11:00 AM - 1:00 PM", optional: false },
  { id: "dinner", label: "Dinner", window: "6:00 PM - 8:00 PM", optional: false },
  { id: "supper", label: "Supper (Optional)", window: "9:00 PM - 10:00 PM", optional: true },
];

export const deliveryDayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const dailyMealMenu = {
  lunch: [
    { id: "khmer-chicken-curry", name: "Khmer Chicken Curry", tag: "Spicy", image: placeholder },
    { id: "beef-lok-lak", name: "Beef Lok Lak", tag: "Chef's Choice", image: placeholder },
    { id: "fried-rice", name: "Fried Rice", tag: "Vegetarian, Gluten Free", image: placeholder },
  ],
  dinner: [
    { id: "khmer-chicken-curry", name: "Khmer Chicken Curry", tag: "Home Style", image: placeholder },
    { id: "beef-lok-lak", name: "Beef Lok Lak", tag: "Best Seller", image: placeholder },
    { id: "fried-rice", name: "Fried Rice", tag: "Vegetarian Option, Quick Meal", image: placeholder },
  ],
};

export const suggestedRestaurants = [
  { id: "healthy-bowl", name: "Healthy Bowl", price: 180, tags: ["Vegan", "Low Carb"], image: placeholder },
  { id: "green-delight", name: "Green Delight", price: 165, tags: ["High Protein", "Eco-friendly"], image: placeholder },
];
