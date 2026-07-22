import Navbar from '../../components/userComponent/HomepageComponent/Navbar'
import Menu from '../../components/userComponent/HomepageComponent/Menu'
import ShowSection from '../../components/userComponent/HomepageComponent/ShowSection'
import Search from '../../components/userComponent/HomepageComponent/Search'
import ExclusiveFood from '../../components/userComponent/HomepageComponent/ExclusiveFood'
import ExploreCuisines from '../../components/userComponent/HomepageComponent/ExploreCuisines'
import BrowAllfood from '../../components/userComponent/HomepageComponent/BrowAllfood'
import Tredingfood from '../../components/userComponent/HomepageComponent/Tredingfood'
import FeaturedRestaurants from '../../components/userComponent/HomepageComponent/FeaturedRestaurants'
import TopRestaurants from '../../components/userComponent/HomepageComponent/TopRestaurants'
import SuperfastDelivery from '../../components/userComponent/HomepageComponent/SuperfastDelivery'
import NewMenu from '../../components/userComponent/HomepageComponent/NewMenu'
import GetApp from '../../components/userComponent/HomepageComponent/GetApp'
import Footer from '../../components/userComponent/HomepageComponent/Footer'
import { getProfile } from "../../service/profileService"
import { getAllProducts } from '../../service/productService'
import { getAllRestaurants } from '../../service/restaurantService'
import { useEffect, useState } from "react";
import Reveal from "../../components/common/Reveal";


const HomePage = () => {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [products, setProducts] = useState([])
    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getProfile();

                console.log("Profile:", response);

                setUser(response.User);
            } catch (error) {
                console.log(error);
            }
        };

        const loadProducts = async () => {
            try {
                const res = await getAllProducts();
                setProducts(res.data.products);
            } catch (error) {
                console.log(error);
            }
        };
        const loadRestaurants = async () => {
            const res = await getAllRestaurants();
            setRestaurants(res.data);
        };

        loadProfile();
        loadProducts();
        loadRestaurants()
    }, []);
    return (
        <div>
            <div className='px-4 sm:px-8 lg:px-15 py-5'>

                <Navbar />
                <h1 className="font-bold text-2xl sm:text-3xl text-[#004953] py-5">
                    {getGreeting()}, {user?.full_name}
                </h1>
                <ShowSection />
                <Search />
                <Menu />
                <Reveal as="div" id="section-discounts"><ExclusiveFood products={products} /></Reveal>
                <Reveal><ExploreCuisines products={products} /></Reveal>
                <Reveal><BrowAllfood products={products} /></Reveal>
                <Reveal as="div" id="section-trending"><Tredingfood products={products} /></Reveal>
                <Reveal as="div" id="section-restaurants"><FeaturedRestaurants restaurants={restaurants} /></Reveal>
                <Reveal as="div" id="section-top-rate"><TopRestaurants restaurants={restaurants} /></Reveal>
                <Reveal as="div" id="section-fast-delivery"><SuperfastDelivery restaurants={restaurants} /></Reveal>
                <Reveal as="div" id="section-new-arrivals"><NewMenu products={products} /></Reveal>

            </div>
            <Reveal><GetApp /></Reveal>
            <Footer />
        </div>
    )
}
export default HomePage