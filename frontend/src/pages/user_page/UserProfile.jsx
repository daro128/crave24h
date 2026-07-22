import { useEffect, useState } from "react";
import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import LeftSectionProfile from "../../components/userComponent/ProfileComponent/LeftSectionProfile";
import Orders from "../../components/userComponent/ProfileComponent/Orders";
import Favaurite from "../../components/userComponent/ProfileComponent/Favaurite";
import Setting from "../../components/userComponent/ProfileComponent/Setting";
import { getProfile } from "../../service/profileService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faHeart, faGear } from "@fortawesome/free-solid-svg-icons";

const SECTION_META = {
  Orders:    { label: "My Orders",  icon: faReceipt, color: "text-[#004953]" },
  Favourite: { label: "Favourites", icon: faHeart,   color: "text-rose-500"  },
  Setting:   { label: "Settings",   icon: faGear,    color: "text-gray-500"  },
};

const UserProfile = () => {
  const [activeMenu, setactiveMenu] = useState("Orders");
  const [loadingUser, setLoadingUser] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile();
        const user = res?.User;
        if (!user) return;
        setUserData({
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const renderMenus = () => {
    switch (activeMenu) {
      case "Orders":
        return <Orders setactiveMenu={setactiveMenu} loading={loadingUser} />;
      case "Favourite":
        return <Favaurite />;
      case "Setting":   
        return <Setting userData={userData} />;
      default:          
        return <Orders setactiveMenu={setactiveMenu} loading={loadingUser} />;
    }
  };
  const meta = SECTION_META[activeMenu] || SECTION_META.Orders;

  return (
    <div className="lg:h-screen flex flex-col bg-[#eef2f2]">
      <Navbar />
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        {/* Sidebar */}
        <div className="lg:flex-1 rounded-2xl">
            <LeftSectionProfile
            activeMenu={activeMenu}
            setactiveMenu={setactiveMenu}
            userData={userData}
            loading={loadingUser}
          />
        </div>
        <div className="lg:flex-[3] lg:overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#eef2f2] backdrop-blur-sm border-b border-black/5 px-4 sm:px-10 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <FontAwesomeIcon icon={meta.icon} className={`text-sm ${meta.color}`} />
            </div>
            <div>
              <h1 className="text-[#004953] font-bold text-lg leading-none">{meta.label}</h1>
              <p className="text-gray-400 text-xs mt-0.5">
                {userData?.fullName ? `${userData.fullName}'s account` : "Your account"}
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-10 py-8">
            {renderMenus()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
