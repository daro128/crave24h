import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../path.js";
import { register } from "../../service/authService.js";

const TEAL = "#004953";

export default function AuthSignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        phone,
        password,
      });

      navigate(PATH.AUTH.LOGIN);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root min-h-screen w-full bg-[#F6FAFA] text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .auth-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .auth-input:focus { outline:none; border-color:${TEAL}; box-shadow:0 0 0 4px rgba(0,73,83,.12); }
      `}</style>

      <div className="flex min-h-screen">
        {/* ───────── Illustration panel (left, desktop only) ───────── */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-16 bg-[#003f4948]">
          <svg viewBox="0 0 360 260" className="w-full max-w-sm" fill="none" aria-hidden="true">
            <circle cx="180" cy="120" r="110" fill="#fff" />
            <circle cx="180" cy="120" r="110" stroke="#E6EEEE" strokeWidth="1.5" />

            <path
              d="M70 200 C 120 150, 150 150, 185 120 S 250 70, 295 78"
              stroke={TEAL}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="2 10"
            />
            <circle cx="70" cy="200" r="5" fill="#CBD5E1" />

            <g>
              <path
                d="M295 50c-11 0-20 9-20 20 0 14 20 30 20 30s20-16 20-30c0-11-9-20-20-20Z"
                fill={TEAL}
              />
              <circle cx="295" cy="70" r="7" fill="#fff" />
            </g>

            <g stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <circle cx="120" cy="200" r="20" fill="#fff" />
              <circle cx="210" cy="200" r="20" fill="#fff" />
              <path d="M120 200l22-46h24" />
              <path d="M166 154l16 34h28" />
              <rect x="150" y="120" width="40" height="34" rx="6" fill="#fff" stroke={TEAL} />
              <path d="M150 134h40" stroke={TEAL} />
              <path d="M186 154l24 0" />
              <path d="M210 188v-30h14" />
            </g>
            <circle cx="120" cy="200" r="5" fill="#334155" />
            <circle cx="210" cy="200" r="5" fill="#334155" />

            <g stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
              <path d="M64 150h22" />
              <path d="M54 168h32" />
            </g>
          </svg>

          <h2 className="mt-10 max-w-sm text-center text-2xl font-bold tracking-tight text-slate-900">
            Join the kitchen-to-doorstep network
          </h2>
          <p className="mt-3 max-w-sm text-center text-[15px] leading-relaxed text-slate-500">
            Create your account to start tracking orders and drivers in real
            time, all from one dashboard.
          </p>

          <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
            {["Live tracking", "Fast dispatch", "One dashboard"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="rgba(0,73,83,.1)" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ───────── Form card (right) ───────── */}
        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 lg:p-10">
            {/* brand */}
            <div className="mb-8 flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
                style={{ background: TEAL }}
              >
                A
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-slate-900">
                Crave24h
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Join Crave24h and start your food journey
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            <form className="mt-7 space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="auth-input w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="auth-input w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-[15px] text-slate-900 placeholder:text-slate-400 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3 3l18 18M10.6 5.2A9.6 9.6 0 0112 5c5 0 9 4.5 9 7 0 .9-.7 2.2-1.9 3.4M6.5 6.6C3.9 8 2 10.4 2 12c0 2.5 4 7 10 7 1.6 0 3-.3 4.3-.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                        <path d="M9.9 9.9a3 3 0 004.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-press mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: TEAL }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Creating account
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate(PATH.AUTH.LOGIN)}
                className="btn-press font-semibold hover:underline"
                style={{ color: TEAL }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
