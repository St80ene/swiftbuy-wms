import React from 'react';

interface DashboardProduct {
  id: string;
  name: string;
  stock_quantity: number;
  reorder_level: number;
  uom_display_name: string;
  is_low_stock: boolean;
}

interface DashboardPurchaseOrder {
  id: string;
  status: 'DRAFT' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
}

const mockProducts: DashboardProduct[] = [
  {
    id: 'prod-001',
    name: 'Premium Coffee Beans',
    stock_quantity: 3,
    reorder_level: 10,
    uom_display_name: 'KG',
    is_low_stock: true,
  },
  {
    id: 'prod-002',
    name: 'Thermal Receipt Paper',
    stock_quantity: 8,
    reorder_level: 20,
    uom_display_name: 'PCS',
    is_low_stock: true,
  },
  {
    id: 'prod-003',
    name: 'Wireless Barcode Scanner',
    stock_quantity: 25,
    reorder_level: 5,
    uom_display_name: 'PCS',
    is_low_stock: false,
  },
  {
    id: 'prod-004',
    name: 'Surface Sanitizer',
    stock_quantity: 0,
    reorder_level: 5,
    uom_display_name: 'L',
    is_low_stock: true,
  },
];

const mockPurchaseOrders: DashboardPurchaseOrder[] = [
  {
    id: 'po-001',
    status: 'DRAFT',
  },
  {
    id: 'po-002',
    status: 'APPROVED',
  },
  {
    id: 'po-003',
    status: 'RECEIVED',
  },
];

const formatStock = (product: DashboardProduct): string => {
  return `${product.stock_quantity.toLocaleString()} ${
    product.uom_display_name
  }`;
};

export const Dashboard: React.FC = () => {
  const lowStockItems = mockProducts.filter(
    (product) =>
      product.is_low_stock || product.stock_quantity <= product.reorder_level,
  );

  const openPurchaseOrders = mockPurchaseOrders.filter(
    (order) => order.status !== 'RECEIVED' && order.status !== 'CANCELLED',
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Executive Summary
        </h2>

        <p className="text-sm text-slate-500 mt-0.5">
          High-level operations metrics and risk thresholds.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Active SKUs
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {mockProducts.length}
          </p>
        </div>

        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Stock Deficiencies
          </p>

          <p className="text-3xl font-bold text-rose-600 mt-2">
            {lowStockItems.length}
          </p>
        </div>

        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Open Procurement Channels
          </p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {openPurchaseOrders.length}
          </p>
        </div>
      </div>

      {/* Low Stock Watchlist */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">
            Critical Attention Watchlist
          </h3>

          <span className="text-[11px] bg-rose-50 font-medium text-rose-700 px-2 py-0.5 rounded border border-rose-200">
            {lowStockItems.length} Action Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Current Stock</th>
                <th className="px-6 py-3">Reorder Point</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {lowStockItems.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    {product.name}
                  </td>

                  <td className="px-6 py-3.5 text-rose-600 font-semibold">
                    {formatStock(product)}
                  </td>

                  <td className="px-6 py-3.5 text-slate-400 font-mono text-xs">
                    {product.reorder_level} {product.uom_display_name}
                  </td>
                </tr>
              ))}

              {lowStockItems.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    No stock deficiencies detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
