import {
  Bell,
  Megaphone,
  Moon,
  MapPinned,
} from "lucide-react";
import Reveal from "../common/Reveal";

export default function PreferencesCard() {
  const settings = [
    {
      icon: <Bell size={20} />,
      title: "New Order Alerts",
      description: "Receive incoming delivery requests instantly",
      enabled: true,
    },
    {
      icon: <MapPinned size={20} />,
      title: "Live Location Sharing",
      description: "Share location while on delivery",
      enabled: true,
    },
    {
      icon: <Megaphone size={20} />,
      title: "Marketing Communications",
      description: "Receive promotions and platform updates",
      enabled: false,
    },
    {
      icon: <Moon size={20} />,
      title: "Quiet Hours",
      description: "Mute non-urgent notifications overnight",
      enabled: false,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 mt-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#004953]">
          Preferences
        </h3>

        <p className="text-sm text-gray-500">
          Manage notifications and account settings
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting, index) => (
          <Reveal key={setting.title} delay={Math.min(index, 6) * 80}>
            <div
              className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#004953] flex items-center justify-center text-[#004953] shrink-0">
                  {setting.icon}
                </div>

                <div>
                  <h4 className="font-medium">
                    {setting.title}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {setting.description}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex cursor-pointer btn-press">
                <input
                  type="checkbox"
                  defaultChecked={setting.enabled}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#004953] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}