import React from 'react';
import { useInventory } from '../context/InventoryContextProvider';

export const Sidebar: React.FC<{ onOpenMobile?: () => void }> = () => {
  const { currentTab, setCurrentTab } = useInventory();

  const navItems = [
    { id: 'dashboard', label: 'Executive Overview' },
    { id: 'products', label: 'Inventory Ledger' },
    { id: 'orders', label: 'Procurement Pipelines' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-white font-bold text-lg tracking-tight">
          SwiftBuy{' '}
          <span className="text-xs font-normal text-slate-400">HQ</span>
        </h1>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Enterprise Management Suite
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full text-left px-4 py-2.5 cursor-pointer rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        Role: Corporate Administrator
      </div>
    </aside>
  );
};
