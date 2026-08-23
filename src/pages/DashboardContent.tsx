import React from 'react';
import { useInventory } from '../context/InventoryContextProvider';
import { Orders } from '../components/Orders';
import { Dashboard } from '../components/Dashboard';
import { Products } from '../components/Products';

type TabId = 'dashboard' | 'products' | 'orders';

interface NavigationItem {
  id: TabId;
  label: string;
  component: React.ComponentType;
}

export default function DashboardContent() {
  const { currentTab, setCurrentTab } = useInventory();

  // 1. Centralized route blueprint
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Executive Summary', component: Dashboard },
    { id: 'products', label: 'Products Master', component: Products },
    { id: 'orders', label: 'Procurement Pipelines', component: Orders },
  ];

  // 2. Locate the active configuration configuration layout matching your tab state
  const activeTabConfig = navigationItems.find(
    (item) => item.id === currentTab,
  );

  // 3. Extract the component assignment using an uppercase alias name so React parses it as a JSX element
  const ActiveComponent = activeTabConfig?.component || Dashboard;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-400 p-6 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-8">
          <div className="p-2 border-b border-slate-800">
            <h1 className="text-white font-bold text-lg tracking-tight">
              SwiftHQ{' '}
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.1">
              Enterprise Management Suite
            </p>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Dynamic Single-Line Component Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <ActiveComponent />
      </main>
    </div>
  );
}
