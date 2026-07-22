import {
  faPlus,
  faCreditCard,
  faWallet,
  faMoneyBill,
  faTrash,
  faLinkSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Payment = () => {
  const cards = [
    {
      id: 1,
      type: "PLATINUM MEMBER",
      number: "4521",
      holder: "DARO SOTHEARY",
      expire: "12/26",
      default: true,
      bg: "from-teal-700 to-teal-900",
    },
    {
      id: 2,
      type: "TRAVEL REWARDS",
      number: "8892",
      holder: "DARO SOTHEARY",
      expire: "05/25",
      default: false,
      bg: "from-slate-800 to-slate-900",
    },
  ];

  const wallets = [
    {
      name: "ABA Pay",
      status: "Connected",
      connected: true,
      logo: "ABA",
      color: "bg-blue-700",
    },
    {
      name: "Wing Money",
      status: "Not linked",
      connected: false,
      logo: "Wing",
      color: "bg-lime-500",
    },
    {
      name: "Pi Pay",
      status: "Not linked",
      connected: false,
      logo: "Pi",
      color: "bg-pink-600",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Payment Methods
          </h1>
          <p className="text-slate-500">
            Manage your saved cards and wallets for faster checkout.
          </p>
        </div>

        <button className="btn-press bg-teal-700 text-white px-5 py-3 rounded-full flex items-center gap-2 hover:bg-teal-800 transition-all self-start">
          <FontAwesomeIcon icon={faPlus} />
          Add new card
        </button>
      </div>

      {/* Credit Cards */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <FontAwesomeIcon
            icon={faCreditCard}
            className="text-teal-700"
          />
          <h2 className="text-2xl font-semibold">
            Credit / Debit Cards
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id}>
              <div
                className={`h-44 rounded-2xl p-5 text-white shadow-xl bg-gradient-to-br ${card.bg}`}
              >
                <div className="flex justify-between">
                  <span className="text-xs tracking-widest">
                    {card.type}
                  </span>

                  {card.default && (
                    <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full">
                      DEFAULT
                    </span>
                  )}
                </div>

                <div className="mt-10 text-3xl tracking-[6px]">
                  •••• •••• •••• {card.number}
                </div>

                <div className="flex justify-between mt-8">
                  <div>
                    <p className="text-xs opacity-70">
                      CARD HOLDER
                    </p>
                    <p>{card.holder}</p>
                  </div>

                  <div>
                    <p className="text-xs opacity-70">
                      EXPIRES
                    </p>
                    <p>{card.expire}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-5 mt-3 text-sm">
                <button className="btn-press text-teal-700">
                  {card.default
                    ? "Default Method"
                    : "Set as default"}
                </button>

                <button className="btn-press text-red-500 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTrash} />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add Card */}
          <button className="btn-press h-44 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-teal-600 transition-all">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-slate-500"
              />
            </div>

            <span className="text-slate-500">
              Add New Card
            </span>
          </button>
        </div>
      </div>

      {/* Wallet */}
      <div className="mt-14">
        <div className="flex items-center gap-3 mb-5">
          <FontAwesomeIcon
            icon={faWallet}
            className="text-teal-700"
          />
          <h2 className="text-2xl font-semibold">
            Digital Wallets
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {wallets.map((wallet) => (
            <div
              key={wallet.name}
              className="card-hover bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center"
            >
              <div className="flex gap-4">
                <div
                  className={`w-12 h-12 rounded-lg ${wallet.color} text-white flex items-center justify-center font-bold`}
                >
                  {wallet.logo}
                </div>

                <div>
                  <h3 className="font-medium">
                    {wallet.name}
                  </h3>

                  <p
                    className={`text-sm ${
                      wallet.connected
                        ? "text-teal-700"
                        : "text-slate-500"
                    }`}
                  >
                    {wallet.status}
                  </p>
                </div>
              </div>

              {wallet.connected ? (
                <FontAwesomeIcon
                  icon={faLinkSlash}
                  className="text-slate-500"
                />
              ) : (
                <button className="btn-press bg-slate-100 px-5 py-2 rounded-full text-sm font-medium">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pay On Arrival */}
      <div className="mt-14">
        <div className="flex items-center gap-3 mb-5">
          <FontAwesomeIcon
            icon={faMoneyBill}
            className="text-teal-700"
          />
          <h2 className="text-2xl font-semibold">
            Pay on Arrival
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="text-teal-700"
              />
            </div>

            <div>
              <h3 className="font-medium">
                Cash on delivery
              </h3>

              <p className="text-slate-500 text-sm">
                Pay with cash when your food is delivered
              </p>
            </div>
          </div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            Always available
          </span>
        </div>
      </div>
    </div>
  );
};

export default Payment;