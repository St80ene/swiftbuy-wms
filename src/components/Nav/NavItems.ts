import type { LucideIcon } from 'lucide-react';
import { ViewPermission } from '@/enum/view_permission.enum';
import {
  ArrowLeftRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  UserCircle,
  Users,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;

  /**
   * Optional badge displayed beside the navigation label.
   */
  badge?: string | number;

  /**
   * Permissions required to access this navigation item.
   *
   * By default, all listed permissions are required.
   */
  permissions?: ViewPermission[];

  /**
   * Determines how multiple permissions are evaluated.
   *
   * all:
   * User must have every permission.
   *
   * any:
   * User must have at least one permission.
   *
   * Defaults to "all".
   */
  permissionMode?: 'all' | 'any';
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  /**
   * =========================================================
   * OVERVIEW
   * =========================================================
   */
  {
    label: 'Overview',

    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        permissions: [ViewPermission.DASHBOARD_VIEW],
      },
    ],
  },

  /**
   * =========================================================
   * INVENTORY
   * =========================================================
   */
  {
    label: 'Inventory',

    items: [
      {
        to: '/products',
        label: 'Products',
        icon: Package,
        permissions: [ViewPermission.PRODUCTS_VIEW],
      },

      {
        to: '/categories',
        label: 'Categories',
        icon: Tags,
        permissions: [ViewPermission.CATEGORIES_VIEW],
      },

      {
        to: '/stock-movements',
        label: 'Stock Movements',
        icon: ArrowLeftRight,
        permissions: [ViewPermission.STOCK_MOVEMENTS_VIEW],
      },
    ],
  },

  /**
   * =========================================================
   * PROCUREMENT
   * =========================================================
   */
  {
    label: 'Procurement',

    items: [
      {
        to: '/purchase-orders',
        label: 'Purchase Orders',
        icon: ShoppingCart,
        permissions: [ViewPermission.PURCHASE_ORDERS_VIEW],
      },

      {
        to: '/suppliers',
        label: 'Suppliers',
        icon: Truck,
        permissions: [ViewPermission.SUPPLIERS_VIEW],
      },
    ],
  },

  /**
   * =========================================================
   * ADMINISTRATION
   * =========================================================
   */
  {
    label: 'Administration',

    items: [
      {
        to: '/users',
        label: 'Users',
        icon: Users,
        permissions: [ViewPermission.USERS_VIEW],
      },
    ],
  },

  /**
   * =========================================================
   * SETTINGS
   * =========================================================
   */
  {
    label: 'Settings',

    items: [
      {
        to: '/settings/business',
        label: 'Business Settings',
        icon: Settings,
        permissions: [ViewPermission.BUSINESS_VIEW],
      },

      {
        to: '/settings/profile',
        label: 'Profile',
        icon: UserCircle,
        permissions: [ViewPermission.PROFILE_VIEW],
      },
    ],
  },
];
