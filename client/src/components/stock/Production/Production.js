import React, { useState } from 'react';
import ProductionOutcome from './ProductionOutcome';
import PreformProduction from './PreformProduction';
import CapProduction from './CapProduction';
import BottleProduction from './BottleProduction';
import DirectUsage from './DirectUsage';

export default function Production() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: 'Production Outcome', component: ProductionOutcome },
    { id: 1, label: 'Preform Production', component: PreformProduction },
    { id: 2, label: 'Cap Production', component: CapProduction },
    { id: 3, label: 'Bottle Production', component: BottleProduction },
    { id: 4, label: 'Direct Usage', component: DirectUsage },
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Production Management</h2>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white border-b-4 border-blue-800'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
