import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBell,
  faShield,
  faTriangleExclamation,
  faSliders,
  faChevronDown,
  faChevronUp,
  faFloppyDisk,
  faKey,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { updateProfile } from "../../../service/profileService";

// reusable toggle switch
const Toggle = ({ on, onClick }) => (
  <button
    onClick={onClick}
    className={`btn-press relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${
      on ? "bg-[#004953]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
        on ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

const Setting = ({ userData }) => {
  const [open, setOpen] = useState([]);

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({});
  const [preferenceSettings, setPreferenceSettings] = useState({});

  const sections = [
    { name: "My Profile", icon: faUser, dsc: "Your personal information" },
    { name: "Notifications", icon: faBell, dsc: "Choose what we notify you about" },
    { name: "Preferences", icon: faSliders, dsc: "Customize your experience" },
    { name: "Security", icon: faShield, dsc: "Password and account safety" },
    { name: "Danger Zone", icon: faTriangleExclamation, dsc: "Irreversible actions" },
  ];

  const notifications = [
    { key: "orderUpdates", title: "Order Updates", dsc: "Real-time updates" },
    { key: "promotions", title: "Promotions", dsc: "Deals & discounts" },
    { key: "newRestaurants", title: "New Restaurants", dsc: "New openings" },
    { key: "reviewReminders", title: "Review Reminders", dsc: "Rate orders" },
    { key: "appAnnouncements", title: "App Announcements", dsc: "Updates" },
  ];

  const preferences = [
    { key: "darkMode", title: "Dark Mode", dsc: "Enable dark theme" },
    { key: "privateOrderHistory", title: "Private Order History", dsc: "Hide orders" },
  ];
  useEffect(() => {
    if (!userData) return;

    setProfile({
      fullName: userData.fullName || "",
      phone: userData.phone || "",
      email: userData.email || "",
    });

    setNotificationSettings(userData.notifications || {});
    setPreferenceSettings(userData.preferences || {});
  }, [userData]);

  const toggleSection = (name) => {
    setOpen((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const toggleNotification = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePreference = (key) => {
    setPreferenceSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        ...profile,
        notifications: notificationSettings,
        preferences: preferenceSettings,
      });

      alert("Settings updated!");
    } catch (err) {
      console.log(err);
    }
  };

  const SaveButton = () => (
    <button
      onClick={handleSave}
      className="btn-press mt-4 inline-flex items-center gap-2 bg-[#004953] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-black transition"
    >
      <FontAwesomeIcon icon={faFloppyDisk} />
      Save Changes
    </button>
  );

  return (
    <div>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#004953]">Account Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((s) => {
          const isOpen = open.includes(s.name);
          const danger = s.name === "Danger Zone";

          return (
            <div
              key={s.name}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition ${
                danger ? "border-red-100" : "border-gray-100"
              }`}
            >
              {/* HEADER */}
              <button
                onClick={() => toggleSection(s.name)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      danger
                        ? "bg-red-50 text-red-500"
                        : "bg-emerald-50 text-[#004953]"
                    }`}
                  >
                    <FontAwesomeIcon icon={s.icon} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`font-semibold ${
                        danger ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      {s.name}
                    </h3>
                    <p className="text-sm text-gray-400">{s.dsc}</p>
                  </div>
                </div>

                <FontAwesomeIcon
                  icon={isOpen ? faChevronUp : faChevronDown}
                  className="text-gray-400"
                />
              </button>

              {/* BODY */}
              {isOpen && (
                <div className="animate-slide-down px-5 pb-6 pt-1 border-t border-gray-100">

                  {/* PROFILE */}
                  {s.name === "My Profile" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Full Name
                        </label>
                        <input
                          className="mt-1.5 w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#004953]"
                          value={profile.fullName}
                          placeholder="Your full name"
                          onChange={(e) =>
                            setProfile({ ...profile, fullName: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Phone Number
                        </label>
                        <input
                          className="mt-1.5 w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#004953]"
                          value={profile.phone}
                          placeholder="012345678"
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Email
                        </label>
                        <input
                          className="mt-1.5 w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#004953]"
                          value={profile.email}
                          placeholder="you@example.com"
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                        />
                      </div>

                      <SaveButton />
                    </div>
                  )}

                  {/* NOTIFICATIONS */}
                  {s.name === "Notifications" && (
                    <div className="mt-4">
                      <div className="divide-y divide-gray-100">
                        {notifications.map((n) => (
                          <div
                            key={n.key}
                            className="flex items-center justify-between py-3"
                          >
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {n.title}
                              </h4>
                              <p className="text-sm text-gray-400">{n.dsc}</p>
                            </div>
                            <Toggle
                              on={!!notificationSettings[n.key]}
                              onClick={() => toggleNotification(n.key)}
                            />
                          </div>
                        ))}
                      </div>
                      <SaveButton />
                    </div>
                  )}

                  {/* PREFERENCES */}
                  {s.name === "Preferences" && (
                    <div className="mt-4">
                      <div className="divide-y divide-gray-100">
                        {preferences.map((p) => (
                          <div
                            key={p.key}
                            className="flex items-center justify-between py-3"
                          >
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {p.title}
                              </h4>
                              <p className="text-sm text-gray-400">{p.dsc}</p>
                            </div>
                            <Toggle
                              on={!!preferenceSettings[p.key]}
                              onClick={() => togglePreference(p.key)}
                            />
                          </div>
                        ))}
                      </div>
                      <SaveButton />
                    </div>
                  )}

                  {/* SECURITY */}
                  {s.name === "Security" && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Keep your account secure by updating your password
                        regularly.
                      </p>
                      <button className="btn-press inline-flex items-center gap-2 bg-[#004953] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-black transition">
                        <FontAwesomeIcon icon={faKey} />
                        Change Password
                      </button>
                    </div>
                  )}
                  {s.name === "Danger Zone" && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4">
                      <p className="text-sm text-red-600 mb-3">
                        Deleting your account is permanent and cannot be undone.
                      </p>
                      <button className="btn-press inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition">
                        <FontAwesomeIcon icon={faTrashCan} />
                        Delete Account
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Setting;