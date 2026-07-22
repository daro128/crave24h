const STEPS = [
  { id: 1, label: "Plan" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Delivery Time" },
  { id: 4, label: "Confirm" },
];

const SubscriptionSteps = ({ currentStep = 1 }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0
                  ${
                    currentStep > step.id
                      ? "bg-[#004953] text-white"
                      : currentStep === step.id
                      ? "bg-[#004953] text-white ring-4 ring-[#004953]/20"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {currentStep > step.id ? "✓" : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  currentStep >= step.id ? "text-[#004953]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 ${
                  currentStep > step.id ? "bg-[#004953]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionSteps;
