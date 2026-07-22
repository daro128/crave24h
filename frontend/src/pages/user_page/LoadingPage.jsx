const Loading = ({
  title = "Loading...",
  description = "Please wait a moment.",
  size = "lg",
}) => {
  const spinnerSize =
    size === "sm"
      ? "w-12 h-12"
      : size === "md"
      ? "w-16 h-16"
      : "w-20 h-20";

  return (
    <div className="w-full flex flex-col items-center justify-center py-24">

      <div className="relative">
        <div className={`${spinnerSize} rounded-full bg-[#004953] animate-pulse`} />
        <div
          className={`absolute inset-0 ${spinnerSize}
          rounded-full border-[5px]
          border-[#004953]
          border-t-[#004953]
          animate-spin`}
        />

        {/* Center */}
        <div
          className={`absolute inset-3 rounded-full bg-white shadow-inner`}
        />

      </div>

      {/* Loading Text */}
      <h2 className="mt-8 text-3xl font-bold text-[#004953] tracking-wide">
        {title}
      </h2>

      <p className="mt-3 text-gray-500 text-center max-w-sm">
        {description}
      </p>

      {/* Animated Dots */}
      <div className="flex gap-2 mt-6">
        <span className="w-3 h-3 rounded-full bg-[#004953] animate-bounce"></span>
        <span
          className="w-3 h-3 rounded-full bg-[#004953] animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></span>
        <span
          className="w-3 h-3 rounded-full bg-[#004953] animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></span>
      </div>

    </div>
  );
};

export default Loading;