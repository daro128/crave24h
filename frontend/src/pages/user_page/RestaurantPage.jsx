import Nav from "../../components/userComponent/HomepageComponent/Navbar";
import Title from "../../components/userComponent/RestaurantComponent/Title";
import FoodSection from "../../components/userComponent/RestaurantComponent/FoodSection";
import Footer from "../../components/userComponent/HomepageComponent/Footer";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getRestaurantById } from "../../service/restaurantService";
import Loading from "./LoadingPage";
import placeholderRestaurant from "../../assets/image copy 2.png";

const RestaurantPage = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRestaurant = async () => {
    try {
      setLoading(true);

      const res = await getRestaurantById(id);

      console.log(res.data);

      setRestaurant(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchRestaurant();
}, [id]);

  if (loading) {
    return (
      <div >
        <Loading/>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Restaurant not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="px-4 sm:px-6 lg:px-10">
        <Title
          restaurantId={id}
          status={restaurant.status}
          name={restaurant.restaurant_name}
          img={restaurant.image ? `http://localhost:5000/uploads/${restaurant.image}` : placeholderRestaurant}
          logo={restaurant.logo ? `http://localhost:5000/uploads/${restaurant.logo}` : placeholderRestaurant}
          dsc={restaurant.description}
          rating={restaurant.average_rating}
          phone={restaurant.phone}
          address={restaurant.address}
          fee={restaurant.fee}
          owner={restaurant.User?.full_name}
        />
        <FoodSection restaurantId={id} />
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

export default RestaurantPage;