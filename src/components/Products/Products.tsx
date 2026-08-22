import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContextProvider';
import type { Product } from '../../types';
import { ProductCatalogTable } from './ProductCatalogueTable';

const UOM_MAP = {
  UNIT: { base: 'pcs', display: 'pcs' },
  WEIGHT: { base: 'g', display: 'kg' },
  VOLUME: { base: 'ml', display: 'L' },
} as const;

type UomType = keyof typeof UOM_MAP;

// Extend your product map presentation to optionally handle image paths
interface ProductWithImage extends Product {
  image_url?: string;
}

export const Products: React.FC = () => {
  const { products, formatStock, setProducts } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    image_url: '', // New image tracking field
    uom_type: 'UNIT' as UomType,
    stock_quantity: '',
    reorder_level: '',
    cost_price: '',
    selling_price: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const uomMeta = UOM_MAP[formData.uom_type];

    const newProduct: ProductWithImage = {
      id: `p${products.length + 1}`,
      name: formData.name,
      image_url: formData.image_url || undefined, // Store user provided link
      uom_type: formData.uom_type,
      uom_base_name: uomMeta.base,
      uom_display_name: uomMeta.display,
      stock_quantity: Number(formData.stock_quantity),
      reorder_level: Number(formData.reorder_level),
      cost_price: Number(formData.cost_price),
      selling_price: Number(formData.selling_price),
      is_low_stock:
        Number(formData.stock_quantity) <= Number(formData.reorder_level),
    };

    setProducts((prev) => [...prev, newProduct]);

    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({
      name: '',
      image_url: '',
      uom_type: 'UNIT',
      stock_quantity: '',
      reorder_level: '',
      cost_price: '',
      selling_price: '',
    });
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      {/* Header View Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory Ledger & Management
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Comprehensive structural item balance, financial valuations, and
            catalog control.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-all shadow-xs self-start sm:self-center"
        >
          + Restock / New SKU
        </button>
      </div>

      {/* Main Table Layout */}
      <ProductCatalogTable
        products={products}
        onSelectProduct={(product) => console.log(product)}
      />

      {/* Modal View Block */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-[scaleUp_0.2s_ease-out]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add Product to Shelves
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Register a new commercial SKU tracking signature.
                </p>
              </div>
              <button
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer disabled:opacity-50"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Premium Coffee Beans"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Product Image Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Product Image URL{' '}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/... or leave blank"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono text-xs"
                />
              </div>

              {/* Automated UOM Selector Block */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Unit of Measure (UOM Class)
                </label>
                <select
                  name="uom_type"
                  value={formData.uom_type}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="UNIT">UNIT (Count - pcs)</option>
                  <option value="WEIGHT">WEIGHT (Mass - g / kg)</option>
                  <option value="VOLUME">VOLUME (Fluid - ml / L)</option>
                </select>
              </div>

              {/* Quantitative Stock Boundaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    required
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    name="reorder_level"
                    required
                    min="0"
                    value={formData.reorder_level}
                    onChange={handleInputChange}
                    placeholder="50"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    name="cost_price"
                    required
                    step="0.01"
                    min="0"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    name="selling_price"
                    required
                    step="0.01"
                    min="0"
                    value={formData.selling_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons Footer Area */}
              <div className="flex items-center gap-3 border-t border-slate-100 pt-5 mt-6">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 cursor-pointer border border-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 cursor-pointer bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 shadow-xs flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mocking API Request...
                    </>
                  ) : (
                    'Commit SKU'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
