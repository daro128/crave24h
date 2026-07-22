import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMessage,
  faCircleInfo,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const RightSection = () => {
  const deliverers = [
    {
      id: 1,
      name: "Kim Seyha",
      rating: 4.9,
      numberOfDeliveries: 2000,
      image: "https://i.pravatar.cc/150?img=1",
    },
  ];

  const driver = deliverers[0];

  return (
    <div className="border border-[#004953] shadow-2xl rounded-3xl p-2 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <img
          src={driver.image}
          alt={driver.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold text-lg">
            {driver.name}
          </h3>

          <p className="text-sm text-gray-500">
            <FontAwesomeIcon
              icon={faStar}
              className="mr-1 text-yellow-400"
            />
            {driver.rating} • {driver.numberOfDeliveries}+ Deliveries
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn-press flex-1 border-2 border-[#004953] rounded-full hover:bg-[#004953] hover:text-white duration-200 py-3 flex justify-center items-center gap-2">
          <FontAwesomeIcon icon={faPhone} />
          Call
        </button>

        <button className="btn-press flex-1 border-2 border-[#004953] rounded-full hover:bg-[#004953] hover:text-white duration-200 py-3 flex justify-center items-center gap-2">
          <FontAwesomeIcon icon={faMessage} />
          Chat
        </button>
      </div>
      <div className="bg-purple-100 rounded-2xl p-3 flex gap-3 items-start">
        <FontAwesomeIcon
          icon={faCircleInfo}
          className="mt-1 text-[#004953]"
        />

        <p className="text-sm">
          Kim is nearby and will be arriving at your doorstep in
          approximately 12 minutes.
        </p>
      </div>
    </div>
  );
};

export default RightSection;