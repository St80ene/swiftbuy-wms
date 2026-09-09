import React, { useState } from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  Package,
  ShoppingCart,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import type { PaginationMeta } from '@/interfaces';
import type { DataTableColumn } from '@/interfaces/data_table';
import DataTable from './common/DataTable';
export interface DashboardProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock_quantity: number;
  reorder_level: number;
  uom_display_name: string;
  is_low_stock: boolean;
  affected_stores_count: number;
}

export interface DashboardPurchaseOrder {
  id: string;
  po_number: string;
  supplier: string;
  status: 'DRAFT' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  total_amount: number;
}

const mockProducts: DashboardProduct[] = [
  {
    id: 'prod-001',
    name: 'Premium Arabica Coffee Beans 1kg',
    sku: 'BEV-CB-001',
    category: 'Beverages',
    stock_quantity: 3,
    reorder_level: 10,
    uom_display_name: 'KG',
    is_low_stock: true,
    affected_stores_count: 3,
  },
  {
    id: 'prod-002',
    name: 'Thermal Receipt Paper 80mm',
    sku: 'SUP-RP-080',
    category: 'Store Supplies',
    stock_quantity: 8,
    reorder_level: 20,
    uom_display_name: 'PCS',
    is_low_stock: true,
    affected_stores_count: 5,
  },
  {
    id: 'prod-003',
    name: 'Surface Sanitizer Spray 1L',
    sku: 'CLN-SAN-001',
    category: 'Cleaning',
    stock_quantity: 0,
    reorder_level: 12,
    uom_display_name: 'L',
    is_low_stock: true,
    affected_stores_count: 2,
  },
  {
    id: 'prod-004',
    name: 'Wireless 2D Barcode Scanner',
    sku: 'HW-SCN-002',
    category: 'POS Hardware',
    stock_quantity: 25,
    reorder_level: 5,
    uom_display_name: 'PCS',
    is_low_stock: false,
    affected_stores_count: 0,
  },
];

const mockPurchaseOrders: DashboardPurchaseOrder[] = [
  {
    id: 'po-001',
    po_number: 'PO-2026-0891',
    supplier: 'Apex Wholesalers Inc',
    status: 'DRAFT',
    total_amount: 3450.0,
  },
  {
    id: 'po-002',
    po_number: 'PO-2026-0888',
    supplier: 'Global Distribution Co',
    status: 'APPROVED',
    total_amount: 8200.0,
  },
  {
    id: 'po-003',
    po_number: 'PO-2026-0870',
    supplier: 'PaperDirect Ltd',
    status: 'RECEIVED',
    total_amount: 1250.0,
  },
];

export const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const lowStockItems = mockProducts.filter(
    (product) =>
      product.is_low_stock || product.stock_quantity <= product.reorder_level,
  );

  const openPurchaseOrders = mockPurchaseOrders.filter(
    (order) => order.status !== 'RECEIVED' && order.status !== 'CANCELLED',
  );

  const paginationMeta: PaginationMeta = {
    currentPage,
    itemCount: lowStockItems.length,
    itemsPerPage: pageSize,
    totalItems: lowStockItems.length,
    totalPages: Math.ceil(lowStockItems.length / pageSize) || 1,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage * pageSize < lowStockItems.length,
  };

  const columns: DataTableColumn<DashboardProduct>[] = [
    {
      key: 'name',
      header: 'Product / SKU',
      render: (product) => (
        <div>
          <span className="font-semibold text-slate-900 block">
            {product.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {product.sku} • {product.category}
          </span>
        </div>
      ),
    },
    {
      key: 'stock_quantity',
      header: 'Current Level',
      render: (product) => (
        <span
          className={`font-bold ${
            product.stock_quantity === 0 ? 'text-rose-600' : 'text-amber-600'
          }`}
        >
          {product.stock_quantity.toLocaleString()} {product.uom_display_name}
        </span>
      ),
    },
    {
      key: 'reorder_level',
      header: 'Reorder Point',
      render: (product) => (
        <span className="text-slate-500 font-mono text-xs">
          {product.reorder_level} {product.uom_display_name}
        </span>
      ),
    },
    {
      key: 'affected_stores',
      header: 'Chain Impact',
      render: (product) => (
        <span className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
          <AlertTriangle size={11} />
          {product.affected_stores_count} stores low
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6 animate-[fadeIn_0.2s_ease-out]">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <LayoutDashboard className="text-sky-600" size={24} />
          Executive Operations Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time snapshot of chain inventory health, stock deficiency
          watchlists, and active procurement pipelines.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active SKU Catalog
            </span>
            <Package size={18} className="text-sky-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {mockProducts.length}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-2">
            <ArrowUpRight size={13} />
            <span>Across all regional stores</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Critical Stock Deficiencies
            </span>
            <TrendingDown size={18} className="text-rose-600" />
          </div>
          <p className="text-3xl font-bold text-rose-600">
            {lowStockItems.length}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-2">
            <AlertTriangle size={12} />
            <span>Items below threshold</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Open PO Pipelines
            </span>
            <ShoppingCart size={18} className="text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-sky-600">
            {openPurchaseOrders.length}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-2">
            <span>Pending supplier delivery</span>
          </div>
        </div>
      </div>

      {/* Low Stock Watchlist using DataTable */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600" />
            Stock Deficiencies & Reorder Watchlist
          </h2>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
            {lowStockItems.length} SKUs Require Action
          </span>
        </div>

        <DataTable<DashboardProduct>
          records={lowStockItems}
          columns={columns}
          meta={paginationMeta}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          getRowKey={(record) => record.id}
        />
      </div>
    </div>
  );
};

export default Dashboard;
