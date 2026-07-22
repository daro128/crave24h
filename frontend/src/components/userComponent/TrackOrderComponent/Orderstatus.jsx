import {
  faCheck,
  faUtensils,
  faMotorcycle,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const steps = [
  { title: "Confirmed", icon: faCheck },
  { title: "Preparing", icon: faUtensils },
  { title: "On the way", icon: faMotorcycle },
  { title: "Delivered", icon: faBox },
];

const STATUS_TO_STEP = {pending: 0,confirmed: 0,preparing: 1,ready: 1,on_the_way: 2,out_for_delivery: 2,delivered: 3,completed: 3,};
const Orderstatus = ({ order }) => {
  const status = (order?.order_status || "pending").toLowerCase();
  const currentStep = STATUS_TO_STEP[status] ?? 0;

  return (
    <div className="rounded-2xl p-5 border-b">
      <div className="relative flex justify-between items-center">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.75 bg-gray-200" />
        <div
          className="absolute top-5 left-0 h-0.75 bg-teal-700 transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                ${
                  index <= currentStep
                    ? "bg-teal-700 border-teal-700 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
            >
              <FontAwesomeIcon icon={step.icon} />
            </div>

            <span
              className={`mt-3 text-[11px] sm:text-sm font-medium text-center
                ${index <= currentStep ? "text-teal-700" : "text-gray-400"}`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orderstatus;