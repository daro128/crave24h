import React from 'react';

const OperationsForm = ({ options, onToggle }) => {
  const toggles = [
    { id: 'acceptingOrders', title: 'Open Storefront', label: 'Allow incoming customer placement streams instantly.' },
    { id: 'autoAccept', title: 'Instant Auto-Acceptance', label: 'Pass incoming orders straight to the kitchen track without a manual review.' },
    { id: 'soundAlerts', title: 'Acoustic Terminal Pings', label: 'Play an audio loop on the dashboard when new tickets arrive.' }
  ];

  return (
    <div className="divide-y divide-gray-100">
      {toggles.map((item, index) => (
        <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 ${index === 0 ? 'pb-4' : 'py-4 last:pb-0'}`}>
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-gray-800">{item.title}</h5>
            <p className="text-xs text-gray-400">{item.label}</p>
          </div>

          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className={`btn-press w-10 h-5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
              options[item.id] ? 'bg-[#004D40]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
              options[item.id] ? 'left-6' : 'left-0.5'
            }`} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default OperationsForm;