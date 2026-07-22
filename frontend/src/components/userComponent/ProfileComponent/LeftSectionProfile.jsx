import userImg from "../../../assets/image copy 27.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faHeart,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../path";

const Menu = [
  { id: "Orders",    name: "My Orders",   icon: faReceipt, desc: "Track & reorder" },
  { id: "Favourite", name: "Favourites",  icon: faHeart,   desc: "Saved places & dishes" },
  { id: "Setting",   name: "Settings",    icon: faGear,    desc: "Account preferences" },
];

const LeftSectionProfile = ({ activeMenu, setactiveMenu, userData, loading }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("activeMenu");
    const valid = ["Orders", "Favourite", "Setting"];
    if (saved && valid.includes(saved)) setactiveMenu(saved);
  }, [setactiveMenu]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("activeMenu");
    navigate(PATH.AUTH.LOGIN);
  };

  const handleMenuClick = (id) => {
    setactiveMenu(id);
    localStorage.setItem("activeMenu", id);
  };

  return (
    <aside className="shrink-0 h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #004953 0%, #002d33 100%)" }}
    >
      <div className="px-2 pt-8 pb-6 flex flex-col items-center text-center border-b border-white/10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full ring-[3px] ring-white/30 shadow-2xl overflow-hidden">
            <img
              src={userData?.avatar || userImg}
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>
          <span className="absolute -bottom-1 right-0 bg-amber-400 text-[#004953] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
            PRO
          </span>
        </div>

        <div className="mt-4 w-full">
          {loading ? (
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="h-5 w-32 bg-white/20 rounded-lg" />
              <div className="h-3 w-24 bg-white/10 rounded-lg" />
            </div>
          ) : (
            <>
              <h2 className="text-white font-bold text-lg leading-snug truncate">
                {userData?.fullName || "User"}
              </h2>
              {userData?.email && (
                <p className="text-white/45 text-xs mt-0.5 truncate">{userData.email}</p>
              )}
            </>
          )}
        </div>

        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="text-white/65 text-[11px] font-medium tracking-wide">Active Member</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 flex flex-col gap-1 overflow-y-auto">
        <p className="text-white/25 text-[9px] font-bold uppercase tracking-[0.18em] px-3 mb-3">
          Menu
        </p>

        {Menu.map((item) => {
          const active = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`btn-press group flex items-center gap-3.5 px-3.5 py-3 rounded-2xl w-full text-left transition-all duration-200
                ${active ? "bg-white shadow-xl shadow-black/20" : "hover:bg-white/8"}`}
            >
              {/* Icon box */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                ${active
                  ? "bg-[#004953]"
                  : "bg-white/10 group-hover:bg-white/18"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`text-sm transition-colors duration-200
                    ${active ? "text-white" : "text-white/60 group-hover:text-white/80"}`}
                />
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm leading-none mb-0.5
                  ${active ? "text-[#004953]" : "text-white/80 group-hover:text-white"}`}>
                  {item.name}
                </p>
                <p className={`text-[11px] truncate
                  ${active ? "text-[#004953]" : "text-white/35 group-hover:text-white/50"}`}>
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-6 pt-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="btn-press group flex items-center gap-3.5 px-3.5 py-3 rounded-2xl w-full text-left transition-all duration-200 hover:bg-red-500/15"
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/12 flex items-center justify-center shrink-0 group-hover:bg-red-500/25 transition-colors duration-200">
            <FontAwesomeIcon icon={faRightFromBracket} className="text-sm text-red-400/80 group-hover:text-red-300" />
          </div>
          <span className="font-semibold text-sm text-red-400/80 group-hover:text-red-300 transition-colors duration-200">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default LeftSectionProfile;
