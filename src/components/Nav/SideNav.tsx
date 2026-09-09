import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, LogOut, Zap } from 'lucide-react';

import { useAuth } from '@/services/auth/hooks/useAuth';
import { UserRole } from '@/enum/role';

import { ROLE_CONFIG } from '../common/role_config';
import { NAV_SECTIONS, type NavItem } from './NavItems';
import type { ViewPermission } from '@/enum/view_permission.enum';

export const SideNav: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  /**
   * ---------------------------------------------------------
   * Current Role
   * ---------------------------------------------------------
   */
  const currentRole = user?.role?.name ?? UserRole.CASHIER;

  /**
   * ---------------------------------------------------------
   * Super Admin
   * ---------------------------------------------------------
   *
   * Super Admin has access to every navigation item.
   *
   * NOTE:
   * This only controls frontend visibility.
   * Backend authorization must still enforce permissions.
   */
  const isSuperAdmin = currentRole === UserRole.SUPER_ADMIN;

  /**
   * ---------------------------------------------------------
   * User Permissions
   * ---------------------------------------------------------
   *
   * The backend should expose permissions directly
   * through the role:
   *
   * user.role.rolePermissions.map(rp => rp.permission.name)
   *
   * Example:
   *
   * [
   *   'products.view',
   *   'products.create',
   *   'stock.view'
   * ]
   */
  const userPermissions = useMemo(
    () =>
      new Set(
        user?.role?.rolePermissions?.map(
          (role_permission) => role_permission.permission.name,
        ) ?? [],
      ),
    [user?.role?.rolePermissions],
  );

  /**
   * ---------------------------------------------------------
   * Permission Check
   * ---------------------------------------------------------
   */
  const hasViewPermission = (permission: ViewPermission): boolean => {
    if (isSuperAdmin) {
      return true;
    }

    return userPermissions.has(permission);
  };

  /**
   * ---------------------------------------------------------
   * Navigation Access
   * ---------------------------------------------------------
   */
  const canAccessNavItem = (item: NavItem): boolean => {
    /**
     * Navigation items without permissions
     * are available to authenticated users.
     */
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }

    /**
     * ANY permission mode.
     */
    if (item.permissionMode === 'any') {
      return item.permissions.some(hasViewPermission);
    }

    /**
     * ALL permission mode.
     *
     * This is the default.
     */
    return item.permissions.every(hasViewPermission);
  };

  /**
   * ---------------------------------------------------------
   * Visible Navigation
   * ---------------------------------------------------------
   *
   * Filter the individual items first,
   * then remove sections that have no visible items.
   */
  const visibleSections = useMemo(
    () =>
      NAV_SECTIONS.map((section) => ({
        ...section,

        items: section.items.filter(canAccessNavItem),
      })).filter((section) => section.items.length > 0),
    [userPermissions, isSuperAdmin],
  );

  /**
   * ---------------------------------------------------------
   * Role Configuration
   * ---------------------------------------------------------
   */
  const roleStyle = ROLE_CONFIG[currentRole] ?? {
    label: 'Admin',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/20',
    border: 'border-cyan-500/30',
  };

  const RoleIcon = roleStyle.icon;

  /**
   * ---------------------------------------------------------
   * User Display
   * ---------------------------------------------------------
   */
  const displayName = user?.first_name || 'Account';

  /**
   * ---------------------------------------------------------
   * Logout
   * ---------------------------------------------------------
   */
  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();

      navigate('/login', {
        replace: true,
      });
    } catch (error) {
      console.error('Logout failed:', error);

      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      aria-label="Main Navigation"
      className="
        flex h-full w-64 shrink-0
        select-none flex-col
        justify-between
        border-r border-slate-800
        bg-slate-950
        text-slate-400
      "
    >
      {/* =====================================================
          TOP SECTION
      ====================================================== */}

      <div
        className="
        min-h-0
        overflow-y-auto
      "
      >
        {/* ---------------------------------------------------
            APP LOGO
        ---------------------------------------------------- */}

        <div
          className="
          flex items-center gap-3
          border-b border-slate-800
          p-1
        "
        >
          <div
            className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            bg-cyan-500/10
            text-cyan-400
          "
          >
            <Zap size={20} />
          </div>

          <div>
            <span
              className="
              font-bold
              tracking-wide
              text-white
            "
            >
              SWIFTBUY
            </span>

            <p
              className="
              text-[11px]
              text-slate-500
            "
            >
              Inventory
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------
            NAVIGATION
        ---------------------------------------------------- */}

        <nav aria-label="Sidebar" className="space-y-5 p-3">
          {visibleSections.map((section) => (
            <div key={section.label}>
              {/* Section heading */}

              <div className="mb-2 px-3">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  {section.label}
                </p>
              </div>

              {/* Navigation items */}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          'flex items-center',
                          'justify-between',
                          'rounded-lg',
                          'px-3 py-2.5',
                          'text-sm font-medium',
                          'transition-all',
                          'focus:outline-none',
                          'focus:ring-2',
                          'focus:ring-cyan-500',

                          isActive
                            ? [
                                'border',
                                'border-cyan-500/30',
                                'bg-cyan-950/50',
                                'text-cyan-400',
                              ].join(' ')
                            : [
                                'text-slate-400',
                                'hover:bg-slate-900',
                                'hover:text-slate-200',
                              ].join(' '),
                        ].join(' ')
                      }
                    >
                      <div
                        className="
                            flex items-center gap-3
                          "
                      >
                        <Icon size={18} />

                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className="
                              rounded-full
                              border
                              border-cyan-500/20
                              bg-cyan-500/10
                              px-2 py-0.5
                              text-[10px]
                              font-bold
                              text-cyan-400
                            "
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* =====================================================
          BOTTOM SECTION
      ====================================================== */}

      <div
        className="
        space-y-2
        border-t
        border-slate-800
        p-3
      "
      >
        {/* ---------------------------------------------------
            PROFILE
        ---------------------------------------------------- */}

        <NavLink
          to="/settings/profile"
          aria-label="View user profile"
          className={({ isActive }) =>
            [
              'group flex items-center',
              'justify-between',
              'rounded-lg border',
              'p-2.5',
              'transition-all',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-cyan-500',

              isActive
                ? ['border-cyan-500/50', 'bg-cyan-950/40', 'text-white'].join(
                    ' ',
                  )
                : [
                    'border-slate-800',
                    'bg-slate-900/40',
                    'text-slate-300',
                    'hover:border-slate-700',
                    'hover:bg-slate-900',
                  ].join(' '),
            ].join(' ')
          }
        >
          <div
            className="
            flex items-center
            gap-3
            overflow-hidden
          "
          >
            {/* Role icon */}

            <div
              className="
              flex h-8 w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              border-slate-800
              bg-slate-900
              text-cyan-400
            "
            >
              <RoleIcon size={16} />
            </div>

            {/* User details */}

            <div className="overflow-hidden">
              <p
                className="
                truncate
                text-xs
                font-semibold
                text-slate-200
                group-hover:text-white
              "
              >
                {displayName}
              </p>

              <p
                className="
                truncate
                text-[10px]
                text-slate-500
              "
              >
                {roleStyle.label}
              </p>
            </div>
          </div>

          <ChevronRight
            size={16}
            className="
              shrink-0
              text-slate-600
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-cyan-400
            "
          />
        </NavLink>

        {/* ---------------------------------------------------
            SIGN OUT
        ---------------------------------------------------- */}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            flex w-full
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-red-500/20
            bg-red-950/10
            px-3 py-2
            text-xs
            font-medium
            text-red-400
            transition-colors
            hover:bg-red-900/30
            hover:text-red-200
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
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
