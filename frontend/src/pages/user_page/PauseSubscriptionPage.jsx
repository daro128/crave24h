import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPlay } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import { getActiveSubscription, normalizeSubscription, pauseSubscription } from "../../service/subscriptionService";
import { PATH } from "../../path";

const DURATIONS = [
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const addDays = (iso, days) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const todayISO = () => new Date().toISOString().split("T")[0];

const PauseSubscriptionPage = () => {
  const navigate = useNavigate();
  const [sub, setSub] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [customDays, setCustomDays] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getActiveSubscription()
      .then(({ data }) => setSub(normalizeSubscription(data.subscription)))
      .catch(() => setSub(null))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && !sub) navigate(PATH.USER.MonthlyMeal);
  }, [loaded, sub, navigate]);

  if (!sub) return null;

  const duration = isCustom ? Number(customDays) || 0 : selectedDuration;
  const startDate = todayISO();
  const resumeDate = duration > 0 ? addDays(startDate, duration) : startDate;
  const newEndDate = duration > 0 ? addDays(sub.endDate, duration) : sub.endDate;

  const handleConfirmPause = async () => {
    if (duration <= 0) return;
    setSubmitting(true);
    setError("");
    try {
      await pauseSubscription(sub.subscription_id, { durationDays: duration });
      navigate(PATH.USER.MySubscription);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to pause subscription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-[#004953]">Pause Your Subscription</h1>
            <p className="text-gray-500 mt-1 mb-6">Going away? Pause your meals and your remaining days will be saved.</p>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Choose Duration</h3>
              <div className="flex flex-wrap gap-3">
                {DURATIONS.map((d) => (
                  <button
                    key={d.label}
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedDuration(d.days);
                    }}
                    className={`btn-press px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                      !isCustom && selectedDuration === d.days
                        ? "bg-[#004953] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
                <button
                  onClick={() => setIsCustom(true)}
                  className={`btn-press px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                    isCustom ? "bg-[#004953] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  📅 Custom
                </button>
              </div>

              {isCustom && (
                <input
                  type="number"
                  min="1"
                  placeholder="Number of days"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="mt-4 w-40 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004953]"
                />
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-800 mb-4">Pause Period</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(startDate)}</p>
                </div>
                <span className="text-gray-300">→</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Resume Date</p>
                  <p className="font-semibold text-gray-800">{duration > 0 ? formatDate(resumeDate) : "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-700 text-sm rounded-2xl px-5 py-4 flex items-start gap-3 mt-6">
              <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5" />
              <span>
                Your plan will automatically resume on {duration > 0 ? formatDate(resumeDate) : "—"}. Unused days are
                added to your end date.
              </span>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">Preview of your Dashboard</p>
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-amber-600">
                    ● Paused — resumes {duration > 0 ? formatDate(resumeDate) : "—"}
                  </span>
                  <span className="text-[#004953] font-semibold flex items-center gap-1">
                    <FontAwesomeIcon icon={faPlay} className="text-xs" /> Resume Now
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "40%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Your remaining days are saved and will be added back once you resume.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current end date</span>
                  <span className="font-semibold text-gray-800">{formatDate(sub.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pause duration</span>
                  <span className="font-semibold text-gray-800">{duration > 0 ? `${duration} days` : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New end date</span>
                  <span className="font-semibold text-[#004953]">{duration > 0 ? formatDate(newEndDate) : "—"}</span>
                </div>
              </div>

              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

              <button
                onClick={handleConfirmPause}
                disabled={duration <= 0 || submitting}
                className="btn-press w-full mt-6 py-3.5 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Pausing…" : "Confirm Pause"}
              </button>
              <button
                onClick={() => navigate(PATH.USER.MySubscription)}
                className="btn-press w-full mt-2 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Keep My Plan Active
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

export default PauseSubscriptionPage;
