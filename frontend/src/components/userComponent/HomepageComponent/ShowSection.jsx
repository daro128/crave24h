import drinkImg from '../../../assets/image copy 3.png';
import pizzaImg from '../../../assets/image copy 5.png';
import coffeeImg from '../../../assets/image copy 6.png';
import cakeImg from '../../../assets/image copy 7.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pillActions = {
        "Trending": {
            type: "scroll",
            target: "section-trending",
        },
        "Discounts": {
            type: "scroll",
            target: "section-discounts",
        },
        "Top Rate": {
            type: "scroll",
            target: "section-top-rate",
        },
        "Fast Delivery": {
            type: "scroll",
            target: "section-fast-delivery",
        },
    };
    const ShowSection = () => {
        const navigate = useNavigate();
        const [active, setactive] = useState('')
        const items = [
            "Trending",
            "Discounts",
            "Top Rate",
            "Fast Delivery",
        ];
    const handleClick = (name) => {
        setactive(name);
        const action = pillActions[name];
        if (!action) return;
        if (action.type === "navigate") {
            navigate(action.target);
        } else {
            document.getElementById(action.target) ?.scrollIntoView({behavior: "smooth",});
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-6 sm:px-12 bg-[#FFF8EF] shadow-lg rounded-2xl">
            <div className="content flex flex-col py-10 lg:py-20 gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#004953] ">Hungry right now?</h1>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#004953]">We got You Covered!</h1>
                <p className="text-[#004953]">Discover the best flavors in your city, delivered fresh and hot in under 20 minutes.</p>
                <div className="buttons flex flex-col sm:flex-row gap-4 py-4">
                    <button onClick={() => navigate('/user/allfood')} className="btn-press bg-[#004953] text-lg text-white border-2 border-[#004953] px-8 sm:px-16 py-3.5 rounded-3xl transition-all duration-300 hover:bg-black hover:text-white">Order Now</button>
                    <button onClick={() => navigate('/user/allfood?sort=popular')} className="btn-press bg-transparent text-lg text-[#004953] border-2 border-[#004953] px-8 sm:px-16 py-3.5 rounded-3xl transition-all duration-300 hover:bg-[#004953] hover:text-white">Monthly Specials</button>
                </div>
                <div className="">
                    <ul className="flex gap-4 text-sm text-[#004953] overflow-x-auto">
                        {items.map((item, index) => (
                            <li key={index} className={active === item ? 'active' : ''} onClick={() => handleClick(item)}
                                style={{ border: '1px solid #004953', cursor: 'pointer', padding: '10px 16px', borderRadius: '20px', backgroundColor: active === item ? '#004953' : 'transparent', color: active === item ? 'white' : '#004953' }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="image">
                <div className="right-section relative w-full h-72 sm:h-96 lg:h-120 bg-transparent flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-2 overflow-hidden">
                    {/* Food Images */}
                    <div className="relative flex-1 flex items-center justify-center">

                        {/* Drink */}
                        <img
                            src={drinkImg}
                            alt="Drink"
                            className="
                        absolute
                        top-6 sm:top-10 lg:top-18
                        right-2 sm:right-8 lg:right-15
                        w-24 sm:w-32 lg:w-45
                        rotate-[8deg]
                        z-20
                        drop-shadow-2xl
                        transition-all
                        duration-300
                        hover:scale-105
                    "
                            style={{
                                animation: "float1 2s ease-in-out infinite",
                            }}
                        />

                        <img
                            src={coffeeImg}
                            alt="Coffee"
                            className="
                        absolute
                        bottom-4 sm:bottom-8 lg:bottom-auto lg:top-50
                        left-2 sm:left-8 lg:left-20
                        w-24 sm:w-32 lg:w-50
                        z-20
                        rotate-[10deg]
                        drop-shadow-2xl
                        transition-all
                        duration-300
                        hover:scale-105
                    "
                            style={{
                                animation: "float2 3s ease-in-out infinite",
                            }}
                        />
                        <img
                            src={cakeImg}
                            alt="Cake"
                            className="
                        absolute
                        bottom-4 sm:bottom-8 lg:bottom-auto lg:top-50
                        right-2 sm:right-8 lg:right-15
                        w-24 sm:w-32 lg:w-50
                        z-20
                        drop-shadow-2xl
                        transition-all
                        duration-300
                        hover:scale-105
                    "
                            style={{
                                animation: "float3 4s ease-in-out infinite",
                            }}
                        />

                        {/* Center Pizza */}
                        <img
                            src={pizzaImg}
                            alt="Pizza"
                            className="
                        relative
                        w-32 sm:w-40 lg:w-50
                        z-25
                        drop-shadow-2xl
                        transition-all
                        duration-300
                        hover:scale-105
                    "
                            style={{
                                animation: "float4 5s ease-in-out infinite",
                            }}
                        />
                    </div>
                    <style>
                        {`
                    @keyframes float1 {
                        0%,100% { transform: translateY(0px) rotate(-10deg); }
                        50% { transform: translateY(-4px) rotate(-10deg); }
                    }

                    @keyframes float2 {
                        0%,100% { transform: translateY(0px) rotate(8deg); }
                        50% { transform: translateY(-4px) rotate(8deg); }
                    }

                    @keyframes float3 {
                        0%,100% { transform: translateY(0px) rotate(-12deg); }
                        50% { transform: translateY(-4px) rotate(-12deg); }
                    }

                    @keyframes float4 {
                        0%,100% { transform: translateY(0px) rotate(10deg); }
                        50% { transform: translateY(-4px) rotate(10deg); }
                    }

                    @keyframes floatCenter {
                        0%,100% { transform: translateY(0px); }
                        50% { transform: translateY(-4px); }
                    }
                    `}
                    </style>

                </div>

            </div>

        </div>
    )
}

export default ShowSection
