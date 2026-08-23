import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      label: 'Executive Overview',
      to: '/dashboard',
      isActive: location.pathname === '/dashboard',
    },
    {
      label: 'Products',
      to: '/products',
      isActive: location.pathname.startsWith('/products'),
    },
    {
      label: 'Stock Management',
      to: '/stocks',
      isActive: location.pathname.startsWith('/stocks'),
    },
    {
      label: 'Procurement Pipelines',
      to: '/purchase-orders',
      isActive: location.pathname.startsWith('/purchase-orders'),
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col h-full border-r border-slate-800 shrink-0">
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
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              item.isActive
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        Role: Corporate Administrator
      </div>
    </aside>
  );
};
