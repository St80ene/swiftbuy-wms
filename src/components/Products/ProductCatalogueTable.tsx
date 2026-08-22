import React from 'react';
import type { Product } from '../../types';
import { UomDisplayName, UomType } from '../../enum/product';

// Define the exact meta interface matching your NestJS backend
interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductDisplayTableProps {
  products: Product[];
  meta?: PaginationMeta; // Accepts the backend pagination metrics
  onPageChange?: (newPage: number) => void; // Event callback handler
  isPlaceholderData?: boolean; // Fades table slightly while fetching next page
  onSelectProduct?: (product: Product) => void;
}

export const ProductCatalogTable: React.FC<ProductDisplayTableProps> = ({
  products,
  meta,
  onPageChange,
  isPlaceholderData = false,
  onSelectProduct,
}) => {
  /**
   * Converts backend base-unit quantities into human-readable values.
   *
   * Example:
   * 3000 G  -> 3 KG
   * 1500 ML -> 1.5 L
   * 25 PCS  -> 25 PCS
   */
  const formatQuantity = (
    quantity: number,
    uomType: UomType,
    displayName: UomDisplayName,
  ): string => {
    if (uomType === UomType.WEIGHT || uomType === UomType.VOLUME) {
      const convertedQuantity = quantity / 1000;

      return `${convertedQuantity.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })} ${displayName}`;
    }

    return `${quantity.toLocaleString()} ${displayName}`;
  };

  const formatStockQuantity = (product: Product): string =>
    formatQuantity(
      product.stock_quantity,
      product.uom_type,
      product.uom_display_name,
    );

  const formatReorderLevel = (product: Product): string =>
    formatQuantity(
      product.reorder_level,
      product.uom_type,
      product.uom_display_name,
    );

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  /**
   * Pagination range.
   *
   * Page 1 -> Showing 1–10 of 100
   * Page 2 -> Showing 11–20 of 100
   * Page 3 -> Showing 21–30 of 100
   */
  const itemsPerPage = meta?.itemsPerPage ?? meta?.limit ?? products.length;

  const startItem =
    meta && products.length > 0 ? (meta.currentPage - 1) * itemsPerPage + 1 : 0;

  const endItem =
    meta && products.length > 0
      ? Math.min(
          (meta.currentPage - 1) * itemsPerPage + products.length,
          meta.totalItems,
        )
      : 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
      <div
        className={`overflow-x-auto transition-opacity duration-200 ${
          isPlaceholderData ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <table className="w-full text-left text-sm text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-50/75 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200/60 select-none">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Selling Price</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-slate-400"
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
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                            onError={(e) => {
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

                          <div className="mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-tight">
                              SKU: {p.id.split('-')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Stock + UOM */}
                    <td className="px-4 py-3">
                      <div
                        className={`font-semibold text-sm ${
                          isDeficient ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {formatStockQuantity(p)}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase text-slate-400">
                          {p.uom_type}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Min: {formatReorderLevel(p)}
                        </span>
                      </div>
                    </td>

                    {/* Cost Price */}
                    <td className="px-4 py-3 font-mono text-slate-500 text-xs whitespace-nowrap">
                      {formatCurrency(Number(p.cost_price))}
                    </td>

                    {/* Selling Price */}
                    <td className="px-4 py-3 font-mono font-semibold text-emerald-600 text-xs whitespace-nowrap">
                      {formatCurrency(Number(p.selling_price))}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap ${
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

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 bg-slate-50/50 border-t border-slate-200/60 select-none">
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-700">{startItem}</span>
            {' – '}
            <span className="font-medium text-slate-700">{endItem}</span>
            {' of '}
            <span className="font-medium text-slate-700">
              {meta.totalItems}
            </span>{' '}
            items
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(meta.currentPage - 1)}
              disabled={!meta.hasPreviousPage}
              className="px-3 py-1.5 text-xs cursor-pointer font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="text-xs text-slate-600 font-medium px-2 whitespace-nowrap">
              Page {meta.currentPage} of {meta.totalPages}
            </div>

            <button
              onClick={() => onPageChange?.(meta.currentPage + 1)}
              disabled={!meta.hasNextPage}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
