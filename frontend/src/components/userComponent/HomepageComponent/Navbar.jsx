import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faLocationDot,
  faChevronDown,
  faRightFromBracket,
  faIdCard,
  faLocationCrosshairs,
  faXmark,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../../../path.js";
import { getCart } from "../../../service/cartService";
import NotificationBell from "./NotificationBell";
import Logo from "../../common/Logo";

const NAV_LINKS = [
  { label: "Home", path: PATH.USER.HOME },
  { label: "All Food", path: PATH.USER.AllFood },
  { label: "Restaurants", path: PATH.USER.AllRestaurants },
  { label: "Monthly Meal", path: PATH.USER.MonthlyMeal },
  { label: "My Subscription", path: PATH.USER.MySubscription },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState(
    () => localStorage.getItem("userLocation") || ""
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const locationRef = useRef(null);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartCount(res.data.cart?.CartItems?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const handler = () => fetchCart();
    if (localStorage.getItem("accessToken")) handler();
    window.addEventListener("cartUpdated", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("cartUpdated", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target))
        setLocationOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const addr = data.address;
          const label =
            addr.city || addr.town || addr.village || addr.county || "Unknown";
          setLocationLabel(label);
          localStorage.setItem("userLocation", label);
          setLocationOpen(false);
        } catch {
          setLocationError("Could not fetch address. Try again.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError("Location access denied.");
        setLocationLoading(false);
      }
    );
  };

  const handleClearLocation = () => {
    setLocationLabel("");
    localStorage.removeItem("userLocation");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate(PATH.AUTH.LOGIN);
  };

  const isActive = (path) =>
    path === PATH.USER.MonthlyMeal || path === PATH.USER.MySubscription
      ? location.pathname.startsWith(path)
      : location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF8EF] rounded-xl shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

        <Logo to={PATH.USER.HOME} />
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ label, path }) => (
            <li key={path}>
              <button
                onClick={() => navigate(path)}
                className={`btn-press px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive(path)
                    ? "bg-[#004953] text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#004953] hover:text-white"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* LOCATION */}
          <div className="relative hidden md:block" ref={locationRef}>
            <button
              onClick={() => { setLocationOpen((o) => !o); setLocationError(""); }}
              className="btn-press flex items-center gap-1.5 border border-[#004953] hover:border-[#004953] rounded-full px-3 py-1.5 text-sm text-[#004953] font-medium transition-colors cursor-pointer max-w-40"
            >
              <FontAwesomeIcon icon={faLocationDot} className="text-xs shrink-0" />
              <span className="truncate">
                {locationLabel || "Set Location"}
              </span>
              {locationLabel ? (
                <span
                  onClick={(e) => { e.stopPropagation(); handleClearLocation(); }}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </span>
              ) : (
                <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform shrink-0 ${locationOpen ? "rotate-180" : ""}`} />
              )}
            </button>

            {locationOpen && (
              <div className="animate-fade-in-scale absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Your Delivery Location
                </p>

                {locationLabel && (
                  <div className="flex items-center gap-2 bg-[#004953] rounded-xl px-3 py-2.5 mb-3">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[#004953] text-sm" />
                    <span className="text-sm font-medium text-[#004953] truncate">{locationLabel}</span>
                  </div>
                )}

                <button
                  onClick={handleDetectLocation}
                  disabled={locationLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#004953] hover:bg-[#003940] disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-medium transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faLocationCrosshairs}
                    className={locationLoading ? "animate-spin" : ""}
                  />
                  {locationLoading ? "Detecting…" : "Use My Location"}
                </button>

                {locationError && (
                  <p className="text-xs text-red-500 mt-2 text-center">{locationError}</p>
                )}
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <>
              {/* NOTIFICATIONS */}
              <NotificationBell />

              {/* CART */}
              <button
                onClick={() => navigate(PATH.USER.Checkout)}
                className="btn-press relative p-2.5 rounded-xl text-gray-600 hover:bg-[#004953] hover:text-white transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-4.5 min-h-4.5 flex items-center justify-center rounded-full leading-none px-1">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* PROFILE DROPDOWN */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="btn-press flex items-center gap-2 bg-[#004953] hover:bg-[#003940] text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`hidden sm:inline text-xs transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="animate-fade-in-scale absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden py-1 z-50">
                    <button
                      onClick={() => { navigate(PATH.USER.Profile); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#004953] hover:text-white transition-colors cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faIdCard} className=" hover:text-white w-4" />
                      My Profile
                    </button>
                    <hr className="border-gray-100 mx-3" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigate(PATH.AUTH.LOGIN)}
                className="btn-press px-4 py-2 text-sm font-medium text-[#004953] hover:bg-[#004953] rounded-xl transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate(PATH.AUTH.SIGNUP)}
                className="btn-press px-4 py-2 text-sm font-medium bg-[#004953] text-white hover:bg-[#003940] rounded-xl transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="btn-press lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-[#004953] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-lg" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {mobileMenuOpen && (
        <div className="animate-slide-down lg:hidden border-t border-black/5 px-4 sm:px-6 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`btn-press text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive(path)
                  ? "bg-[#004953] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#004953] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}

          <div className="md:hidden mt-1">
            <button
              onClick={handleDetectLocation}
              disabled={locationLoading}
              className="btn-press w-full flex items-center gap-2 border border-[#004953] rounded-xl px-4 py-2.5 text-sm text-[#004953] font-medium disabled:opacity-60 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faLocationDot}
                className={locationLoading ? "animate-spin" : ""}
              />
              {locationLoading ? "Detecting…" : locationLabel || "Set Location"}
            </button>
          </div>

          {!isLoggedIn && (
            <div className="sm:hidden flex items-center gap-2 mt-1">
              <button
                onClick={() => navigate(PATH.AUTH.LOGIN)}
                className="btn-press flex-1 px-4 py-2.5 text-sm font-medium text-[#004953] border border-[#004953] rounded-xl transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate(PATH.AUTH.SIGNUP)}
                className="btn-press flex-1 px-4 py-2.5 text-sm font-medium bg-[#004953] text-white rounded-xl transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
