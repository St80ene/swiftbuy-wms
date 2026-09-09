// pages/StoresPage.tsx
import { useState, useMemo } from 'react';
import {
  Store as StoreIcon,
  Plus,
  Search,
  MapPin,
  Phone,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { IStore } from '@/interfaces/store.interface';
import DataTable from '../common/DataTable';

export const StoresPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stores, setStores] = useState<IStore[]>([
    {
      id: 'str_1',
      business_id: 'biz_123',
      name: 'Main Downtown Outlet',
      code: 'STORE-001',
      address: '102 Commercial Avenue',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      phone_number: '+234 801 234 5678',
      created_at: new Date('2023-11-01'),
      updated_at: new Date('2024-01-20'),
    },
    {
      id: 'str_2',
      business_id: 'biz_123',
      name: 'Ikeja Logistics Hub',
      code: 'STORE-002',
      address: '45 Industrial Estate Road',
      city: 'Ikeja',
      state: 'Lagos',
      country: 'Nigeria',
      phone_number: '+234 809 876 5432',
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-02-10'),
    },
  ]);

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Store / Outlet',
        width: '30%',
        render: (store: IStore) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <StoreIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 line-clamp-1">
                {store.name}
              </div>
              <span className="text-xs font-mono text-slate-400">
                {store.code}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'location',
        header: 'Location',
        width: '35%',
        render: (store: IStore) => (
          <div className="flex items-start gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {[store.address, store.city, store.state, store.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        ),
      },
      {
        key: 'phone_number',
        header: 'Contact',
        width: '20%',
        render: (store: IStore) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{store.phone_number || 'N/A'}</span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        width: '15%',
        cellClassName: 'text-right',
        render: (store: IStore) => (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={`Edit ${store.name}`}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${store.name}`}
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
            Stores & Locations
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage physical branch outlets and fulfillment hubs.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      <DataTable<IStore>
        records={stores}
        columns={columns}
        getRowKey={(record) => record.id}
        emptyState={{
          icon: <StoreIcon className="w-7 h-7" />,
          title: 'No stores configured',
          description:
            'Add your business physical stores to handle branch inventory.',
        }}
        header={
          <div className="p-4 border-b border-slate-200/60 bg-white flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search stores by code or location..."
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
