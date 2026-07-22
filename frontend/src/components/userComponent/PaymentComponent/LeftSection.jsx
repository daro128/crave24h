const LeftSection = ({
  methods,
  selected,
  onChange,
}) => {
  return (
    <div className="lg:col-span-4 bg-gray-100 p-2 shadow-2xl rounded-2xl">
      <h2 className="mb-3 text-2xl font-bold text-[#005566]">
        Select Payment Method
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onChange(method.id)}
            className={`
              btn-press relative flex h-12 flex-col items-center justify-center hover:cursor-pointer hover:text-white hover:bg-[#004953]  rounded-md border
              transition-all duration-200
              ${
                selected === method.id
                  ? "border-[#005566] bg-[#004953] text-white"
                  : "border-[#004953] bg-white text-[#004953]"
              }
            `}
          >
            <span>{method.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeftSection;