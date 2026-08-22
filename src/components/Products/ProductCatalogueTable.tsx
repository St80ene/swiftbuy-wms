import React from 'react';
import type { Product } from '../../types';
import { UomType } from '../../enum/product';

interface ProductTableProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductCatalogTable: React.FC<ProductTableProps> = ({
  products,
  onSelectProduct,
}) => {
  /**
   * Transforms raw backend base integer values into human-readable UOM displays.
   * - WEIGHT: Base grams (g) -> Display kilograms (kg)
   * - VOLUME: Base milliliters (ml) -> Display liters (L)
   * - UNIT: Discrete count (pcs)
   */
  const formatStockQuantity = (product: Product): string => {
    const { stock_quantity, uom_type, uom_display_name } = product;

    if (uom_type === UomType.WEIGHT) {
      const inKg = stock_quantity / 1000;
      return `${inKg.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })} ${uom_display_name}`;
    }

    if (uom_type === UomType.VOLUME) {
      const inLiters = stock_quantity / 1000;
      return `${inLiters.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })} ${uom_display_name}`;
    }

    return `${stock_quantity.toLocaleString()} ${uom_display_name}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-50/75 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200/60 select-none">
              <th className="px-6 py-3.5">Product & SKU</th>
              <th className="px-6 py-3.5">UOM Metric</th>
              <th className="px-6 py-3.5">Stock On Hand</th>
              <th className="px-6 py-3.5">Cost Price</th>
              <th className="px-6 py-3.5">Retail Price</th>
              <th className="px-6 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <p className="text-sm">No products found in catalog.</p>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const primaryImage = p.images?.[0]?.url;
                const isDeficient =
                  p.is_low_stock || p.stock_quantity <= p.reorder_level;

                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProduct?.(p)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* Item Name & Visual Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              // Image load fallback safeguard
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-500 shrink-0 select-none">
                            {p.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate max-w-[220px]">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-tight truncate max-w-[140px]">
                              SKU: {p.id.split('-')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dimension / UOM Badge */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100/80 border border-slate-200/60 font-mono text-xs font-medium text-slate-600">
                        <span className="text-[10px] uppercase text-slate-400">
                          {p.uom_type}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>{p.uom_display_name}</span>
                      </div>
                    </td>

                    {/* Stock Balance & Threshold */}
                    <td className="px-6 py-4">
                      <div
                        className={`font-semibold text-sm ${
                          isDeficient ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {formatStockQuantity(p)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        Min Threshold: {p.reorder_level} {p.uom_base_name}
                      </div>
                    </td>

                    {/* Cost Price */}
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                      {formatCurrency(Number(p.cost_price))}
                    </td>

                    {/* Retail Selling Value */}
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-600 text-xs">
                      {formatCurrency(Number(p.selling_price))}
                    </td>

                    {/* Status Index Badge */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isDeficient
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDeficient
                              ? 'bg-rose-500 animate-pulse'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {isDeficient ? 'Deficient' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
