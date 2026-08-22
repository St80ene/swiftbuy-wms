import React from 'react';
import { useInventory } from '../context/InventoryContextProvider';

export const Dashboard: React.FC = () => {
  const { products, purchaseOrders, formatStock } = useInventory();
  const lowStockItems = products.filter((p) => p.is_low_stock);

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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Active SKUs
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {products.length}
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
            {
              purchaseOrders.filter(
                (o) => o.status !== 'RECEIVED' && o.status !== 'CANCELLED',
              ).length
            }
          </p>
        </div>
      </div>

      {/* Actionable Watchlist */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">
            Critical Attention Watchlist
          </h3>
          <span className="text-[11px] bg-rose-50 font-medium text-rose-700 px-2 py-0.5 rounded border border-rose-200">
            Action Required
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
              {lowStockItems.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    {p.name}
                  </td>
                  <td className="px-6 py-3.5 text-rose-600 font-semibold">
                    {formatStock(p)}
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono text-xs">
                    {p.reorder_level} {p.uom_base_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
