
const ProcessStep = ({currentStep=1}) => {
    const steps = [
    { id: 1, label: "Delivery" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Confirm" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${ currentStep >= step.id
                      ? "bg-[#004953] text-white"
                      : "bg-[#d9d5f2] text-[#6b7280]"
                } `} >{step.id}
                </div>
              <span
                    className={`mt-2 text-xs font-medium 
                    ${ currentStep >= step.id ? "text-[#004953]" : "text-gray-500" }`}>{step.label}
                </span>
            </div>
            {index < steps.length - 1 && (
            <div
                className={`flex-1 h-0.5 mx-4 ${ currentStep > step.id ? "bg-[#004953]" : "bg-pink-100" }`} />)}
            </div>
        ))}
      </div>
    </div>
  );
}

export default ProcessStep
