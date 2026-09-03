import {
  LayoutDashboard,
  Boxes,
  Warehouse,
  GitPullRequest,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Executive Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', to: '/products', icon: Boxes },
  { label: 'Stock Management', to: '/stocks', icon: Warehouse, badge: 'LIVE' },
  {
    label: 'Procurement Pipelines',
    to: '/purchase-orders',
    icon: GitPullRequest,
  },
];
