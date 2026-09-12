import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Plus,
} from 'lucide-react';
import type { PaginationMeta } from '@/interfaces';
import type { DataTableColumn } from '@/interfaces/data_table';
import DataTable from '../common/DataTable';

export interface StockMovement {
  id: string;
  store_id: string;
  product_id: string;
  product_name: string;
  type: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'TRANSFER';
  reason: string;
  quantity: number;
  unit_cost_price: number;
  unit_selling_price: number;
  created_by_id: string;
  created_at: string;
}

export const StockMovementsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const movements: StockMovement[] = [
    {
      id: 'sm-001',
      store_id: 'str-main',
      product_id: 'prd-101',
      product_name: 'Wireless Ergonomic Mouse',
      type: 'INBOUND',
      reason: 'Supplier Purchase Delivery',
      quantity: 150,
      unit_cost_price: 18.5,
      unit_selling_price: 34.99,
      created_by_id: 'usr-01',
      created_at: '2026-09-08 14:32',
    },
    {
      id: 'sm-002',
      store_id: 'str-main',
      product_id: 'prd-204',
      product_name: 'Mechanical Keyboard RGB',
      type: 'OUTBOUND',
      reason: 'Customer Order #4910',
      quantity: -5,
      unit_cost_price: 55.0,
      unit_selling_price: 89.99,
      created_by_id: 'usr-02',
      created_at: '2026-09-08 12:15',
    },
    {
      id: 'sm-003',
      store_id: 'str-main',
      product_id: 'prd-305',
      product_name: 'USB-C Docking Station',
      type: 'ADJUSTMENT',
      reason: 'Damaged during inspection',
      quantity: -2,
      unit_cost_price: 42.0,
      unit_selling_price: 75.0,
      created_by_id: 'usr-01',
      created_at: '2026-09-07 16:45',
    },
  ];

  const meta: PaginationMeta = {
    currentPage,
    itemCount: movements.length,
    itemsPerPage: pageSize,
    totalItems: movements.length,
    totalPages: Math.ceil(movements.length / pageSize) || 1,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage * pageSize < movements.length,
  };

  const columns: DataTableColumn<StockMovement>[] = [
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold ${
            item.type === 'INBOUND'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : item.type === 'OUTBOUND'
                ? 'bg-sky-50 border-sky-200 text-sky-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}
        >
          {item.type === 'INBOUND' && <ArrowDownLeft size={10} />}
          {item.type === 'OUTBOUND' && <ArrowUpRight size={10} />}
          {item.type}
        </span>
      ),
    },
    {
      key: 'product_name',
      header: 'Product',
      render: (item) => (
        <span className="font-semibold text-slate-800">
          {item.product_name}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (item) => <span className="text-slate-500">{item.reason}</span>,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (item) => (
        <span
          className={`font-bold ${item.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}
        >
          {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
        </span>
      ),
    },
    {
      key: 'unit_cost_price',
      header: 'Unit Cost',
      render: (item) => `$${item.unit_cost_price.toFixed(2)}`,
    },
    {
      key: 'unit_selling_price',
      header: 'Unit Selling',
      render: (item) => `$${item.unit_selling_price.toFixed(2)}`,
    },
    {
      key: 'total_value',
      header: 'Total Value',
      render: (item) => (
        <span className="font-semibold text-slate-700">
          ${Math.abs(item.quantity * item.unit_cost_price).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (item) => (
        <span className="text-slate-400">{item.created_at}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="text-sky-600" size={24} />
            Stock Movements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit trail of all inbound deliveries, outbound dispatches, and
            inventory adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
            <Download size={14} />
            Export Log
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 shadow-2xs">
            <Plus size={14} />
            Record Movement
          </button>
        </div>
      </div>

      <DataTable<StockMovement>
        records={movements}
        columns={columns}
        meta={meta}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        getRowKey={(record) => record.id}
      />
    </div>
  );
};

export default StockMovementsPage;
