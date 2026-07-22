
import AuthLogin from './pages/auth/AuthLogin.jsx'
import AuthSignUp from './pages/auth/AuthSignUp.jsx'


import DeliveryDashboard from './pages/deliver/DeliveryDashboard.jsx'
import { Route, Routes } from 'react-router-dom'
import DeliveryMap from './pages/deliver/DeliveryMap.jsx'
import DeliveryEarning from './pages/deliver/DeliveryEarning.jsx'
import DeliveryProfile from './pages/deliver/DeliveryProfile.jsx'

// import axios from 'axios'
import { PATH } from './path.js'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import AdminRestaurantManagement from './pages/admin/AdminRestaurantManagement.jsx'
import AdminUserManagement from './pages/admin/AdminUserManagement.jsx'
import AdminDeliveryManagement from './pages/admin/AdminDeliveryManagement.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

// import Signup from './pages/auth/SignUp.jsx';
// import Login from './pages/auth/Login.jsx';
import HomePage from './pages/user_page/HomePage.jsx';
import AllFoodPage from './pages/user_page/AllFoodPage.jsx';
import Profile from './pages/user_page/UserProfile.jsx'
import RestaurantPage from './pages/user_page/RestaurantPage.jsx';
import AllRestaurantsPage from './pages/user_page/AllRestaurantsPage.jsx';
import CheckoutPage from './pages/user_page/CheckoutPage.jsx';
import AddAdressPage from './pages/user_page/AddAdressPage.jsx';
import SucessPaymentPage from './pages/user_page/SucessPaymentPage.jsx';
import TrackOrderPage from './pages/user_page/TrackOrderPage.jsx';
import PaymentPage from './pages/user_page/Payment.jsx';
import MonthlyMealPage from './pages/user_page/MonthlyMealPage.jsx';
import MonthlyPlanPage from './pages/user_page/MonthlyPlanPage.jsx';
import MonthlySubscriptionPayment from './pages/user_page/MonthlySubscriptionPayment.jsx';
import MonthlyDeliveryTimePage from './pages/user_page/MonthlyDeliveryTimePage.jsx';
import MonthlyConfirmPage from './pages/user_page/MonthlyConfirmPage.jsx';
import MonthlySubscriptionActivePage from './pages/user_page/MonthlySubscriptionActivePage.jsx';
import MySubscriptionPage from './pages/user_page/MySubscriptionPage.jsx';
import DailyMealChoicePage from './pages/user_page/DailyMealChoicePage.jsx';
import PauseSubscriptionPage from './pages/user_page/PauseSubscriptionPage.jsx';

import PortalLayout from './components/Seller/PortalLayout';
import Dashboard from './pages/seller/Dashboard';
import Orders from './pages/seller/Orders';
import MenuManagement from './pages/seller/MenuManagement';
import Analytics from './pages/seller/Analytics';
import Promotions from './pages/seller/Promotions';
import Reviews from './pages/seller/Reviews';
import Settings from './pages/seller/Settings';

import './index.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ConnectionGuard from './components/common/ConnectionGuard.jsx';

import { Navigate } from "react-router-dom";


