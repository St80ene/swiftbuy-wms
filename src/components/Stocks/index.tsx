// pages/StocksPage.tsx
import { useState, useMemo } from 'react';
import {
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Search,
} from 'lucide-react';
import type { IStock } from '@/interfaces/stock.interface';
import { MutationReason, MutationType } from '@/enum/stock.enum';
import DataTable from '../common/DataTable';

export const StocksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<IStock[]>([
    {
      id: 'stk_1',
      product_id: 'prod_101',
      product: {
        id: 'prod_101',
        name: 'MacBook Pro 16" M3 Max',
        sku: 'MBP-M3-16',
      },
      type: MutationType.INFLOW,
      reason: MutationReason.SUPPLIER_RESTOCK,
      quantity: 15,
      unit_cost_price: 2100.0,
      unit_selling_price: 2499.0,
      created_at: new Date('2024-03-01T10:30:00'),
      updated_at: new Date('2024-03-01T10:30:00'),
    },
    {
      id: 'stk_2',
      product_id: 'prod_102',
      product: {
        id: 'prod_102',
        name: 'Logitech MX Master 3S',
        sku: 'LOG-MX3S',
      },
      type: MutationType.OUTFLOW,
      reason: MutationReason.CUSTOMER_SALE,
      quantity: 2,
      unit_cost_price: 70.0,
      unit_selling_price: 99.0,
      created_at: new Date('2024-03-02T14:15:00'),
      updated_at: new Date('2024-03-02T14:15:00'),
    },
  ]);

  const columns = useMemo(
    () => [
      {
        key: 'product',
        header: 'Product',
        width: '30%',
        render: (stock: IStock) => (
          <div>
            <div className="font-semibold text-slate-800 line-clamp-1">
              {stock.product?.name || stock.product_id}
            </div>
            {stock.product?.sku && (
              <span className="text-xs font-mono text-slate-400">
                SKU: {stock.product.sku}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'type',
        header: 'Movement',
        width: '15%',
        render: (stock: IStock) => {
          const isInflow = stock.type === MutationType.INFLOW;
          return (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                isInflow
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {isInflow ? (
                <ArrowDownLeft className="w-3 h-3" />
              ) : (
                <ArrowUpRight className="w-3 h-3" />
              )}
              {stock.type}
            </span>
          );
        },
      },
      {
        key: 'reason',
        header: 'Reason',
        width: '20%',
        render: (stock: IStock) => (
          <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            {stock.reason.replace(/_/g, ' ')}
          </span>
        ),
      },
      {
        key: 'quantity',
        header: 'Quantity',
        width: '10%',
        render: (stock: IStock) => (
          <span
            className={`text-xs font-bold ${
              stock.type === MutationType.INFLOW
                ? 'text-emerald-600'
                : 'text-slate-800'
            }`}
          >
            {stock.type === MutationType.INFLOW
              ? `+${stock.quantity}`
              : `-${stock.quantity}`}
          </span>
        ),
      },
      {
        key: 'pricing',
        header: 'Cost / Selling',
        width: '25%',
        render: (stock: IStock) => (
          <div className="text-xs">
            <span className="text-slate-700 font-medium">
              ${stock.unit_cost_price.toFixed(2)}
            </span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-500">
              ${stock.unit_selling_price.toFixed(2)}
            </span>
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
            Stock Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit inventory inflow, outflow, and manual stock adjustments.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Adjust Stock
        </button>
      </div>

      <DataTable<IStock>
        records={stocks}
        columns={columns}
        getRowKey={(record) => record.id}
        emptyState={{
          icon: <Layers className="w-7 h-7" />,
          title: 'No stock movements recorded',
          description:
            'Inflows, sales, and audit adjustments will appear here.',
        }}
        header={
          <div className="p-4 border-b border-slate-200/60 bg-white flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search ledger by product name or SKU..."
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
