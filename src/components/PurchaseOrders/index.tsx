import React, { useState } from 'react';
import { ShoppingCart, Plus, Truck, Eye } from 'lucide-react';
import DataTable from '../Common/DataTable';
import type { DataTableColumn, PaginationMeta } from '@/interfaces/data_table';

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SENT_TO_SUPPLIER = 'SENT_TO_SUPPLIER',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  product_name: string;
  quantity_requested: number;
  estimated_unit_cost: number;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  status: PurchaseOrderStatus;
  total_estimated_cost: number;
  items: PurchaseOrderItem[];
  created_at: string;
}

export const PurchaseOrdersPage: React.FC = () => {
  const [selectedPoId, setSelectedPoId] = useState<string | null>('po-101');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const orders: PurchaseOrder[] = [
    {
      id: 'po-101',
      po_number: 'PO-2026-0891',
      supplier_id: 'sup-01',
      supplier_name: 'Apex Wholesalers Inc',
      status: PurchaseOrderStatus.PENDING_APPROVAL,
      total_estimated_cost: 4250.0,
      created_at: '2026-09-08 10:15',
      items: [
        {
          id: 'poi-1',
          purchase_order_id: 'po-101',
          product_id: 'prd-101',
          product_name: '4K Ultra HD Monitor 27"',
          quantity_requested: 10,
          estimated_unit_cost: 250.0,
        },
        {
          id: 'poi-2',
          purchase_order_id: 'po-101',
          product_id: 'prd-102',
          product_name: 'USB-C Cable Multi-pack',
          quantity_requested: 100,
          estimated_unit_cost: 17.5,
        },
      ],
    },
    {
      id: 'po-102',
      po_number: 'PO-2026-0842',
      supplier_id: 'sup-02',
      supplier_name: 'Global Tech Distribution',
      status: PurchaseOrderStatus.RECEIVED,
      total_estimated_cost: 12800.0,
      created_at: '2026-09-02 14:00',
      items: [
        {
          id: 'poi-3',
          purchase_order_id: 'po-102',
          product_id: 'prd-201',
          product_name: 'Laptop Stand Aluminum',
          quantity_requested: 320,
          estimated_unit_cost: 40.0,
        },
      ],
    },
  ];

  const meta: PaginationMeta = {
    currentPage,
    itemsPerPage: pageSize,
    totalItems: orders.length,
    totalPages: Math.ceil(orders.length / pageSize) || 1,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage * pageSize < orders.length,
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.PENDING_APPROVAL:
      case PurchaseOrderStatus.PENDING:
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case PurchaseOrderStatus.APPROVED:
      case PurchaseOrderStatus.SENT_TO_SUPPLIER:
        return 'bg-sky-50 border-sky-200 text-sky-700';
      case PurchaseOrderStatus.RECEIVED:
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-600';
    }
  };

  const poColumns: DataTableColumn<PurchaseOrder>[] = [
    {
      key: 'po_number',
      header: 'PO Number',
      render: (po) => (
        <span className="font-mono font-bold text-sky-600">{po.po_number}</span>
      ),
    },
    {
      key: 'supplier_name',
      header: 'Supplier',
      render: (po) => (
        <span className="text-slate-800 font-medium flex items-center gap-1.5">
          <Truck size={13} className="text-slate-400" />
          {po.supplier_name}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (po) => (
        <span
          className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(po.status)}`}
        >
          {po.status}
        </span>
      ),
    },
    {
      key: 'total_estimated_cost',
      header: 'Est. Total Cost',
      render: (po) => (
        <span className="font-bold text-slate-900">
          ${po.total_estimated_cost.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'items_count',
      header: 'Items',
      render: (po) => `${po.items.length} item(s)`,
    },
    {
      key: 'created_at',
      header: 'Created Date',
      render: (po) => <span className="text-slate-500">{po.created_at}</span>,
    },
  ];

  const itemColumns: DataTableColumn<PurchaseOrderItem>[] = [
    {
      key: 'product_id',
      header: 'Product ID',
      render: (i) => (
        <span className="font-mono text-slate-500">{i.product_id}</span>
      ),
    },
    {
      key: 'product_name',
      header: 'Product Name',
      render: (i) => <span className="text-slate-800">{i.product_name}</span>,
    },
    {
      key: 'quantity_requested',
      header: 'Qty Requested',
      render: (i) => (
        <span className="font-semibold text-slate-900">
          {i.quantity_requested}
        </span>
      ),
    },
    {
      key: 'estimated_unit_cost',
      header: 'Est. Unit Cost',
      render: (i) => `$${i.estimated_unit_cost.toFixed(2)}`,
    },
    {
      key: 'line_total',
      header: 'Line Total',
      render: (i) => (
        <span className="font-semibold text-sky-600">
          ${(i.quantity_requested * i.estimated_unit_cost).toFixed(2)}
        </span>
      ),
    },
  ];

  const selectedOrder = orders.find((o) => o.id === selectedPoId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="text-sky-600" size={24} />
            Purchase Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage procurement requests, item line specifications, and supplier
            fulfillment statuses.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 shadow-2xs">
          <Plus size={14} />
          Create Purchase Order
        </button>
      </div>

      <DataTable<PurchaseOrder>
        records={orders}
        columns={poColumns}
        meta={meta}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSelectRecord={(po) =>
          setSelectedPoId(selectedPoId === po.id ? null : po.id)
        }
        getRowKey={(record) => record.id}
        getRowClassName={(record) =>
          record.id === selectedPoId ? 'bg-sky-50/50' : ''
        }
      />

      {selectedOrder && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Eye size={14} className="text-sky-600" />
            Items for {selectedOrder.po_number} (`purchase_order_items`)
          </h3>
          <DataTable<PurchaseOrderItem>
            records={selectedOrder.items}
            columns={itemColumns}
            getRowKey={(record) => record.id}
          />
        </div>
      )}
    </div>
  );
};

export default PurchaseOrdersPage;
