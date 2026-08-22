import React from 'react';
import { useInventory } from '../context/InventoryContextProvider';
import type { PurchaseOrder } from '../types';

export const Orders: React.FC = () => {
  const { purchaseOrders, approveOrder, receiveOrder } = useInventory();

  // Configuration map for action button elements based on status phase
  const getStatusAction = (po: PurchaseOrder) => {
    const statusConfig: Record<
      string,
      {
        text: string;
        className: string;
        onClick?: () => void;
        isButton: boolean;
      }
    > = {
      DRAFT: {
        text: 'Authorize Pipeline',
        className:
          'bg-blue-600 hover:bg-blue-700 text-white shadow-xs px-3 py-1.5 rounded-lg transition-all',
        onClick: () => approveOrder(po.id),
        isButton: true,
      },
      APPROVED: {
        text: 'Log Dock Receipt',
        className:
          'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs px-3 py-1.5 rounded-lg transition-all',
        onClick: () => receiveOrder(po.id),
        isButton: true,
      },
      RECEIVED: {
        text: 'Settled & Verified',
        className: 'text-slate-400 font-medium italic',
        isButton: false,
      },
    };

    const current = statusConfig[po.status];
    if (!current) return null;

    return current.isButton ? (
      <button
        onClick={current.onClick}
        className={`cursor-pointer text-xs font-medium ${current.className}`}
      >
        {current.text}
      </button>
    ) : (
      <span className={`cursor-pointer text-xs ${current.className}`}>
        {current.text}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Procurement Pipelines
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Authorization and validation logs for commercial inventory inflow.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Supplier Profile</th>
                <th className="px-6 py-4">Financial Comm.</th>
                <th className="px-6 py-4">Pipeline Phase</th>
                <th className="px-6 py-4 text-right">Corporate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => (
                <tr
                  key={po.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-blue-600 font-semibold">
                    {po.po_number}
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {po.supplier_name}
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">
                    ${po.total_estimated_cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 font-semibold rounded border ${
                        po.status === 'DRAFT'
                          ? 'bg-slate-50 border-slate-200 text-slate-500'
                          : po.status === 'APPROVED'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {getStatusAction(po)}
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
