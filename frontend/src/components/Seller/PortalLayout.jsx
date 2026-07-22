import { useState } from "react";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";

const PortalLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 flex w-full">
      <PortalSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
