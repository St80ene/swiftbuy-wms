// pages/UsersPage.tsx
import { useState, useMemo } from 'react';
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Mail,
  Shield,
  Store,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { IUser } from '@/interfaces/user.interface';
import DataTable from '../common/DataTable';

export const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<IUser[]>([
    {
      id: 'usr_1',
      first_name: 'Alex',
      last_name: 'Morgan',
      company_email: 'alex.morgan@company.com',
      phone_number: '+1 (555) 019-2834',
      profile_picture: null,
      role_id: 'role_admin',
      role: { id: 'role_admin', name: 'Store Manager' },
      business_id: 'biz_123',
      business: { id: 'biz_123', name: 'Acme Retail Group' },
      store_id: 'str_1',
      store: { id: 'str_1', name: 'Downtown Outlet' },
      is_active: true,
      created_at: new Date('2023-09-12'),
      updated_at: new Date('2024-02-01'),
    },
    {
      id: 'usr_2',
      first_name: 'David',
      last_name: 'Chen',
      company_email: 'david.chen@company.com',
      profile_picture: null,
      role_id: 'role_clerk',
      role: { id: 'role_clerk', name: 'Inventory Associate' },
      business_id: 'biz_123',
      business: { id: 'biz_123', name: 'Acme Retail Group' },
      store_id: 'str_2',
      store: { id: 'str_2', name: 'Ikeja Logistics Hub' },
      is_active: false,
      created_at: new Date('2023-11-05'),
      updated_at: new Date('2024-01-10'),
    },
  ]);

  const columns = useMemo(
    () => [
      {
        key: 'user',
        header: 'User / Employee',
        width: '30%',
        render: (user: IUser) => (
          <div className="flex items-center gap-3">
            {user.profile_picture?.url ? (
              <img
                src={user.profile_picture.url}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-semibold text-xs shrink-0">
                {user.first_name[0]}
                {user.last_name[0]}
              </div>
            )}
            <div>
              <div className="font-semibold text-slate-800 line-clamp-1">
                {user.first_name} {user.last_name}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Mail className="w-3 h-3" />
                <span>{user.company_email}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        width: '20%',
        render: (user: IUser) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>{user.role?.name || user.role_id}</span>
          </div>
        ),
      },
      {
        key: 'assigned_store',
        header: 'Assigned Store',
        width: '20%',
        render: (user: IUser) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Store className="w-3.5 h-3.5 text-slate-400" />
            <span>{user.store?.name || 'All Locations'}</span>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        width: '15%',
        render: (user: IUser) => (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              user.is_active
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {user.is_active ? 'Active' : 'Disabled'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        width: '15%',
        cellClassName: 'text-right',
        render: (user: IUser) => (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={`Edit ${user.first_name}`}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label={`Disable ${user.first_name}`}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Control access permissions and store assignments.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      <DataTable<IUser>
        records={users}
        columns={columns}
        getRowKey={(record) => record.id}
        emptyState={{
          icon: <UsersIcon className="w-7 h-7" />,
          title: 'No staff users found',
          description:
            'Invite users to give team members access to stores and inventory.',
        }}
        header={
          <div className="p-4 border-b border-slate-200/60 bg-white flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
