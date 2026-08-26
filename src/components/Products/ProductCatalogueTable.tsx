import React from 'react';
import type { Product } from '../../types';
import { UomDisplayName, UomType } from '../../types';
import { Eye, PackageSearch } from 'lucide-react';

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
   * Pagination calculation range.
   */

  const itemsPerPage = meta?.itemsPerPage ?? meta?.itemCount ?? products.length;

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
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200/60">
                      <PackageSearch className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 mb-1">
                      No products found
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      We couldn’t find any items matching your criteria. Try
                      adjusting your search query or clear the active filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const primaryImage = product.images?.[0]?.url;

                const isDeficient =
                  product.is_low_stock ||
                  product.stock_quantity <= product.reorder_level;

                return (
                  <tr
                    key={product.id}
                    onClick={() => onSelectProduct?.(product)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-500 shrink-0 select-none">
                            {product.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate max-w-[220px]">
                            {product.name}
                          </div>

                          <div className="mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-tight">
                              SKU: {product.id.split('-')[0]}
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
                        {formatStockQuantity(product)}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase text-slate-400">
                          {product.uom_type}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Min: {formatReorderLevel(product)}
                        </span>
                      </div>
                    </td>

                    {/* Cost Price */}
                    <td className="px-4 py-3 font-mono text-slate-500 text-xs whitespace-nowrap">
                      {formatCurrency(Number(product.cost_price))}
                    </td>

                    {/* Selling Price */}
                    <td className="px-4 py-3 font-mono font-semibold text-emerald-600 text-xs whitespace-nowrap">
                      {formatCurrency(Number(product.selling_price))}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct?.(product);
                        }}
                        className="inline-flex items-center cursor-pointer gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg
      hover:bg-slate-50
      hover:border-slate-300
      focus:outline-none
      focus:ring-2
      focus:ring-slate-300
      transition-colors
    "
                        aria-label={`See more details for ${product.name}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        See more
                      </button>
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