function App() {

  return (
    <ConnectionGuard>
    <Routes>

      <Route path={PATH.AUTH.LOGIN} element={<AuthLogin/>}/>
      <Route path={PATH.AUTH.SIGNUP} element={<AuthSignUp/>}/>
      <Route path="/" element={<Navigate to={PATH.AUTH.LOGIN} replace/>}/>

      <Route path={PATH.DELIVERY.DASHBOARD} element={<ProtectedRoute role="driver"> <DeliveryDashboard/> </ProtectedRoute>} />
      <Route path={PATH.DELIVERY.MAP} element={<ProtectedRoute role="driver"> <DeliveryMap/> </ProtectedRoute>}/>
      <Route path={PATH.DELIVERY.EARNING} element={<ProtectedRoute role="driver"> <DeliveryEarning/> </ProtectedRoute>}/>
      <Route path={PATH.DELIVERY.PROFILE} element={<ProtectedRoute role="driver"> <DeliveryProfile/> </ProtectedRoute>}/>

      <Route path={PATH.ADMIN.PROFILE} element={<ProtectedRoute role="admin"> <AdminProfile/> </ProtectedRoute>}/>
      <Route path={PATH.ADMIN.RESTAURANTS} element={<ProtectedRoute role="admin"> <AdminRestaurantManagement/> </ProtectedRoute>}/>
      <Route path={PATH.ADMIN.USERS} element={<ProtectedRoute role="admin"> <AdminUserManagement/> </ProtectedRoute>}/>
      <Route path={PATH.ADMIN.DELIVERIES} element={<ProtectedRoute role="admin"> <AdminDeliveryManagement/> </ProtectedRoute>}/>
      <Route path={PATH.ADMIN.DASHBOARD} element={<ProtectedRoute role="admin"> <AdminDashboard/> </ProtectedRoute>}/>


      <Route path={PATH.USER.HOME} element={<ProtectedRoute role="customer"> <HomePage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.Profile} element={<ProtectedRoute role="customer"> <Profile/> </ProtectedRoute>}/>
      <Route path={PATH.USER.AllFood} element={<ProtectedRoute role="customer"> <AllFoodPage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.AllRestaurants} element={<ProtectedRoute role="customer"> <AllRestaurantsPage/> </ProtectedRoute>}/>
      <Route path="/restaurant/:id" element={<ProtectedRoute role="customer"> <RestaurantPage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.Checkout} element={<ProtectedRoute role="customer"> <CheckoutPage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.AddAdress} element={<ProtectedRoute role="customer"> <AddAdressPage/> </ProtectedRoute>}/>
      <Route path={`${PATH.USER.SucessPayment}/:id`}element={<ProtectedRoute role="customer"><SucessPaymentPage /></ProtectedRoute>}/>
      <Route path={`${PATH.USER.Trackorder}/:id`}element={<ProtectedRoute role="customer"><TrackOrderPage /></ProtectedRoute>}/>
      <Route path={PATH.USER.Payment} element={<ProtectedRoute role="customer"> <PaymentPage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.MonthlyMeal} element={<ProtectedRoute role="customer"> <MonthlyMealPage/> </ProtectedRoute>}/>
      <Route path="/user/monthlymeal/:id" element={<ProtectedRoute role="customer"> <MonthlyPlanPage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.MonthlyMealPayment} element={<ProtectedRoute role="customer"> <MonthlySubscriptionPayment/> </ProtectedRoute>}/>
      <Route path={PATH.USER.MonthlyMealDelivery} element={<ProtectedRoute role="customer"> <MonthlyDeliveryTimePage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.MonthlyMealConfirm} element={<ProtectedRoute role="customer"> <MonthlyConfirmPage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.MonthlyMealActive} element={<ProtectedRoute role="customer"> <MonthlySubscriptionActivePage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.MySubscription} element={<ProtectedRoute role="customer"> <MySubscriptionPage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.DailyMealChoice} element={<ProtectedRoute role="customer"> <DailyMealChoicePage/> </ProtectedRoute>}/>
      <Route path={PATH.USER.PauseSubscription} element={<ProtectedRoute role="customer"> <PauseSubscriptionPage/> </ProtectedRoute>}/>

      
      <Route path={PATH.SELLER.DASHBOARD} element={<ProtectedRoute role="restaurant_owner"><PortalLayout><Dashboard /></PortalLayout></ProtectedRoute>} />
      <Route path={PATH.SELLER.ORDERS} element={<ProtectedRoute role="restaurant_owner"><PortalLayout><Orders /></PortalLayout></ProtectedRoute>} />
      <Route path={PATH.SELLER.MENU} element={<ProtectedRoute role="restaurant_owner"><PortalLayout><MenuManagement /></PortalLayout></ProtectedRoute>} />
      <Route path={PATH.SELLER.ANALYTICS} element={<ProtectedRoute role="restaurant_owner"><PortalLayout><Analytics /></PortalLayout></ProtectedRoute>} />
      <Route path={PATH.SELLER.PROMOTIONS} element={<ProtectedRoute role="restaurant_owner"><PortalLayout><Promotions /></PortalLayout></ProtectedRoute>} />
      <Route path={PATH.SELLER.REVIEWS} element={<ProtectedRoute role="restaurant_owner"><PortalLayout><Reviews /></PortalLayout></ProtectedRoute>} />
      <Route path={PATH.SELLER.SETTINGS} element={<ProtectedRoute role="restaurant_owner"><PortalLayout><Settings /></PortalLayout></ProtectedRoute>} />



    </Routes>
    </ConnectionGuard>
  )
}

export default App
