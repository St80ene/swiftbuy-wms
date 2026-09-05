import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Zap, Loader2, ChevronRight, Settings } from 'lucide-react';

import { useAuth } from '@/services/auth/hooks/useAuth';
import { ROLE_CONFIG } from '../common/role_config';
import { UserRole } from '@/enum/role';
import { NAV_ITEMS } from './NavItems';

export const SideNav: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const { logout, user } = useAuth();
  const currentRole: UserRole = user?.role?.name || UserRole.ADMIN;

  // Check if user has administrative privileges
  const isAdminOrSuperAdmin =
    currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN;

  const roleStyle = ROLE_CONFIG[currentRole] || {
    label: 'Admin',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/20',
    border: 'border-cyan-500/30',
  };
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

  const displayName = user?.first_name ? user.first_name : 'Account';

  return (
    <aside
      aria-label="Main Navigation"
      className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-400 select-none"
    >
      {/* Top Section */}
      <div>
        {/* App Logo */}
        <div className="flex items-center gap-3 border-b border-slate-800 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Zap size={20} />
          </div>
          <div>
            <span className="font-bold tracking-wide text-white">SWIFTBUY</span>
            <p className="text-[11px] text-slate-500">Inventory</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-3" aria-label="Sidebar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isActive
                      ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30'
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
        {/* CONDITIONAL ADMIN/SUPER-ADMIN SETTINGS NAV */}
        {isAdminOrSuperAdmin && (
          <NavLink
            to="/settings/business"
            aria-label="Business Settings"
            className={({ isActive }) =>
              `flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Settings size={16} />
              <span>Business Settings</span>
            </div>
          </NavLink>
        )}

        {/* PROFILE LINK */}
        <NavLink
          to="/settings/profile"
          aria-label="View user profile"
          className={({ isActive }) =>
            `group flex items-center justify-between rounded-lg border p-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              isActive
                ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
            }`
          }
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-cyan-400 border border-slate-800">
              <RoleIcon size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-slate-200 group-hover:text-white">
                {displayName}
              </p>
              <p className="truncate text-[10px] text-slate-500">
                View Profile
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-400 shrink-0"
          />
        </NavLink>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-950/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-200 cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <LogOut size={14} />
          )}
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </button>
      </div>
    </aside>
  );
};
