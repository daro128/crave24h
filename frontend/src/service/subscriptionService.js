import API from "../api/axios";

export const createSubscription = (data) => API.post("/subscription", data);

export const getActiveSubscription = () => API.get("/subscription/active");

export const getSubscriptionById = (id) => API.get(`/subscription/${id}`);

export const pauseSubscription = (id, data) => API.post(`/subscription/${id}/pause`, data);

export const resumeSubscription = (id) => API.post(`/subscription/${id}/resume`);

export const cancelSubscription = (id, data) => API.post(`/subscription/${id}/cancel`, data);

export const getRefund = (id) => API.get(`/subscription/${id}/refund`);

export const updateMealSchedule = (id, data) => API.put(`/subscription/${id}/schedule`, data);

export const saveMealChoice = (id, date, data) =>
  API.put(`/subscription/${id}/meal-choice/${date}`, data);

export const getMealChoice = (id, date) => API.get(`/subscription/${id}/meal-choice/${date}`);

export const getMealChoicesRange = (id) => API.get(`/subscription/${id}/meal-choices`);

export const normalizeSubscription = (raw) => ({
  subscription_id: raw.subscription_id,
  restaurantId: raw.restaurant_ref_id,
  restaurantName: raw.restaurant_name,
  restaurantImage: raw.restaurant_image,
  planId: raw.plan_id,
  planName: raw.plan_name,
  planPrice: Number(raw.plan_price),
  mealsPerDay: raw.meals_per_day,
  duration: raw.duration_days,
  startDate: raw.start_date,
  endDate: raw.end_date,
  total: Number(raw.total_amount),
  status: raw.status,
  daysUsed: raw.days_used,
  mealTimes: (raw.SubscriptionMealTimes || []).map((m) => m.meal_time),
  deliveryTimes: Object.fromEntries(
    (raw.SubscriptionMealTimes || []).map((m) => [m.meal_time, m.delivery_time])
  ),
  deliveryDays: (raw.SubscriptionDeliveryDays || []).map((d) => d.day_name),
});
