import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Warehouse,
  GitPullRequest,
  LogOut,
  Zap,
  Loader2,
} from 'lucide-react';

import { useAuth } from '@/services/auth/hooks/useAuth';
import { ROLE_CONFIG } from './common/role_config';
import { UserRole } from '@/enum/role';

const NAV_ITEMS = [
  { label: 'Executive Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', to: '/products', icon: Boxes },
  { label: 'Stock Management', to: '/stocks', icon: Warehouse, badge: 'LIVE' },
  {
    label: 'Procurement Pipelines',
    to: '/purchase-orders',
    icon: GitPullRequest,
  },
];

export const Sidebar: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Assuming user object contains role; fallback to ADMIN if undefined
  const { logout, user } = useAuth();
  const currentRole: UserRole = user?.role?.name || UserRole.ADMIN;
  const roleStyle: {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  } = ROLE_CONFIG[currentRole];
  const RoleIcon = roleStyle.icon;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-400 select-none">
      {/* Top Section */}
      <div>
        {/* App Logo Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Zap size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide text-white">
                SWIFTBUY
              </span>
              <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-800">
                HQ
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Inventory System</p>
          </div>
        </div>

        {/* System Pulse Status */}
        <div className="mx-3 mt-3 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">System Online</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">99.9%</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        {/* Dynamic User Profile Card */}
        <div
          className={`flex items-center gap-3 rounded-lg border p-2.5 transition-colors ${roleStyle.bg} ${roleStyle.border}`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-md bg-slate-900/80 ${roleStyle.color}`}
          >
            <RoleIcon size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-xs font-semibold text-slate-200">
              {user?.first_name && user?.last_name
                ? `${user?.first_name} ${user?.last_name}`
                : 'Authorized User'}
            </p>
            <p
              className={`truncate text-[10px] font-mono font-medium ${roleStyle.color}`}
            >
              {roleStyle.label}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group relative flex w-full items-center justify-center gap-2.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2.5 text-xs font-semibold text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.05)] transition-all duration-200 hover:border-red-500/60 hover:bg-red-900/40 hover:text-red-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 size={16} className="animate-spin text-red-400" />
          ) : (
            <LogOut
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5 text-red-400 group-hover:text-red-200"
            />
          )}
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </button>
      </div>
    </aside>
  );
};
