import {
  faMoneyBillWave,
  faReceipt,
  faMotorcycle,
  faHandHoldingDollar,
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CashPayment = ({ total = 0 }) => {
  const steps = [
    { icon: faReceipt, label: "ORDERED" },
    { icon: faMotorcycle, label: "ON THE WAY" },
    { icon: faHandHoldingDollar, label: "PAY ON DELIVERY" },
  ];
  const notes = [
    "Please have your phone reachable so the rider can contact you.",
    "Unpaid orders may be cancelled automatically.",
    "A digital receipt is issued once payment is confirmed.",
  ];

  return (
    <div className="rounded-2xl bg-white p-7 shadow-xl">

      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#004953]">
          <FontAwesomeIcon
            icon={faMoneyBillWave}
            className="text-3xl text-white"
          />
        </div>
      </div>

      {/* Title */}
      <div className="mt-5 text-center">
        <h2 className="text-2xl font-bold text-[#004953]">Cash on Delivery</h2>
        <p className="mt-2 text-sm text-gray-500">
          Pay the rider in cash when your order arrives at your door.
        </p>
      </div>

      {/* Amount */}
      <div className="mt-6 rounded-2xl border border-[#004953] bg-[#004953] p-6 text-center">
        <p className="text-sm text-white">Please prepare the exact amount</p>
        <h1 className="mt-2 text-4xl font-bold text-white">${total.toFixed(2)}</h1>
        <p className="mt-1 text-xs text-gray-500">
          Exact change helps speed up handover
        </p>
      </div>

      {/* Steps */}
      <div className="mt-6 rounded-2xl bg-[#004953] p-6">
        <div className="flex items-start justify-between">
          {steps.map((step, i) => (
            <div key={step.label} className="contents">
              <div className="flex flex-col items-center w-20">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#004953]">
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                <span className="mt-2 text-[11px] font-semibold text-center text-white">
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="mt-5 h-0.5 flex-1 border-t-2 border-dashed border-white" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 rounded-2xl border border-[#004953] bg-white p-5">
        <h3 className="flex items-center gap-2 font-semibold text-[#004953]">
          <FontAwesomeIcon icon={faCircleExclamation} />
          Important Notes
        </h3>
        <ul className="mt-3 space-y-3 text-sm text-gray-600">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#004953] shrink-0" />
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer badge */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm text-[#004953]">
        <FontAwesomeIcon icon={faCircleCheck} />
        <span>Cash on delivery available for your area.</span>
      </div>

    </div>
  );
};

export default CashPayment;