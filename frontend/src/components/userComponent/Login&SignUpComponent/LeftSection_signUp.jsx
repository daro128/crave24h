import drinkImg from '../../../assets/image copy 3.png';
import burgerImg from '../../../assets/image copy 4.png';
import pizzaImg from '../../../assets/image copy 5.png';
import coffeeImg from '../../../assets/image copy 6.png';
import cakeImg from '../../../assets/image copy 7.png';

const LeftSection_signUp = () => {
  return (
    <div className="hidden lg:flex right-section rounded-l-2xl relative w-full overflow-hidden bg-[#004953] flex-col justify-between px-10 py-6">

      {/* Logo */}
      <div className="z-20">
        <h1 className="text-white text-6xl font-bold tracking-wide">
          Crave24h
        </h1>
      </div>

      {/* Food Images */}
      <div className="relative flex-1 flex items-center justify-center">

        {/* Burger */}
        <img
          src={burgerImg}
          alt="Burger"
          className="
            absolute
            top-16
            left-16
            w-40
            rotate-[-10deg]
            drop-shadow-2xl
            transition-all
            duration-300
            hover:scale-105
            hover:-translate-y-1
          "
          style={{
            animation: "float1 4s ease-in-out infinite",
          }}
        />

        {/* Drink */}
        <img
          src={drinkImg}
          alt="Drink"
          className="
            absolute
            top-10
            right-20
            w-40
            rotate-[8deg]
            drop-shadow-2xl
            transition-all
            duration-300
            hover:scale-105
            hover:-translate-y-1
          "
          style={{
            animation: "float2 5s ease-in-out infinite",
          }}
        />

        {/* Coffee */}
        <img
          src={coffeeImg}
          alt="Coffee"
          className="
            absolute
            bottom-24
            left-12
            w-40
            rotate-[-12deg]
            drop-shadow-2xl
            transition-all
            duration-300
            hover:scale-105
            hover:-translate-y-1
          "
          style={{
            animation: "float3 6s ease-in-out infinite",
          }}
        />

        {/* Cake */}
        <img
          src={cakeImg}
          alt="Cake"
          className="
            absolute
            bottom-20
            right-16
            w-40
            rotate-[10deg]
            drop-shadow-2xl
            transition-all
            duration-300
            hover:scale-105
            hover:-translate-y-1
          "
          style={{
            animation: "float4 5s ease-in-out infinite",
          }}
        />

        {/* Center Pizza */}
        <img
          src={pizzaImg}
          alt="Pizza"
          className="
            z-10
            w-72
            drop-shadow-2xl
            transition-all
            duration-300
            hover:scale-105
          "
          style={{
            animation: "floatCenter 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Bottom Features */}
      <div className="flex justify-center gap-5 flex-wrap">

        <div
          className="
            bg-white/95
            px-7
            py-3
            rounded-full
            shadow-xl
            transition-all
            duration-300
            hover:scale-105
          "
        >
          <p className="text-[#004953] text-sm font-semibold">
             Verified Chefs
          </p>
        </div>

        <div
          className="
            bg-white/95
            px-7
            py-3
            rounded-full
            shadow-xl
            transition-all
            duration-300
            hover:scale-105
          "
        >
          <p className="text-[#004953] text-sm font-semibold">
             20m Delivery
          </p>
        </div>

        <div
          className="
            bg-white/95
            px-7
            py-3
            rounded-full
            shadow-xl
            transition-all
            duration-300
            hover:scale-105
          "
        >
          <p className="text-[#004953] text-sm font-semibold">
             4.9/5 Rating
          </p>
        </div>
      </div>

      {/* Custom Animation */}
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
  );
};

export default LeftSection_signUp;