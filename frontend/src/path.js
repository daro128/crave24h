export const PATH = {
    AUTH: {
        LOGIN: "/auth/login",
        SIGNUP: "/auth/signup"
    },
    DELIVERY:{
        DASHBOARD:"/delivery/dashboard",
        MAP:"/delivery/map",
        EARNING:"/delivery/earning",
        PROFILE:"/delivery/profile"
    },
    ADMIN:{
        DASHBOARD:"/admin/dashboard",
        DELIVERIES:"/admin/deliveries",
        PROFILE:"/admin/profile",
        RESTAURANTS:"/admin/restaurants",
        USERS:"/admin/users"
    },
    SELLER:{
        LOGIN:"/seller/login",
        DASHBOARD:"/seller/dashboard",
        ORDERS:"/seller/orders",
        MENU:"/seller/menu",
        ANALYTICS:"/seller/analytics",
        PROMOTIONS:"/seller/promotions",
        REVIEWS:"/seller/reviews",
        SETTINGS:"/seller/settings"
    },
    USER:{
        HOME: "/user/home",
        Profile : "/user/profile",
        AllFood : "/user/allfood",
        AllRestaurants: "/user/allrestaurants",
        Restaurant: (id) => `/restaurant/${id}`,
        Checkout : "/user/restaurant/checkout",
        AddAdress : "/user/restaurant/checkout/addadress",
        SucessPayment : "/user/restaurant/checkout/addadress/payment/sucesspayment",
        Trackorder : "/user/restaurant/checkout/addadress/payment/sucesspayment/trackorder",
        Payment : "/user/restaurant/checkout/addadress/payment",
        MonthlyMeal : "/user/monthlymeal",
        MonthlyMealPlan : (id) => `/user/monthlymeal/${id}`,
        MonthlyMealPayment : "/user/monthlymeal/payment",
        MonthlyMealDelivery : "/user/monthlymeal/delivery",
        MonthlyMealConfirm : "/user/monthlymeal/confirm",
        MonthlyMealActive : "/user/monthlymeal/active",
        MySubscription : "/user/subscription",
        DailyMealChoice : "/user/subscription/daily-choice",
        PauseSubscription : "/user/subscription/pause"
    },
}
