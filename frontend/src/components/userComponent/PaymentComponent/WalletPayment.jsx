import {
  faWallet,
  faCircleCheck,
  faChevronRight,
  faBuildingColumns,
  faMobileScreen
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
const wallets = [
  {
    id: "aba",
    name: "ABA Bank",
    subtitle: "Pay securely with ABA Mobile",
    icon: faBuildingColumns,
  },
  {
    id: "acleda",
    name: "ACLEDA",
    subtitle: "Quick and secure payment",
    icon: faWallet,
  },
  {
    id: "wing",
    name: "Wing Money",
    subtitle: "Mobile wallet payment",
    icon: faMobileScreen,
  },
];

const WalletPayment = () => {
  const [selectedWallet, setSelectedWallet] = useState("aba");
  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xl">
      {/* Header */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#004953]">
          <FontAwesomeIcon
            icon={faWallet}
            className="text-3xl text-[#004953]"
          />
        </div>
      </div>

      <div className="mt-5 text-center">
        <h2 className="text-2xl font-bold text-[#004953]">
          Digital Wallet
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Choose your preferred wallet provider
        </p>
      </div>
      <div className="mt-6 rounded-xl border border-[#004953] bg-[#004953] p-5 text-center">
        <p className="text-sm text-[#004953]">
          Total Payment
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#004953]">
          $35.30
        </h1>
      </div>
      <div className="mt-6 space-y-3">
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() =>
              setSelectedWallet(wallet.id)
            }
            className={`btn-press flex w-full items-center justify-between rounded-xl border p-4 transition-all
              ${
                selectedWallet === wallet.id
                  ? "border-[#004953] bg-[#004953]"
                  : "border-gray-200 hover:border-[#004953]"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#004953]">
                    <FontAwesomeIcon icon={wallet.icon} className="text-xl text-[#004953]"/>
                </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">{wallet.name}</h3>
                <p className="text-sm text-gray-500">
                  {wallet.subtitle}
                </p>
              </div>
            </div>

            {selectedWallet === wallet.id ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#004953] text-white">
                <FontAwesomeIcon icon={faCircleCheck} className="text-sm" />
              </div>
            ) : (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-gray-400"
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-[#004953] bg-[#004953] p-4">
        <div className="flex items-center gap-2 text-[#004953]">
          <FontAwesomeIcon icon={faCircleCheck} />
          <span className="font-medium">
            Secure Payment
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600"> You will be redirected to the selected wallet provider to complete your payment securely. </p>
      </div>
      <button
        className="btn-press mt-6 w-full rounded-xl bg-[#004953] py-3 font-semibold text-white transition hover:bg-[#003640]">Continue with{" "}
        {
          wallets.find(
            (w) => w.id === selectedWallet
          )?.name
        }
      </button>
    </div>
  );
};

export default WalletPayment;