import { useEffect, useState } from "react";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const KHQRPayment = ({ total = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [orderId, setOrderId] = useState(null);

  // fake order id until backend creates real one
  useEffect(() => {
    setOrderId("TEMP-" + Date.now());
  }, []);

  // countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isExpired = timeLeft === 0;
  const isWarning = timeLeft <= 120;

  return (
    <div className="rounded-2xl px-8 py-2 shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#005566]">
          KHQR Payment
        </h2>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isExpired
            ? "bg-red-100 text-red-600"
            : "bg-yellow-100 text-[#004953]"
        }`}>
          {isExpired ? "Expired" : "Pending"}
        </span>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Amount to Pay</p>

        <h1 className="mt-1 text-4xl font-bold text-[#005566]">
          ${total.toFixed(2)}
        </h1>
      </div>

      {/* QR CODE */}
      <div className="mt-6 flex justify-center">
        <div className="rounded-2xl border bg-white p-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ORDER-${orderId}-AMOUNT-${total}`}
            alt="KHQR"
            className="h-60 w-60"
          />
        </div>
      </div>

      {/* TIMER */}
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-500">QR expires in</p>

        <h3 className={`mt-1 text-2xl font-bold ${
          isWarning ? "text-red-500" : "text-[#005566]"
        }`}>
          {formatTime()}
        </h3>
      </div>

      {/* ORDER INFO */}
      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Order ID</span>
          <span className="font-medium">{orderId}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium">KHQR</span>
        </div>
      </div>

      {/* BUTTON */}
      <div className="mt-4">
        {isExpired ? (
          <button className="btn-press flex w-full items-center justify-center gap-2 rounded-xl bg-[#005566] py-3 font-semibold text-white">
            <FontAwesomeIcon icon={faRotateRight} />
            Generate New QR
          </button>
        ) : (
          <button className="btn-press w-full rounded-xl border border-[#005566] py-3 font-semibold text-[#005566] hover:bg-[#005566] hover:text-white">
            Waiting for Payment...
          </button>
        )}
      </div>
    </div>
  );
};

export default KHQRPayment;