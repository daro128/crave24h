import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShareNodes,
  faStar,
  faPhone,
  faUser,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import {
  getFavouriteRestaurants,
  addFavouriteRestaurant,
  removeFavouriteRestaurant,
} from "../../../service/favouriteService";


const Title = ({
  restaurantId,
  status,
  name,
  img,
  dsc,
  logo,
  rating,
  phone,
  owner,
  fee
}) => {
  const [like, setLike] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !restaurantId) return;
    getFavouriteRestaurants()
      .then((res) => {
        const ids = new Set((res.data || []).map((f) => f.Restaurant?.restaurant_id));
        setLike(ids.has(Number(restaurantId)) || ids.has(restaurantId));
      })
      .catch(() => {});
  }, [restaurantId]);

  const toggleFavourite = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || toggling) return;
    setToggling(true);
    try {
      if (like) {
        await removeFavouriteRestaurant(restaurantId);
        setLike(false);
      } else {
        await addFavouriteRestaurant(restaurantId);
        setLike(true);
        setPopped(true);
        setTimeout(() => setPopped(false), 400);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-8">
      <div className="relative">
        <div className="min-h-55 rounded-xl overflow-hidden relative">
          <img
            src={img}
            alt="Restaurant"
            className="w-full h-full object-cover absolute inset-0"
          />

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-5 sm:px-8 lg:px-12 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <div className="w-32 h-20 sm:w-52 sm:h-30 rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-lg bg-white shrink-0">
                <img
                  src={logo}
                  alt="Restaurant Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status === "open"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  />

                  <span className="text-white text-sm font-medium uppercase">
                    {status === "open" ? "Open Now" : "Closed"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif text-white mb-3">
                  {name}
                </h1>

                <p className="bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg inline-block max-w-2xl">
                  {dsc}
                </p>
              </div>
            </div>

            <div className="flex gap-4 shrink-0">
              <button
                onClick={toggleFavourite}
                disabled={toggling}
                title={like ? "Remove from favourites" : "Save to favourites"}
                className={`btn-press w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-transform duration-150 disabled:cursor-not-allowed ${popped ? "scale-125" : "scale-100"}`}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`w-7 h-7 transition-all duration-200 ${
                    like ? "text-red-500 drop-shadow-sm" : "text-gray-200"
                  }`}
                />
              </button>

              <button className="btn-press w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30">
                <FontAwesomeIcon
                  icon={faShareNodes}
                  className="w-7 h-7 text-white"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl py-2 mx-2 sm:mx-8 -mt-4 relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 text-center gap-y-3">
            <div>
              <FontAwesomeIcon
                icon={faStar}
                className="text-teal-700 text-xl "
              />

              <h3 className="uppercase text-gray-400 text-sm ">
                Rating
              </h3>

              <p className="text-teal-700 font-semibold text-lg">
                {rating || "0.0"} / 5
              </p>
            </div>

            <div className="border-l">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-[#004953] text-xl "
              />

              <h3 className="uppercase text-gray-400 text-sm">
                Contact
              </h3>

              <p className="text-teal-700 font-semibold text-lg">
                {phone}
              </p>
            </div>

            <div className="border-l">
              <FontAwesomeIcon
                icon={faUser}
                className="text-[#004953] text-xl "
              />

              <h3 className="uppercase text-gray-400 text-sm">
                Owner
              </h3>

              <p className="text-teal-700 font-semibold text-lg truncate px-2">
                {owner}
              </p>
            </div>

            <div className="border-l flex flex-col items-center justify-center">
              <FontAwesomeIcon
                icon={faMotorcycle}
                className="text-[#004953] text-xl"
              />
              <h3 className="uppercase text-gray-400 text-sm">
                Fee
              </h3>
              <p className="text-[#004953] font-semibold text-lg">
                ${fee}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;